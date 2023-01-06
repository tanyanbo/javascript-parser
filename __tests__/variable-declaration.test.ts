import { Parser } from "../src/parser";
import { astFactory } from "../helpers/ast-factory";

describe("variable declaration", () => {
  it("should parse a variable declaration correctly", () => {
    const parser = new Parser(`
      const x = 20
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
            type: "NumericLiteral",
            value: 20,
          },
        },
      ])
    );
  });

  it("should parse a variable declaration with an expression correctly", () => {
    const parser = new Parser(`
      const x = 20 + 30 
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
              value: 20,
            },
            operator: "+",
            right: {
              type: "NumericLiteral",
              value: 30,
            },
          },
        },
      ])
    );
  });

  it("should parse a variable declaration with no initial value correctly", () => {
    const parser = new Parser(`
      let x
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
        },
      ])
    );
  });
});
