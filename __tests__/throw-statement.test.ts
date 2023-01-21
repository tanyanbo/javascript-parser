import { Parser } from "../src/parser";
import { astFactory } from "../src/helpers/ast-factory";

describe("while loop", () => {
  it("should parse a throw statement correctly", () => {
    const parser = new Parser(`
      throw 1
    `);
    const ast = parser.parse();
    expect(ast).toEqual(
      astFactory([
        {
          type: "ThrowStatement",
          argument: {
            type: "NumericLiteral",
            value: 1,
          },
        },
      ])
    );
  });

  it("should parse a throw statement with a binary expression correctly", () => {
    const parser = new Parser(`
      throw 2 * 3
    `);
    const ast = parser.parse();
    expect(ast).toEqual(
      astFactory([
        {
          type: "ThrowStatement",
          argument: {
            type: "BinaryExpression",
            left: {
              type: "NumericLiteral",
              value: 2,
            },
            operator: "*",
            right: {
              type: "NumericLiteral",
              value: 3,
            },
          },
        },
      ])
    );
  });
});
