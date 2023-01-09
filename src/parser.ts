import { Tokenizer } from "./tokenizer";
import { ASTNode, ASTNodeType, Operator, Token, TokenType } from "./types";
import { astFactory } from "../helpers/ast-factory";
import errorMessage from "../helpers/error-message";

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
    return astFactory(this.#statementList("Program"));
  }

  #statementList(type: ASTNodeType, block = false): (ASTNode | null)[] {
    const statements: (ASTNode | null)[] = [];

    if (block && this.#lookahead.type === "}") {
      this.#eat("}");
      return statements;
    }

    let currentStatement = this.#statement(type);

    if (!currentStatement) {
      return statements;
    }

    do {
      statements.push(currentStatement);
      if (block && this.#lookahead.type === "}") {
        this.#eat("}");
        return statements;
      }
      currentStatement = this.#statement(type);
    } while ((!block && currentStatement) || block);

    return statements;
  }

  #statement(type: ASTNodeType): ASTNode | null {
    switch (this.#lookahead.type) {
      case "EndOfFile":
        return null;
      case "{":
        this.#eat("{");
        return this.#blockStatement(type);
      case "VariableDeclaration":
        return this.#variableDeclaration();
      case "if":
        return this.#ifStatement();
      case "function":
      case "function*":
      case "async":
        return this.#functionDeclaration();
      case "for":
        return this.#forStatement();
      case "return":
        return this.#returnStatement(type);
      default:
        return this.#expressionStatement();
    }
  }

  #returnStatement(type: ASTNodeType): ASTNode {
    if (
      type !== "FunctionDeclaration" &&
      type !== "ArrowFunctionExpression" &&
      type !== "FunctionExpression"
    ) {
      throw new Error(errorMessage.INVALID_RETURN_STATEMENT);
    }

    this.#eat("return");
    const argument = this.#expressionStatement();

    return {
      type: "ReturnStatement",
      argument,
    };
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
        body = this.#blockStatement("ForStatement");
        break;
      default:
        body = {
          type: "BlockStatement",
          body: [this.#statement("ForStatement")],
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
    let isGenerator = false;
    let isAsync = false;

    if (this.#lookahead.type === "async") {
      this.#eat("async");
      isAsync = true;
    }

    switch (this.#lookahead.type) {
      case "function":
        this.#eat("function");
        break;
      case "function*":
        this.#eat("function*");
        isGenerator = true;
        break;
    }

    const id = this.#identifier();
    const params = this.#functionParams();

    this.#eat("{");
    const body = this.#blockStatement("FunctionDeclaration");
    return {
      type: "FunctionDeclaration",
      id,
      generator: isGenerator,
      async: isAsync,
      params,
      body,
    };
  }

  #functionParams(): ASTNode[] {
    this.#eat("(");
    const params: ASTNode[] = [];

    while (this.#lookahead.type === "Identifier") {
      let param: ASTNode;
      const identifier = this.#eat("Identifier").value;
      // @ts-ignore
      if (this.#lookahead.type === "AssignmentOperator") {
        this.#eat("AssignmentOperator");
        const right = this.#expressionStatement(false);
        param = {
          type: "AssignmentPattern",
          left: {
            type: "Identifier",
            name: identifier,
          },
          right,
        };
      } else {
        param = {
          type: "Identifier",
          name: identifier,
        };
      }
      params.push(param);

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
      const body = this.#blockStatement("IfStatement");
      return {
        type: "IfStatement",
        condition,
        body,
      };
    }

    const body = this.#statement("IfStatement");
    return {
      type: "IfStatement",
      condition,
      body: {
        type: "BlockStatement",
        body: [body],
      },
    };
  }

  #blockStatement(type: ASTNodeType): ASTNode {
    return {
      type: "BlockStatement",
      body: this.#statementList(type, true),
    };
  }

  #expressionStatement(eatSemicolon: boolean = true): ASTNode {
    if (this.#lookahead.type === "async") {
      return this.#maybeAsyncArrowFunction();
    }

    const node = this.#sequenceExpression();
    if (eatSemicolon && this.#lookahead.type === ";") {
      this.#eat(";");
    }
    return node;
  }

  #maybeAsyncArrowFunction(): ASTNode {
    this.#eat("async");
    if (this.#lookahead.type !== "(" && this.#lookahead.type !== "Identifier") {
      throw new Error(errorMessage.INVALID_ASYNC);
    }

    if (this.#lookahead.type === "(") {
      return { ...this.#parenthesizedExpression(), async: true };
    } else {
      const param = this.#identifier();
      return { ...this.#arrowFunction([param]), async: true };
    }
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

  #sequenceExpression(): ASTNode {
    let left = this.#yieldExpression();
    const expressions: ASTNode[] = [left];

    while (this.#lookahead.type === ",") {
      this.#eat(",").value;
      const right = this.#yieldExpression();
      expressions.push(right);

      left = {
        type: "SequenceExpression",
        expressions,
      };
    }
    return left;
  }

  #yieldExpression(): ASTNode {
    if (this.#lookahead.type === "yield") {
      this.#eat("yield");
      const argument = this.#assignmentExpression();
      return {
        type: "YieldExpression",
        argument,
      };
    }

    return this.#assignmentExpression();
  }

  #assignmentExpression(): ASTNode {
    let id = this.#equalityExpression();

    if (
      this.#lookahead.type === "AssignmentOperator" ||
      this.#lookahead.type === "ComplexAssignmentOperator"
    ) {
      const operator = this.#eat(this.#lookahead.type);
      let value = this.#yieldExpression();

      if (!this.#checkIsValidLeftHandSide(id)) {
        throw new Error(errorMessage.INVALID_LEFT_HAND_SIDE);
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

    if (this.#lookahead.type === "await") {
      this.#eat("await");
      const argument = this.#unaryExpression();
      return {
        type: "AwaitExpression",
        argument,
      };
    }

    return this.#parenthesizedExpression();
  }

  #parenthesizedExpression(): ASTNode {
    if (this.#lookahead.type === "(") {
      this.#eat("(");

      const maybeArrowFunctionNoParams = this.#maybeArrowFunctionNoParams();
      if (maybeArrowFunctionNoParams !== null) {
        return maybeArrowFunctionNoParams;
      }

      const node = this.#expressionStatement();
      this.#eat(")");

      // check for arrow function
      const maybeArrowFunction = this.#maybeArrowFunction(node);
      if (maybeArrowFunction !== null) {
        return maybeArrowFunction;
      }

      return {
        type: "ParenthesizedExpression",
        body: node,
      };
    }

    return this.#primaryExpression();
  }

  #maybeArrowFunctionNoParams(): ASTNode | null {
    if (this.#lookahead.type === ")") {
      this.#eat(")");
      // @ts-ignore
      if (this.#lookahead.type !== "=>") {
        throw new Error("Invalid token: )");
      }

      return this.#arrowFunction([]);
    }

    return null;
  }

  #maybeArrowFunction(maybeFunctionParams: ASTNode): ASTNode | null {
    if (
      this.#lookahead.type === "=>" &&
      (maybeFunctionParams.type === "SequenceExpression" ||
        maybeFunctionParams.type === "Identifier" ||
        maybeFunctionParams.type === "AssignmentExpression")
    ) {
      let params: ASTNode[];
      switch (maybeFunctionParams.type) {
        case "SequenceExpression":
          if (
            maybeFunctionParams.expressions!.some(
              (expression) =>
                expression.type !== "Identifier" &&
                expression.type !== "AssignmentExpression"
            )
          ) {
            throw new Error(errorMessage.INVALID_FUNCTION_PARAMETERS);
          }

          params = maybeFunctionParams.expressions!.map((expression) => {
            if (expression.type === "Identifier") {
              return expression;
            }
            return {
              type: "AssignmentPattern",
              left: expression.id,
              right: expression.value as ASTNode,
            };
          });
          break;
        case "Identifier":
          params = [maybeFunctionParams];
          break;
        case "AssignmentExpression":
          params = [
            {
              type: "AssignmentPattern",
              left: maybeFunctionParams.id,
              right: maybeFunctionParams.value as ASTNode,
            },
          ];
      }

      return this.#arrowFunction(params);
    }

    return null;
  }

  #arrowFunction(params: ASTNode[]): ASTNode {
    this.#eat("=>");
    let body: ASTNode;
    if (this.#lookahead.type === "{") {
      this.#eat("{");
      body = this.#blockStatement("ArrowFunctionExpression");
    } else {
      body = this.#sequenceExpression();
    }

    return {
      type: "ArrowFunctionExpression",
      body,
      params,
      generator: false,
      async: false,
    };
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
      case "[":
        return this.#arrayLiteral();
      case "{":
        return this.#objectLiteral();
      case "Identifier":
        const lhs = this.#leftHandSideExpression();
        const maybeCallExpression = this.#maybeCallExpression(lhs);
        if (maybeCallExpression != null) {
          return maybeCallExpression;
        }
        return lhs;
      case "yield":
        return this.#yieldExpression();
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

  #arrayLiteral(): ASTNode {
    this.#eat("[");
    const elements: ASTNode[] = [];

    while (this.#lookahead.type !== "]") {
      const element = this.#yieldExpression();
      elements.push(element);
      if (this.#lookahead.type === ",") {
        this.#eat(",");
      }
    }

    this.#eat("]");

    return {
      type: "ArrayLiteral",
      elements,
    };
  }

  #objectLiteral(): ASTNode {
    this.#eat("{");
    const properties: ASTNode[] = [];

    while (this.#lookahead.type !== "}") {
      let isComputed = false;
      let isMethod = false;
      let isAsync = false;
      let key: ASTNode;

      if (this.#lookahead.type === "[") {
        this.#eat("[");
        key = this.#yieldExpression();
        this.#eat("]");
        isComputed = true;
      } else {
        if (this.#lookahead.type === "async") {
          isAsync = true;
          this.#eat("async");
        }
        key = this.#identifier();
      }

      let value: ASTNode;

      if (this.#lookahead.type === "(") {
        isMethod = true;
        const params = this.#functionParams();
        this.#eat("{");
        const body = this.#blockStatement("FunctionExpression");
        value = {
          type: "FunctionExpression",
          params,
          body,
          generator: false,
          async: isAsync,
        };
      } else {
        this.#eat(":");
        value = this.#yieldExpression();
      }

      const property: ASTNode = {
        type: "Property",
        key,
        value,
        computed: isComputed,
        method: isMethod,
      };
      properties.push(property);

      if (this.#lookahead.type === ",") {
        this.#eat(",");
      }
    }

    this.#eat("}");

    return {
      type: "ObjectLiteral",
      properties,
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
      case "=>":
        // arrow function
        return this.#arrowFunction([identifier]);
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
