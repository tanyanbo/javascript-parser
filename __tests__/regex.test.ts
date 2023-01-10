import { Parser } from "../src/parser";
import { astFactory } from "../helpers/ast-factory";
import errorMessage from "../helpers/error-message";

describe("regex", () => {
  it("should parse a regex correctly", () => {
    const parser = new Parser(`
      /aa/
    `);
    const ast = parser.parse();
    expect(ast).toEqual(
      astFactory([
        {
          type: "RegExpLiteral",
          pattern: "aa",
          flags: "",
        },
      ])
    );
  });

  it("should parse a regex with flags correctly", () => {
    const parser = new Parser(`
      /aa/id
    `);
    const ast = parser.parse();
    expect(ast).toEqual(
      astFactory([
        {
          type: "RegExpLiteral",
          pattern: "aa",
          flags: "id",
        },
      ])
    );
  });

  it("should throw when parser encounters an invalid regex flag", () => {
    const parser = new Parser(`
      /aa/idq
    `);
    expect(() => parser.parse()).toThrowError(errorMessage.INVALID_REGEX_FLAG);
  });
});
