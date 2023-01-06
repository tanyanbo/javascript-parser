import { Tokenizer } from "./tokenizer";
import { ASTNode, Token, TokenType } from "./types";
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
      default:
        return this.#expressionStatement();
    }
  }

  #blockStatement(): ASTNode {
    return {
      type: "BlockStatement",
      body: this.#statementList(true),
    };
  }

  #expressionStatement(): ASTNode {
    const node = this.#additiveExpression();
    if (this.#lookahead.type === ";") {
      this.#eat(";");
    }
    return node;
  }

  #additiveExpression(): ASTNode {
    return this.#binaryExpression(
      this.#multiplicativeExpression.bind(this),
      "AdditiveOperator"
    );
  }

  #multiplicativeExpression(): ASTNode {
    return this.#binaryExpression(
      this.#powerExpression.bind(this),
      "MultiplicativeOperator"
    );
  }

  #powerExpression(): ASTNode {
    return this.#binaryExpression(
      this.#primaryExpression.bind(this),
      "PowerOperator"
    );
  }

  #binaryExpression(
    expression: (...args: any[]) => ASTNode,
    lookaheadType: TokenType,
    ...args: any[]
  ) {
    let left = expression(...args);
    while (this.#lookahead.type === lookaheadType) {
      const operator = this.#eat(lookaheadType).value;
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
        return this.#variable();
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

  #variable(): ASTNode {
    const node = this.#eat("Identifier");

    return {
      type: "Identifier",
      name: node.value,
    };
  }

  #eat(type: TokenType) {
    const token = this.#lookahead;
    if (token.type !== type) {
      throw new Error("Token does not match expected type");
    }
    this.#lookahead = this.#tokenizer.getNextToken();
    return token;
  }
}
