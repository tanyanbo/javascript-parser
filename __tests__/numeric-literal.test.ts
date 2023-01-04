import { Parser } from "../src/parser";
import { astFactory } from "../helpers/ast-factory";

describe("numeric literal", () => {
  it("should parse a numeric literal correctly", () => {
    const parser = new Parser(`
      20
    `);
    const ast = parser.parse();
    expect(ast).toEqual(
      astFactory([
        {
          type: "NumericLiteral",
          value: 20,
        },
      ])
    );
  });

  it("should parse a numeric literal with semicolon correctly", () => {
    const parser = new Parser(`
      20;
    `);
    const ast = parser.parse();
    expect(ast).toEqual(
      astFactory([
        {
          type: "NumericLiteral",
          value: 20,
        },
      ])
    );
  });
});
