import { Parser } from "../src/parser";
import { astFactory } from "../helpers/ast-factory";

describe("parenthesized expression", () => {
  it("should parse a parenthesized expression correctly", () => {
    const parser = new Parser(`
      10 * (2 + 5)
    `);
    const ast = parser.parse();
    expect(ast).toEqual(
      astFactory([
        {
          type: "BinaryExpression",
          left: {
            type: "NumericLiteral",
            value: 10,
          },
          operator: "*",
          right: {
            type: "ParenthesizedExpression",
            body: {
              type: "BinaryExpression",
              left: {
                type: "NumericLiteral",
                value: 2,
              },
              operator: "+",
              right: {
                type: "NumericLiteral",
                value: 5,
              },
            },
          },
        },
      ])
    );
  });

  it("should parse a nested parenthesized expression correctly", () => {
    const parser = new Parser(`
      10 * (2 * (5 + 1))
    `);
    const ast = parser.parse();
    expect(ast).toEqual(
      astFactory([
        {
          type: "BinaryExpression",
          left: {
            type: "NumericLiteral",
            value: 10,
          },
          operator: "*",
          right: {
            type: "ParenthesizedExpression",
            body: {
              type: "BinaryExpression",
              left: {
                type: "NumericLiteral",
                value: 2,
              },
              operator: "*",
              right: {
                type: "ParenthesizedExpression",
                body: {
                  type: "BinaryExpression",
                  left: {
                    type: "NumericLiteral",
                    value: 5,
                  },
                  operator: "+",
                  right: {
                    type: "NumericLiteral",
                    value: 1,
                  },
                },
              },
            },
          },
        },
      ])
    );
  });
});
