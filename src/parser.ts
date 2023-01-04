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

  #expressionStatement(): ASTNode {
    const literalNode = this.#literal();

    if (this.#lookahead.type === ";") {
      this.#eat(";");
    }

    return literalNode;
  }

  #literal(): ASTNode {
    let result;
    switch (this.#lookahead.type) {
      case "number":
        result = {
          type: "NumericLiteral",
          value: +this.#lookahead.value,
        } as const;
        this.#eat("number");
        return result;
      case "string":
        result = {
          type: "StringLiteral",
          value: this.#lookahead.value.slice(1, -1),
        } as const;
        this.#eat("string");
        return result;
    }

    throw new Error("Invalid literal type");
  }

  #blockStatement(): ASTNode {
    return {
      type: "BlockStatement",
      body: this.#statementList(true),
    } as const;
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
