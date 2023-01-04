import { Parser } from "../src/parser";
import { astFactory } from "../helpers/ast-factory";

describe("string literal", () => {
  it("should parse a string literal with single quotes correctly", () => {
    const parser = new Parser(`
      'abc'
    `);
    const ast = parser.parse();
    expect(ast).toEqual(
      astFactory([
        {
          type: "StringLiteral",
          value: "abc",
        },
      ])
    );
  });

  it("should parse a string literal with double quotes correctly", () => {
    const parser = new Parser(`
      "abc"
    `);
    const ast = parser.parse();
    expect(ast).toEqual(
      astFactory([
        {
          type: "StringLiteral",
          value: "abc",
        },
      ])
    );
  });

  it("should parse a string literal with semicolon correctly", () => {
    const parser = new Parser(`
      "abc";
    `);
    const ast = parser.parse();
    expect(ast).toEqual(
      astFactory([
        {
          type: "StringLiteral",
          value: "abc",
        },
      ])
    );
  });
});
