import { Parser } from "../src/parser";
import { astFactory } from "../helpers/ast-factory";

describe("logical expressions", () => {
  it("should parse a logical and correctly", () => {
    const parser = new Parser(`
      1 && 2
    `);
    const ast = parser.parse();
    expect(ast).toEqual(
      astFactory([
        {
          type: "LogicalExpression",
          left: {
            type: "NumericLiteral",
            value: 1,
          },
          operator: "&&",
          right: {
            type: "NumericLiteral",
            value: 2,
          },
        },
      ])
    );
  });

  it("should parse a logical or correctly", () => {
    const parser = new Parser(`
      1 || 2
    `);
    const ast = parser.parse();
    expect(ast).toEqual(
      astFactory([
        {
          type: "LogicalExpression",
          left: {
            type: "NumericLiteral",
            value: 1,
          },
          operator: "||",
          right: {
            type: "NumericLiteral",
            value: 2,
          },
        },
      ])
    );
  });
});
