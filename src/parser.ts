import { Tokenizer } from "./tokenizer";
import { ASTNode, Token, TokenType } from "./types";

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
    return {
      type: "Program",
      body: this.#statementList(),
    };
  }

  #statementList(): ASTNode[] {
    const statements = [];

    let currentStatement = this.#statement();

    while (currentStatement) {
      statements.push(currentStatement);
      currentStatement = this.#statement();
    }

    return statements;
  }

  #statement(): ASTNode | null {
    if (this.#lookahead.type === "EndOfFile") {
      return null;
    }
    return this.#expressionStatement();
  }

  #expressionStatement(): ASTNode {
    return this.#literal();
  }

  #literal(): ASTNode {
    let result;
    switch (this.#lookahead.type) {
      case "number":
        result = {
          type: "NumericLiteral",
          value: this.#lookahead.value,
        } as const;
        this.#eat("number");
        return result;
      case "string":
        result = {
          type: "StringLiteral",
          value: this.#lookahead.value,
        } as const;
        this.#eat("string");
        return result;
    }

    throw new Error("Invalid literal type");
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
