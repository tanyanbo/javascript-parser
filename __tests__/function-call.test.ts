import { Parser } from "../src/parser";
import { astFactory } from "../helpers/ast-factory";

describe("calling a function", () => {
  it("should parse calling a function with no arguments correctly", () => {
    const parser = new Parser(`
      test()
    `);
    const ast = parser.parse();
    expect(ast).toEqual(
      astFactory([
        {
          type: "CallExpression",
          callee: {
            type: "Identifier",
            name: "test",
          },
          arguments: [],
        },
      ])
    );
  });

  it("should parse calling a function with two arguments correctly", () => {
    const parser = new Parser(`
      test(1, x);
    `);
    const ast = parser.parse();
    expect(ast).toEqual(
      astFactory([
        {
          type: "CallExpression",
          callee: {
            type: "Identifier",
            name: "test",
          },
          arguments: [
            {
              type: "NumericLiteral",
              value: 1,
            },
            {
              type: "Identifier",
              name: "x",
            },
          ],
        },
      ])
    );
  });

  it("should parse calling a function in the middle of an expression correctly", () => {
    const parser = new Parser(`
      const x = 10 + test(1) + 20
    `);
    const ast = parser.parse();
    expect(ast).toEqual(
      astFactory([
        {
          type: "VariableDeclaration",
          id: {
            type: "Identifier",
            name: "x",
          },
          value: {
            type: "BinaryExpression",
            left: {
              type: "BinaryExpression",
              left: {
                type: "NumericLiteral",
                value: 10,
              },
              operator: "+",
              right: {
                type: "CallExpression",
                callee: {
                  type: "Identifier",
                  name: "test",
                },
                arguments: [
                  {
                    type: "NumericLiteral",
                    value: 1,
                  },
                ],
              },
            },
            operator: "+",
            right: {
              type: "NumericLiteral",
              value: 20,
            },
          },
          kind: "const",
        },
      ])
    );
  });

  it("should parse calling a function with another function call as argument", () => {
    const parser = new Parser(`
      test(x());
    `);
    const ast = parser.parse();
    expect(ast).toEqual(
      astFactory([
        {
          type: "CallExpression",
          callee: {
            type: "Identifier",
            name: "test",
          },
          arguments: [
            {
              type: "CallExpression",
              callee: {
                type: "Identifier",
                name: "x",
              },
              arguments: [],
            },
          ],
        },
      ])
    );
  });

  it("should parse chained function calls correctly", () => {
    const parser = new Parser(`
      test(1)(a)()
    `);
    const ast = parser.parse();
    expect(ast).toEqual(
      astFactory([
        {
          type: "CallExpression",
          callee: {
            type: "CallExpression",
            callee: {
              type: "CallExpression",
              callee: {
                type: "Identifier",
                name: "test",
              },
              arguments: [
                {
                  type: "NumericLiteral",
                  value: 1,
                },
              ],
            },
            arguments: [
              {
                type: "Identifier",
                name: "a",
              },
            ],
          },
          arguments: [],
        },
      ])
    );
  });
});
