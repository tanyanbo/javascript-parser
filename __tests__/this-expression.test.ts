import { Parser } from "../src/parser";
import { astFactory } from "../helpers/ast-factory";

describe("this expression", () => {
  it("should parse a this expression correctly", () => {
    const parser = new Parser(`
      test(this)
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
              type: "ThisExpression",
            },
          ],
        },
      ])
    );
  });

  it("should parse a this expression correctly", () => {
    const parser = new Parser(`
      const x = 1 + this.arr[0]
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
              type: "NumericLiteral",
              value: 1,
            },
            operator: "+",
            right: {
              type: "MemberExpression",
              object: {
                type: "MemberExpression",
                object: {
                  type: "ThisExpression",
                },
                property: {
                  type: "Identifier",
                  name: "arr",
                },
                computed: false,
              },
              property: {
                type: "NumericLiteral",
                value: 0,
              },
              computed: true,
            },
          },
          kind: "const",
        },
      ])
    );
  });
});
