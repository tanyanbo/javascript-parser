import { Tokenizer } from "./tokenizer";
import { ASTNode, Operator, Token, TokenType } from "./types";
import { astFactory } from "../helpers/ast-factory";
import errorMessage from "../helpers/error-message";

export class Parser {
  #tokenizer: Tokenizer;
  #lookahead: Token;
  #canReturn = false;

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
      case "function*":
      case "async":
        return this.#functionDeclarationOrExpression();
      case "for":
        return this.#forStatement();
      case "while":
        return this.#whileStatement();
      case "do":
        return this.#doWhileStatement();
      case "continue":
        return this.#continueStatement();
      case "return":
        return this.#returnStatement();
      case "class":
        return this.#classDeclaration();
      case "throw":
        return this.#throwStatement();
      case "try":
        return this.#tryStatement();
      default:
        return this.#expressionStatement();
    }
  }

  #tryStatement(): ASTNode {
    this.#eat("try");
    this.#eat("{");
    const tryBlock = this.#blockStatement();
    let finallyClause: ASTNode | undefined;

    switch (this.#lookahead.type) {
      case "catch":
        return this.#catchClause(tryBlock);
      case "finally":
        finallyClause = this.#finallyClause();
        break;
      default:
        throw new Error(errorMessage.MISSING_CATCH_OR_FINALLY);
    }

    return {
      type: "TryStatement",
      block: tryBlock,
      finalizer: finallyClause,
    };
  }

  #catchClause(tryBlock: ASTNode): ASTNode {
    this.#eat("catch");
    let param: ASTNode | undefined;
    if (this.#lookahead.type === "(") {
      this.#eat("(");
      param = this.#identifier();
      this.#eat(")");
    }

    this.#eat("{");
    const body = this.#blockStatement().body;

    let finallyBlock: ASTNode | undefined;
    if (this.#lookahead.type === "finally") {
      finallyBlock = this.#finallyClause();
    }

    return {
      type: "TryStatement",
      block: tryBlock,
      handler: {
        type: "CatchClause",
        param,
        body: {
          type: "BlockStatement",
          body,
        },
      },
      finalizer: finallyBlock,
    };
  }

  #finallyClause(): ASTNode {
    this.#eat("finally");
    this.#eat("{");
    return {
      type: "BlockStatement",
      body: this.#blockStatement().body,
    };
  }

  #throwStatement(): ASTNode {
    this.#eat("throw");
    const argument = this.#expressionStatement();
    return {
      type: "ThrowStatement",
      argument,
    };
  }

  #classDeclaration(): ASTNode {
    this.#eat("class");
    const id = this.#identifier();
    let superClass: ASTNode | undefined;

    if (this.#lookahead.type === "extends") {
      this.#eat("extends");
      superClass = this.#identifier();
    }

    const body = this.#classBody();

    return {
      type: "ClassDeclaration",
      id,
      body,
      superClass,
    };
  }

  #classBody(): ASTNode {
    this.#eat("{");
    const statements: ASTNode[] = [];

    while (this.#lookahead.type !== "}") {
      const statement = this.#classStatement();
      statements.push(statement);
    }

    this.#eat("}");

    return {
      type: "ClassBody",
      body: statements,
    };
  }

  #classStatement(
    isStatic: boolean = false,
    isPrivate: boolean = false,
    isAsync: boolean = false
  ): ASTNode {
    let asynchronous = isAsync;
    if (this.#lookahead.type === "static") {
      this.#eat("static");
      return this.#classStatement(true, isPrivate, asynchronous);
    }

    if (this.#lookahead.type === "async") {
      this.#eat("async");
      asynchronous = true;
    }

    if (this.#lookahead.type === "#") {
      this.#eat("#");
      return this.#classStatement(isStatic, true, asynchronous);
    }

    if (this.#lookahead.type !== "Identifier") {
      throw new Error(
        `${errorMessage.INVALID_CLASS_STATEMENT}, got: ${this.#lookahead.type}`
      );
    }

    const id = this.#identifier();
    let key: ASTNode;
    if (isPrivate) {
      key = {
        type: "PrivateName",
        id,
      };
    } else {
      key = id;
    }

    // @ts-ignore
    if (this.#lookahead.type === "AssignmentOperator") {
      // class property with initial value
      this.#eat("AssignmentOperator");
      const value = this.#expressionStatement(true);

      return {
        type: isPrivate ? "ClassPrivateProperty" : "ClassProperty",
        static: isStatic,
        key,
        value,
      };
    }

    // @ts-ignore
    if (this.#lookahead.type === "(") {
      // class method
      const fn = this.#functionExpression(asynchronous, false);

      return {
        type: "ClassMethodDefinition",
        static: isStatic,
        key,
        kind: id.name === "constructor" ? "constructor" : "method",
        value: fn,
      };
    }

    // class property without initial value
    this.#maybeEatSemicolon();

    return {
      type: isPrivate ? "ClassPrivateProperty" : "ClassProperty",
      static: isStatic,
      key,
    };
  }

  #returnStatement(): ASTNode {
    if (!this.#canReturn) {
      throw new Error(errorMessage.INVALID_RETURN_STATEMENT);
    }

    this.#eat("return");
    const argument = this.#expressionStatement();

    return {
      type: "ReturnStatement",
      argument,
    };
  }

  #whileStatement(): ASTNode {
    this.#eat("while");
    this.#eat("(");

    const test = this.#expressionStatement(false);
    this.#eat(")");

    let body: ASTNode | null;
    switch (this.#lookahead.type) {
      case "{":
        this.#eat("{");
        body = this.#blockStatement();
        break;
      default:
        body = this.#statement();
    }

    if (body == null) {
      throw new Error("No body in while loop");
    }

    return {
      type: "WhileStatement",
      test,
      body,
    };
  }

  #doWhileStatement(): ASTNode {
    this.#eat("do");
    this.#eat("{");
    const body = this.#blockStatement().body;
    this.#eat("while");
    this.#eat("(");
    const test = this.#expressionStatement(false);
    this.#eat(")");

    return {
      type: "DoWhileStatement",
      body: {
        type: "BlockStatement",
        body,
      },
      test,
    };
  }

  #forStatement(): ASTNode {
    this.#eat("for");
    this.#eat("(");

    let nodeWithoutBody: ASTNode;

    let init: ASTNode | null = null;
    switch (this.#lookahead.type) {
      case "VariableDeclaration":
        init = this.#variableDeclaration(false);
        break;
      case "Identifier":
        init = this.#assignmentExpression();
        break;
    }

    if (this.#lookahead.type === "of") {
      this.#eat("of");
      const right = this.#leftHandSideExpression();
      this.#eat(")");
      nodeWithoutBody = {
        ...init!,
        right,
      };
    } else {
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
      nodeWithoutBody = {
        type: "ForStatement",
        init,
        test,
        update,
      };
    }

    let body: ASTNode | null;
    switch (this.#lookahead.type) {
      case "{":
        this.#eat("{");
        body = this.#blockStatement();
        break;
      default:
        body = this.#statement();
    }

    if (body == null) {
      throw new Error("No body in for loop");
    }

    return {
      ...nodeWithoutBody,
      body,
    };
  }

  #continueStatement(): ASTNode {
    this.#eat("continue");
    this.#maybeEatSemicolon();
    return {
      type: "ContinueStatement",
    };
  }

  #functionDeclarationOrExpression(): ASTNode {
    let isGenerator = false;
    let isAsync = false;

    if (this.#lookahead.type === "async") {
      this.#eat("async");
      isAsync = true;
    }

    let innerParams: ASTNode[];
    switch (this.#lookahead.type) {
      case "function":
        this.#eat("function");
        break;
      case "function*":
        this.#eat("function*");
        isGenerator = true;
        break;
      case "(":
        // arrow function
        innerParams = this.#functionParams();
        return this.#arrowFunction(innerParams, isAsync);
      case "Identifier":
        // arrow function
        const name = this.#eat("Identifier").value;
        innerParams = [
          {
            type: "Identifier",
            name,
          },
        ];
        return this.#arrowFunction(innerParams, isAsync);
    }

    // @ts-ignore
    if (this.#lookahead.type === "(") {
      return this.#functionExpression(isAsync, isGenerator);
    }

    const id = this.#identifier();
    const params = this.#functionParams();

    this.#canReturn = true;
    this.#eat("{");
    const body = this.#blockStatement();
    this.#canReturn = false;
    return {
      type: "FunctionDeclaration",
      id,
      generator: isGenerator,
      async: isAsync,
      params,
      body,
    };
  }

  #functionExpression(isAsync: boolean, isGenerator: boolean): ASTNode {
    const params = this.#functionParams();
    this.#canReturn = true;
    this.#eat("{");
    const body = this.#blockStatement();
    this.#canReturn = false;
    return {
      type: "FunctionExpression",
      params,
      body,
      generator: isGenerator,
      async: isAsync,
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
    const test = this.#expressionStatement();
    this.#eat(")");
    let ifBlock: ASTNode;

    ifBlock = {
      type: "IfStatement",
      test,
      consequent: this.#maybeBlock(),
    };

    let alternate: ASTNode | undefined;
    if (this.#lookahead.type === "else") {
      alternate = this.#elseStatement();
    }

    return { ...ifBlock, alternate };
  }

  #elseStatement(): ASTNode {
    this.#eat("else");

    if (this.#lookahead.type !== "if") {
      return this.#maybeBlock();
    }

    this.#eat("if");
    this.#eat("(");
    const test = this.#expressionStatement();
    this.#eat(")");

    const consequent = this.#maybeBlock();
    let alternate: ASTNode | undefined;
    // @ts-ignore
    if (this.#lookahead.type === "else") {
      alternate = this.#elseStatement();
    }

    return {
      type: "IfStatement",
      test,
      consequent,
      alternate,
    };
  }

  #maybeBlock(): ASTNode {
    if (this.#lookahead.type === "{") {
      this.#eat("{");
      return this.#blockStatement();
    } else {
      return this.#expressionStatement();
    }
  }

  #blockStatement(): ASTNode {
    return {
      type: "BlockStatement",
      body: this.#statementList(true),
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

    if (this.#lookahead.type === "of") {
      return {
        type: "ForOfStatement",
        left: {
          type: "Identifier",
          name: variableName,
        },
      };
    }

    if (
      this.#lookahead.type !== "AssignmentOperator" &&
      this.#lookahead.type !== "async" &&
      this.#lookahead.type !== "function" &&
      this.#lookahead.type !== "function*"
    ) {
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
    let value: ASTNode;

    switch (this.#lookahead.type) {
      case "async":
      case "function":
      case "function*":
        value = this.#functionDeclarationOrExpression();
        break;
      default:
        value = this.#expressionStatement(eatSemicolon);
    }

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
    let id = this.#logicalOrExpression();

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

  #logicalOrExpression(): ASTNode {
    return this.#binaryExpression({
      expression: this.#logicalAndExpression.bind(this),
      lookaheadType: "LogicalOrAndNullishCoalescing",
      type: "LogicalExpression",
    });
  }

  #logicalAndExpression(): ASTNode {
    return this.#binaryExpression({
      expression: this.#bitwiseOrExpression.bind(this),
      lookaheadType: "&&",
      type: "LogicalExpression",
    });
  }

  #bitwiseOrExpression(): ASTNode {
    return this.#binaryExpression({
      expression: this.#bitwiseXorExpression.bind(this),
      lookaheadType: "|",
    });
  }

  #bitwiseXorExpression(): ASTNode {
    return this.#binaryExpression({
      expression: this.#bitwiseAndExpression.bind(this),
      lookaheadType: "^",
    });
  }

  #bitwiseAndExpression(): ASTNode {
    return this.#binaryExpression({
      expression: this.#equalityExpression.bind(this),
      lookaheadType: "&",
    });
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
    if (
      this.#lookahead.type === "UnaryOperator" ||
      this.#lookahead.type === "AdditiveOperator"
    ) {
      const operator = this.#eat(this.#lookahead.type).value as Operator;
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

    return this.#newExpression();
  }

  #newExpression(): ASTNode {
    if (this.#lookahead.type === "new") {
      this.#eat("new");
      const callee = this.#leftHandSideExpression();
      const args = this.#functionArguments();

      return {
        type: "NewExpression",
        callee,
        arguments: args,
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

  #arrowFunction(params: ASTNode[], isAsync = false): ASTNode {
    this.#eat("=>");
    let body: ASTNode;

    this.#canReturn = true;
    if (this.#lookahead.type === "{") {
      this.#eat("{");
      body = this.#blockStatement();
    } else {
      body = this.#sequenceExpression();
    }
    this.#canReturn = false;

    return {
      type: "ArrowFunctionExpression",
      params,
      body,
      generator: false,
      async: isAsync,
    };
  }

  #binaryExpression({
    expression,
    lookaheadType,
    args,
    type,
  }: {
    expression: (...args: any[]) => ASTNode;
    lookaheadType: TokenType;
    args?: any[];
    type?: "BinaryExpression" | "LogicalExpression";
  }) {
    if (args == null) {
      args = [];
    }

    if (type == null) {
      type = "BinaryExpression";
    }

    let left = expression(...args);

    while (this.#lookahead.type === lookaheadType) {
      const operator = this.#eat(lookaheadType).value as Operator;
      const right = expression(...args);
      left = {
        type,
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
      case "bigint":
        return this.#bigintLiteral();
      case "string":
        return this.#stringLiteral();
      case "regex":
        return this.#regexLiteral();
      case "boolean":
        return this.#booleanLiteral();
      case "null":
        return this.#nullLiteral();
      case "undefined":
        return this.#undefinedLiteral();
      case "[":
        return this.#arrayLiteral();
      case "{":
        return this.#objectLiteral();
      case "this":
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

  #bigintLiteral(): ASTNode {
    const node = this.#eat("bigint");

    return {
      type: "BigintLiteral",
      value: +node.value.slice(0, -1),
    };
  }

  #stringLiteral(): ASTNode {
    const node = this.#eat("string");

    return {
      type: "StringLiteral",
      value: node.value.slice(1, -1),
    };
  }

  #regexLiteral(): ASTNode {
    const validFlags = ["i", "g", "m", "s", "u", "y", "d"];
    let pattern = this.#eat("regex").value;
    const lastForwardSlashIndex = pattern.lastIndexOf("/");
    const flags = pattern.slice(lastForwardSlashIndex + 1);

    if (flags.split("").some((char) => !validFlags.includes(char))) {
      throw new Error(errorMessage.INVALID_REGEX_FLAG);
    }

    pattern = pattern.slice(1, lastForwardSlashIndex);

    return {
      type: "RegExpLiteral",
      pattern: pattern,
      flags,
    };
  }

  #booleanLiteral(): ASTNode {
    const node = this.#eat("boolean");

    return {
      type: "BooleanLiteral",
      value: Boolean(node.value),
    };
  }

  #nullLiteral(): ASTNode {
    this.#eat("null");

    return {
      type: "NullLiteral",
      value: null,
    };
  }

  #undefinedLiteral(): ASTNode {
    this.#eat("undefined");

    return {
      type: "UndefinedLiteral",
      value: undefined,
    };
  }

  #thisExpression(): ASTNode {
    this.#eat("this");
    return {
      type: "ThisExpression",
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

      if (this.#lookahead.type === "async") {
        isAsync = true;
        this.#eat("async");
      }

      if (this.#lookahead.type === "[") {
        this.#eat("[");
        key = this.#yieldExpression();
        this.#eat("]");
        isComputed = true;
      } else {
        key = this.#identifier();
      }

      let value: ASTNode;

      if (this.#lookahead.type === "(") {
        isMethod = true;
        value = this.#functionExpression(isAsync, false);
      } else {
        this.#eat(":");
        switch (this.#lookahead.type) {
          case "async":
          case "function":
          case "function*":
            value = this.#functionDeclarationOrExpression();
            break;
          default:
            value = this.#yieldExpression();
        }
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
    let identifier;
    if (this.#lookahead.type === "this") {
      identifier = this.#thisExpression();
    } else {
      identifier = this.#identifier();
      if (this.#lookahead.type === "=>") {
        return this.#arrowFunction([identifier]);
      } else if (this.#lookahead.type === "?.") {
        return this.#leftHandSideOptionalExpression(identifier);
      }
    }

    return this.#memberExpression(identifier);
  }

  #leftHandSideOptionalExpression(leftHandSide: ASTNode): ASTNode {
    this.#eat("?.");
    let node: ASTNode = leftHandSide;
    let property: ASTNode;

    switch (this.#lookahead.type) {
      case "#":
        this.#eat("#");
        property = {
          type: "PrivateName",
          id: this.#identifier(),
        };
        return {
          type: "OptionalMemberExpression",
          object: node,
          property,
          computed: false,
          optional: true,
        };
      case "Identifier":
        property = this.#identifier();
        return {
          type: "OptionalMemberExpression",
          object: node,
          property,
          computed: false,
          optional: true,
        };
      case "[":
        this.#eat("[");
        property = this.#expressionStatement(false);
        this.#eat("]");
        return {
          type: "OptionalMemberExpression",
          object: node,
          property,
          computed: true,
          optional: true,
        };
      case "(":
        return this.#maybeCallExpression(leftHandSide, true)!;
    }

    throw new Error("Invalid token");
  }

  #memberExpression(identifier: ASTNode): ASTNode {
    if (
      this.#lookahead.type !== "." &&
      this.#lookahead.type !== "[" &&
      this.#lookahead.type !== "?."
    ) {
      return identifier;
    }
    let node = identifier;

    let property: ASTNode;
    while (
      this.#lookahead.type === "." ||
      this.#lookahead.type === "[" ||
      this.#lookahead.type === "?."
    ) {
      if (this.#lookahead.type === ".") {
        this.#eat(this.#lookahead.type);

        let isPrivate = false;
        // @ts-ignore
        if (this.#lookahead.type === "#") {
          this.#eat("#");
          isPrivate = true;
        }
        property = this.#identifier();

        if (isPrivate) {
          property = {
            type: "PrivateName",
            id: property,
          };
        }

        node = {
          type: "MemberExpression",
          object: node,
          property,
          computed: false,
        };
      } else if (this.#lookahead.type === "[") {
        this.#eat("[");
        property = this.#expressionStatement(false);
        this.#eat("]");
        node = {
          type: "MemberExpression",
          object: node,
          property,
          computed: true,
        };
      } else {
        return this.#optionalMemberExpression(identifier);
      }
    }

    return node;
  }

  #optionalMemberExpression(identifier: ASTNode): ASTNode {
    this.#eat("?.");
    let node: ASTNode = identifier;

    if (this.#lookahead.type === "#") {
      this.#eat("#");
      const property: ASTNode = {
        type: "PrivateName",
        id: this.#identifier(),
      };
      return {
        type: "OptionalMemberExpression",
        object: node,
        property,
        computed: false,
        optional: true,
      };
    } else if (this.#lookahead.type === "Identifier") {
      const property = this.#identifier();
      return {
        type: "OptionalMemberExpression",
        object: node,
        property,
        computed: false,
        optional: true,
      };
    } else if (this.#lookahead.type === "[") {
      this.#eat("[");
      const property = this.#expressionStatement(false);
      this.#eat("]");
      return {
        type: "OptionalMemberExpression",
        object: node,
        property,
        computed: true,
        optional: true,
      };
    }

    throw new Error("Unexpected token");
  }

  #maybeCallExpression(callee: ASTNode, isOptional = false): ASTNode | null {
    if (this.#lookahead.type === "(") {
      const args = this.#functionArguments();

      let callExpressionNode: ASTNode = {
        type: isOptional ? "OptionalCallExpression" : "CallExpression",
        callee,
        arguments: args,
      };

      if (isOptional) {
        callExpressionNode = { ...callExpressionNode, optional: true };
      }

      if (
        // @ts-ignore
        this.#lookahead.type === "." ||
        // @ts-ignore
        this.#lookahead.type === "?." ||
        // @ts-ignore
        this.#lookahead.type === "["
      ) {
        return this.#memberExpression(callExpressionNode);
      }

      const maybeCallExpression = this.#maybeCallExpression(callExpressionNode);
      if (maybeCallExpression == null) {
        return callExpressionNode;
      }
      return maybeCallExpression;
    }

    return null;
  }

  #functionArguments(): ASTNode[] {
    this.#eat("(");
    const args: ASTNode[] = [];
    while (this.#lookahead.type !== ")") {
      args.push(this.#assignmentExpression());
      if (this.#lookahead.type === ",") {
        this.#eat(",");
      }
    }
    this.#eat(")");

    this.#maybeEatSemicolon();

    return args;
  }

  #identifier(): ASTNode {
    const node = this.#eat("Identifier");

    return {
      type: "Identifier",
      name: node.value,
    };
  }

  #maybeEatSemicolon() {
    if (this.#lookahead.type === ";") {
      this.#eat(";");
    }
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
