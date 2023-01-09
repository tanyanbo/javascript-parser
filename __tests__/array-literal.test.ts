import { Parser } from "../src/parser";
import { astFactory } from "../helpers/ast-factory";

describe("array literal", () => {
  it("should parse an array literal with no elements correctly", () => {
    const parser = new Parser(`
      const x = []
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
            type: "ArrayLiteral",
            elements: [],
          },
          kind: "const",
        },
      ])
    );
  });

  it("should parse an array literal with one element correctly", () => {
    const parser = new Parser(`
      const x = [1]
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
            type: "ArrayLiteral",
            elements: [
              {
                type: "NumericLiteral",
                value: 1,
              },
            ],
          },
          kind: "const",
        },
      ])
    );
  });

  it("should parse an array literal with multiple elements correctly", () => {
    const parser = new Parser(`
      const x = [1, test() + 3]
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
            type: "ArrayLiteral",
            elements: [
              {
                type: "NumericLiteral",
                value: 1,
              },
              {
                type: "BinaryExpression",
                left: {
                  type: "CallExpression",
                  callee: {
                    type: "Identifier",
                    name: "test",
                  },
                  arguments: [],
                },
                operator: "+",
                right: {
                  type: "NumericLiteral",
                  value: 3,
                },
              },
            ],
          },
          kind: "const",
        },
      ])
    );
  });
});
