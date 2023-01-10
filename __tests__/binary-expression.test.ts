import { Parser } from "../src/parser";
import { astFactory } from "../helpers/ast-factory";

describe("binary expression", () => {
  it("should parse binary expression with plus operator correctly", () => {
    const parser = new Parser(`
      2 + 5
    `);
    const ast = parser.parse();
    expect(ast).toEqual(
      astFactory([
        {
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
      ])
    );
  });

  it("should parse binary expression with multiply operator correctly", () => {
    const parser = new Parser(`
      2 * 5
    `);
    const ast = parser.parse();
    expect(ast).toEqual(
      astFactory([
        {
          type: "BinaryExpression",
          left: {
            type: "NumericLiteral",
            value: 2,
          },
          operator: "*",
          right: {
            type: "NumericLiteral",
            value: 5,
          },
        },
      ])
    );
  });

  it("should parse binary expression with plus and multiply operator correctly", () => {
    const parser = new Parser(`
      3 + 2 * 5
    `);
    const ast = parser.parse();
    expect(ast).toEqual(
      astFactory([
        {
          type: "BinaryExpression",
          left: {
            type: "NumericLiteral",
            value: 3,
          },
          operator: "+",
          right: {
            type: "BinaryExpression",
            operator: "*",
            left: {
              type: "NumericLiteral",
              value: 2,
            },
            right: {
              type: "NumericLiteral",
              value: 5,
            },
          },
        },
      ])
    );
  });

  it("should parse binary expression with multiple plus and multiply operators correctly", () => {
    const parser = new Parser(`
      3 + 3 * 2 * 5
    `);
    const ast = parser.parse();
    expect(ast).toEqual(
      astFactory([
        {
          type: "BinaryExpression",
          left: {
            type: "NumericLiteral",
            value: 3,
          },
          operator: "+",
          right: {
            type: "BinaryExpression",
            left: {
              type: "BinaryExpression",
              left: {
                type: "NumericLiteral",
                value: 3,
              },
              operator: "*",
              right: {
                type: "NumericLiteral",
                value: 2,
              },
            },
            operator: "*",
            right: {
              type: "NumericLiteral",
              value: 5,
            },
          },
        },
      ])
    );
  });

  it("should parse binary expression with plus, multiply and power operators correctly", () => {
    const parser = new Parser(`
      3 + 3 * 2 ** 5
    `);
    const ast = parser.parse();
    expect(ast).toEqual(
      astFactory([
        {
          type: "BinaryExpression",
          left: {
            type: "NumericLiteral",
            value: 3,
          },
          operator: "+",
          right: {
            type: "BinaryExpression",
            left: {
              type: "NumericLiteral",
              value: 3,
            },
            operator: "*",
            right: {
              type: "BinaryExpression",
              left: {
                type: "NumericLiteral",
                value: 2,
              },
              operator: "**",
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

  it("should parse binary expression with equality operator correctly", () => {
    const parser = new Parser(`
      1 + 1 == 2
    `);
    const ast = parser.parse();
    expect(ast).toEqual(
      astFactory([
        {
          type: "BinaryExpression",
          left: {
            type: "BinaryExpression",
            left: {
              type: "NumericLiteral",
              value: 1,
            },
            operator: "+",
            right: {
              type: "NumericLiteral",
              value: 1,
            },
          },
          operator: "==",
          right: {
            type: "NumericLiteral",
            value: 2,
          },
        },
      ])
    );
  });

  it("should parse binary expression with strict equality operator correctly", () => {
    const parser = new Parser(`
      1 + 1 === 2
    `);
    const ast = parser.parse();
    expect(ast).toEqual(
      astFactory([
        {
          type: "BinaryExpression",
          left: {
            type: "BinaryExpression",
            left: {
              type: "NumericLiteral",
              value: 1,
            },
            operator: "+",
            right: {
              type: "NumericLiteral",
              value: 1,
            },
          },
          operator: "===",
          right: {
            type: "NumericLiteral",
            value: 2,
          },
        },
      ])
    );
  });

  it("should parse binary expression with bitwise or operator correctly", () => {
    const parser = new Parser(`
      2 | 5
    `);
    const ast = parser.parse();
    expect(ast).toEqual(
      astFactory([
        {
          type: "BinaryExpression",
          left: {
            type: "NumericLiteral",
            value: 2,
          },
          operator: "|",
          right: {
            type: "NumericLiteral",
            value: 5,
          },
        },
      ])
    );
  });

  it("should parse binary expression with bitwise or, xor and and operators correctly", () => {
    const parser = new Parser(`
      2 | 5 & 10 ^ 5
    `);
    const ast = parser.parse();
    expect(ast).toEqual(
      astFactory([
        {
          type: "BinaryExpression",
          left: {
            type: "NumericLiteral",
            value: 2,
          },
          operator: "|",
          right: {
            type: "BinaryExpression",
            left: {
              type: "BinaryExpression",
              left: {
                type: "NumericLiteral",
                value: 5,
              },
              operator: "&",
              right: {
                type: "NumericLiteral",
                value: 10,
              },
            },
            operator: "^",
            right: {
              type: "NumericLiteral",
              value: 5,
            },
          },
        },
      ])
    );
  });
});
