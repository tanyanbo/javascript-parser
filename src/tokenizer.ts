import { Token, TokenType } from "./types";

const tokenTypes: [RegExp, TokenType][] = [
  [/^\s+/d, null],
  [/^\d+/d, "number"],
  [/^'.*'/d, "string"],
  [/^".*"/d, "string"],
  [/^;/d, ";"],
  [/^\{/d, "{"],
  [/^}/d, "}"],
  [/^\[/d, "["],
  [/^]/d, "]"],
  [/^\(/d, "("],
  [/^\)/d, ")"],
  [/^\./d, "."],
  [/^,/d, ","],
  [/^:/d, ":"],
  [/^#/d, "#"],
  [/^=>/d, "=>"],
  [/^\[.*]/d, "SquareBrackets"],
  [/^\*\*/d, "PowerOperator"],
  [/^(?:>=|<=|>|<)/d, "ComparisonOperator"],
  [/^(?:===|!==|==|!=)/d, "EqualityOperator"],
  [/^=/d, "AssignmentOperator"],
  [/^[+\-*/]=/d, "ComplexAssignmentOperator"],
  [/^!/d, "UnaryOperator"],
  [/^[+\-]/d, "AdditiveOperator"],
  [/^[*\/]/d, "MultiplicativeOperator"],
  [/^(?:\blet\b|\bconst\b)/d, "VariableDeclaration"],
  [/^\bif\b/d, "if"],
  [/^\bof\b/d, "of"],
  [/^\bfor\b/d, "for"],
  [/^\bwhile\b/d, "while"],
  [/^\basync\b/d, "async"],
  [/^\bawait\b/d, "await"],
  [/^\byield\b/d, "yield"],
  [/^\bthis\b/d, "this"],
  [/^\bfunction\s*\b\*/d, "function*"],
  [/^\bfunction\b/d, "function"],
  [/^\breturn\b/d, "return"],
  [/^(?:\btrue\b|\bfalse\b)/d, "boolean"],
  [/^\bclass\b/d, "class"],
  [/^\bstatic\b/d, "static"],
  [/^\bextends\b/d, "extends"],
  [/^\bnull\b/d, "null"],
  [/^\bundefined\b/d, "undefined"],
  [/^\bnew\b/d, "new"],
  [/^[a-zA-Z_]\w*/d, "Identifier"],
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
        value: "",
      };
    }

    throw new SyntaxError(`Unsupported token ${this.#string[0]}`);
  }
}
