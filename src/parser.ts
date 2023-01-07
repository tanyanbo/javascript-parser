import { Tokenizer } from "./tokenizer";
import { ASTNode, Operator, Token, TokenType } from "./types";
import { astFactory } from "../helpers/ast-factory";

export class Parser {
  #tokenizer: Tokenizer;
  #lookahead: Token;

  constructor(str: string) {
    this.#tokenizer = new Tokenizer(str);
    this.#lookahead = this.#tokenizer.getNextToken();
  }

  parse() {
    return this.#program();
  }

  #program(): ASTNode {
    return astFactory(this.#statementList());
  }

  #statementList(block = false): (ASTNode | null)[] {
    const statements: (ASTNode | null)[] = [];

    if (block && this.#lookahead.type === "}") {
      this.#eat("}");
      return statements;
    }

    let currentStatement = this.#statement();

    if (!currentStatement) {
      return statements;
    }

    do {
      statements.push(currentStatement);
      if (block && this.#lookahead.type === "}") {
        this.#eat("}");
        return statements;
      }
      currentStatement = this.#statement();
    } while ((!block && currentStatement) || block);

    return statements;
  }

  #statement(): ASTNode | null {
    switch (this.#lookahead.type) {
      case "EndOfFile":
        return null;
      case "{":
        this.#eat("{");
        return this.#blockStatement();
      case "VariableDeclaration":
        return this.#variableDeclaration();
      case "if":
        return this.#ifStatement();
      case "function":
        return this.#functionDeclaration();
      default:
        return this.#expressionStatement();
    }
  }

  #functionDeclaration(): ASTNode {
    this.#eat("function");
    const id = this.#identifier();
    const params = this.#functionParams();

    this.#eat("{");
    const body = this.#blockStatement();
    return {
      type: "FunctionDeclaration",
      id,
      params,
      body,
    };
  }

  #functionParams(): ASTNode[] {
    this.#eat("(");
    const params: ASTNode[] = [];

    while (this.#lookahead.type === "Identifier") {
      params.push({
        type: "Identifier",
        name: this.#eat("Identifier").value,
      });
      // @ts-ignore
      if (this.#lookahead.type === ")") {
        this.#eat(")");
        break;
      }
      this.#eat(",");
    }

    if (params.length === 0 && this.#lookahead.type === ")") {
      this.#eat(")");
    }

    return params;
  }

  #ifStatement(): ASTNode {
    this.#eat("if");
    this.#eat("(");
    const condition = this.#expressionStatement();
    this.#eat(")");

    if (this.#lookahead.type === "{") {
      this.#eat("{");
      const body = this.#blockStatement();
      return {
        type: "IfStatement",
        condition,
        body,
      };
    }

    const body = this.#expressionStatement();
    return {
      type: "IfStatement",
      condition,
      body: {
        type: "BlockStatement",
        body: [body],
      },
    };
  }

  #blockStatement(): ASTNode {
    return {
      type: "BlockStatement",
      body: this.#statementList(true),
    };
  }

  #expressionStatement(): ASTNode {
    const node = this.#assignmentExpression();
    if (this.#lookahead.type === ";") {
      this.#eat(";");
    }
    return node;
  }

  #variableDeclaration(): ASTNode {
    this.#eat("VariableDeclaration");
    const variableName: string = this.#eat("Identifier").value;

    if (this.#lookahead.type !== "AssignmentOperator") {
      return {
        type: "VariableDeclaration",
        id: {
          type: "Identifier",
          name: variableName,
        },
      };
    }

    this.#eat("AssignmentOperator");
    const value = this.#assignmentExpression();
    return {
      type: "VariableDeclaration",
      id: {
        type: "Identifier",
        name: variableName,
      },
      value,
    };
  }

  #assignmentExpression(): ASTNode {
    let id = this.#equalityExpression();

    if (
      this.#lookahead.type === "AssignmentOperator" ||
      this.#lookahead.type === "ComplexAssignmentOperator"
    ) {
      const operator = this.#eat(this.#lookahead.type);
      let value = this.#assignmentExpression();

      if (!this.#checkIsValidLeftHandSide(id)) {
        throw new Error("Not valid left hand side of assignment operator");
      }

      id = {
        type:
          operator.type === "AssignmentOperator"
            ? "AssignmentExpression"
            : "ComplexAssignmentExpression",
        id,
        operator: operator.value as Operator,
        value,
      };
    }
    return id;
  }

  #checkIsValidLeftHandSide(left: ASTNode): boolean {
    return left.type === "Identifier" || left.type === "MemberExpression";
  }

  #equalityExpression(left?: ASTNode): ASTNode {
    return this.#binaryExpression({
      expression: this.#comparisonExpression.bind(this),
      lookaheadType: "EqualityOperator",
      left,
    });
  }

  #comparisonExpression(left?: ASTNode): ASTNode {
    return this.#binaryExpression({
      expression: this.#additiveExpression.bind(this),
      lookaheadType: "ComparisonOperator",
      left,
    });
  }

  #additiveExpression(left?: ASTNode): ASTNode {
    return this.#binaryExpression({
      expression: this.#multiplicativeExpression.bind(this),
      lookaheadType: "AdditiveOperator",
      left,
    });
  }

  #multiplicativeExpression(left?: ASTNode): ASTNode {
    return this.#binaryExpression({
      expression: this.#powerExpression.bind(this),
      lookaheadType: "MultiplicativeOperator",
      left,
    });
  }

  #powerExpression(left?: ASTNode): ASTNode {
    return this.#binaryExpression({
      expression: this.#parenthesizedExpression.bind(this),
      lookaheadType: "PowerOperator",
      left,
    });
  }

  #parenthesizedExpression(): ASTNode {
    if (this.#lookahead.type === "(") {
      this.#eat("(");
      const node = this.#assignmentExpression();
      this.#eat(")");
      return {
        type: "ParenthesizedExpression",
        body: node,
      };
    }

    return this.#primaryExpression();
  }

  #binaryExpression({
    expression,
    lookaheadType,
    left,
    args,
  }: {
    expression: (...args: any[]) => ASTNode;
    lookaheadType: TokenType;
    left?: ASTNode;
    args?: any[];
  }) {
    if (args == null) {
      args = [];
    }

    if (left == null) {
      left = expression(...args);
    }

    while (this.#lookahead.type === lookaheadType) {
      const operator = this.#eat(lookaheadType).value as Operator;
      const right = expression(...args);
      left = {
        type: "BinaryExpression",
        left,
        operator,
        right,
      };
    }
    return left;
  }

  #primaryExpression(): ASTNode {
    switch (this.#lookahead.type) {
      case "number":
        return this.#numericLiteral();
      case "string":
        return this.#stringLiteral();
      case "Identifier":
        const lhs = this.#leftHandSideExpression();
        const maybeCallExpression = this.#maybeCallExpression(lhs);
        if (maybeCallExpression != null) {
          return maybeCallExpression;
        }
        return lhs;
    }

    throw new Error(`Invalid primary expression. Got: ${this.#lookahead.type}`);
  }

  #numericLiteral(): ASTNode {
    const node = this.#eat("number");

    return {
      type: "NumericLiteral",
      value: +node.value,
    };
  }

  #stringLiteral(): ASTNode {
    const node = this.#eat("string");

    return {
      type: "StringLiteral",
      value: node.value.slice(1, -1),
    };
  }

  #leftHandSideExpression(): ASTNode {
    const identifier = this.#identifier();
    switch (this.#lookahead.type) {
      case ".":
        this.#eat(".");
        const property = this.#identifier();
        return {
          type: "MemberExpression",
          object: identifier,
          property,
        };
      default:
        return identifier;
    }
  }

  #maybeCallExpression(callee: ASTNode): ASTNode | null {
    if (this.#lookahead.type === "(") {
      this.#eat("(");
      const args: ASTNode[] = [];
      // @ts-ignore
      while (this.#lookahead.type !== ")") {
        args.push(this.#assignmentExpression());
        // @ts-ignore
        if (this.#lookahead.type === ",") {
          this.#eat(",");
        }
      }
      this.#eat(")");
      if (this.#lookahead.type === ";") {
        this.#eat(";");
      }

      const callExpressionNode: ASTNode = {
        type: "CallExpression",
        callee,
        arguments: args,
      };

      const maybeCallExpression = this.#maybeCallExpression(callExpressionNode);
      if (maybeCallExpression == null) {
        return callExpressionNode;
      }
      return maybeCallExpression;
    }

    return null;
  }

  #identifier(): ASTNode {
    const node = this.#eat("Identifier");

    return {
      type: "Identifier",
      name: node.value,
    };
  }

  #eat(type: TokenType): Token {
    const token = this.#lookahead;
    if (token.type !== type) {
      throw new Error(
        `Token does not match expected type. Expected: ${type} Got: ${token.type}`
      );
    }
    this.#lookahead = this.#tokenizer.getNextToken();
    return token;
  }
}
