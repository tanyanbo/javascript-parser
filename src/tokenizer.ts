import { Token, TokenType } from "./types";

const tokenTypes: [RegExp, TokenType][] = [
  [/^\s+/d, null],
  [/^\/\/.*/d, null],
  [/^\/\*(?:.|\s)*\*\//d, null],
  [/^\d+n/d, "bigint"],
  [/^\d+/d, "number"],
  [/^'.*'/d, "string"],
  [/^".*"/d, "string"],
  [/^\/.*[^\\]\/[a-z]*/d, "regex"],
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
  [/^`/d, "`"],
  [/^=>/d, "=>"],
  [/^\${/d, "${"],
  [/^&&/d, "&&"],
  [/^(?:\|\||\?\?)/d, "LogicalOrAndNullishCoalescing"],
  [/^\?\./d, "?."],
  [/^\|/d, "|"],
  [/^&/d, "&"],
  [/^\^/d, "^"],
  [/^\[.*]/d, "SquareBrackets"],
  [/^\*\*/d, "PowerOperator"],
  [/^(?:>=|<=|>|<)/d, "ComparisonOperator"],
  [/^(?:===|!==|==|!=)/d, "EqualityOperator"],
  [/^=/d, "AssignmentOperator"],
  [/^[+\-*/]=/d, "ComplexAssignmentOperator"],
  [/^(?:\+\+|--)/d, "IncrementDecrement"],
  [/^!/d, "UnaryOperator"],
  [/^[+\-]/d, "AdditiveOperator"],
  [/^[*\/]/d, "MultiplicativeOperator"],
  [/^(?:\blet\b|\bconst\b)/d, "VariableDeclaration"],
  [/^\bif\b/d, "if"],
  [/^\belse\b/d, "else"],
  [/^\bof\b/d, "of"],
  [/^\bfor\b/d, "for"],
  [/^\bwhile\b/d, "while"],
  [/^\bdo\b/d, "do"],
  [/^\bcontinue\b/d, "continue"],
  [/^\bbreak\b/d, "break"],
  [/^\basync\b/d, "async"],
  [/^\bawait\b/d, "await"],
  [/^\byield\b/d, "yield"],
  [/^\bthis\b/d, "this"],
  [/^\bthrow\b/d, "throw"],
  [/^\btry\b/d, "try"],
  [/^\bcatch\b/d, "catch"],
  [/^\bfinally\b/d, "finally"],
  [/^function\s*\*/d, "function*"],
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

    let idx = 0;
    while (idx < tokenTypes.length) {
      const tokenType = tokenTypes[idx];
      const result = tokenType[0].exec(this.#string);
      if (result?.index === 0) {
        // @ts-ignore
        this.#cursor = result.indices[0][1];

        if (tokenType[1] == null) {
          this.#string = this.#string.slice(this.#cursor);
          idx = 0;
          continue;
        }

        return {
          type: tokenType[1],
          value: result[0],
        };
      }

      idx++;
    }

    if (this.isEndOfFile()) {
      return {
        type: "EndOfFile",
        value: "",
      };
    }

    throw new SyntaxError(`Unsupported token ${this.#string[0]}`);
  }

  getTemplateLiteralToken(): Token {
    this.#string = this.#string.slice(this.#cursor);

    if (this.#string.startsWith("`")) {
      this.#cursor = 1;
      return {
        type: "`",
        value: "`",
      };
    }

    if (this.#string.startsWith("}")) {
      this.#cursor = 1;
      return {
        type: "}",
        value: "}",
      };
    }

    const result = /(?<!\\)\${/d.exec(this.#string);

    if (result == null) {
      const endingBacktickIndex = /(?<!\\)`/d.exec(this.#string)!.index;
      this.#cursor = endingBacktickIndex;
      return {
        type: "TemplateLiteralString",
        value: this.#string.slice(0, endingBacktickIndex),
      };
    }

    const expressionBeginningIndex = result.index;
    const templateString = this.#string.slice(0, expressionBeginningIndex);
    this.#string = this.#string.slice(expressionBeginningIndex);
    this.#cursor = 2;
    return {
      type: "${",
      value: templateString,
    };
  }
}
