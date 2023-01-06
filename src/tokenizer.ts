import { Token, TokenType } from "./types";

const tokenTypes: [RegExp, TokenType][] = [
  [/^\s+/d, null],
  [/^\d+/d, "number"],
  [/^'.*'/d, "string"],
  [/^".*"/d, "string"],
  [/^;/d, ";"],
  [/^\{/d, "{"],
  [/^}/d, "}"],
  [/^\*\*/d, "PowerOperator"],
  [/^[+\-]/d, "AdditiveOperator"],
  [/^[*\/]/d, "MultiplicativeOperator"],
];

export class Tokenizer {
  #string = "";
  #cursor = 0;
  constructor(str: string) {
    this.#string = str;
  }

  isEndOfFile(): boolean {
    return this.#cursor >= this.#string.length;
  }

  getNextToken(): Token {
    this.#string = this.#string.slice(this.#cursor);

    for (const tokenType of tokenTypes) {
      const result = tokenType[0].exec(this.#string);
      if (result?.index === 0) {
        // @ts-ignore
        this.#cursor = result.indices[0][1];

        if (tokenType[1] == null) {
          this.#string = this.#string.slice(this.#cursor);
          continue;
        }

        return {
          type: tokenType[1],
          value: result[0],
        };
      }
    }

    if (this.isEndOfFile()) {
      return {
        type: "EndOfFile",
      };
    }

    throw new SyntaxError(`Unsupported token ${this.#string[0]}`);
  }
}
