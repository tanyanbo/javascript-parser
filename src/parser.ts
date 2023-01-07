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
      case "for":
        return this.#forStatement();
      default:
        return this.#expressionStatement();
    }
  }

  #forStatement(): ASTNode {
    this.#eat("for");
    this.#eat("(");

    let init: ASTNode | null = null;
    switch (this.#lookahead.type) {
      case "VariableDeclaration":
        init = this.#variableDeclaration(false);
        break;
      case "Identifier":
        init = this.#assignmentExpression();
        break;
    }

    this.#eat(";");
    let test: ASTNode | null = null;
    if (this.#lookahead.type !== ";") {
      test = this.#assignmentExpression();
    }
    this.#eat(";");

    let update: ASTNode | null = null;
    if (this.#lookahead.type !== ")") {
      update = this.#assignmentExpression();
    }
    this.#eat(")");

    let body: ASTNode | null;
    switch (this.#lookahead.type) {
      case "{":
        this.#eat("{");
        body = this.#blockStatement();
        break;
      default:
        body = {
          type: "BlockStatement",
          body: [this.#statement()],
        };
    }

    if (body == null) {
      throw new Error("No body in for loop");
    }

    return {
      type: "ForStatement",
      init,
      test,
      update,
      body,
    };
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

    const body = this.#statement();
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

  #expressionStatement(eatSemicolon: boolean = true): ASTNode {
    const node = this.#assignmentExpression();
    if (eatSemicolon && this.#lookahead.type === ";") {
      this.#eat(";");
    }
    return node;
  }

  #variableDeclaration(eatSemicolon: boolean = true): ASTNode {
    const kind = this.#eat("VariableDeclaration").value as "let" | "const";
    const variableName: string = this.#eat("Identifier").value;

    if (this.#lookahead.type !== "AssignmentOperator") {
      return {
        type: "VariableDeclaration",
        id: {
          type: "Identifier",
          name: variableName,
        },
        kind,
      };
    }

    this.#eat("AssignmentOperator");
    const value = this.#expressionStatement(eatSemicolon);
    return {
      type: "VariableDeclaration",
      id: {
        type: "Identifier",
        name: variableName,
      },
      value,
      kind,
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

  #equalityExpression(): ASTNode {
    return this.#binaryExpression({
      expression: this.#comparisonExpression.bind(this),
      lookaheadType: "EqualityOperator",
    });
  }

  #comparisonExpression(): ASTNode {
    return this.#binaryExpression({
      expression: this.#additiveExpression.bind(this),
      lookaheadType: "ComparisonOperator",
    });
  }

  #additiveExpression(): ASTNode {
    return this.#binaryExpression({
      expression: this.#multiplicativeExpression.bind(this),
      lookaheadType: "AdditiveOperator",
    });
  }

  #multiplicativeExpression(): ASTNode {
    return this.#binaryExpression({
      expression: this.#powerExpression.bind(this),
      lookaheadType: "MultiplicativeOperator",
    });
  }

  #powerExpression(): ASTNode {
    return this.#binaryExpression({
      expression: this.#unaryExpression.bind(this),
      lookaheadType: "PowerOperator",
    });
  }

  #unaryExpression(): ASTNode {
    if (this.#lookahead.type === "UnaryOperator") {
      const operator = this.#eat("UnaryOperator").value as Operator;
      const argument = this.#unaryExpression();
      return {
        type: "UnaryExpression",
        operator,
        argument,
      };
    }

    return this.#parenthesizedExpression();
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
    args,
  }: {
    expression: (...args: any[]) => ASTNode;
    lookaheadType: TokenType;
    args?: any[];
  }) {
    if (args == null) {
      args = [];
    }

    let left = expression(...args);

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
      case "boolean":
        return this.#booleanLiteral();
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

  #booleanLiteral(): ASTNode {
    const node = this.#eat("boolean");

    return {
      type: "BooleanLiteral",
      value: Boolean(node.value),
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
