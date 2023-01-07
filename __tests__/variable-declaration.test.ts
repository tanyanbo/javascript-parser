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
          kind: "const",
        },
      ])
    );
  });

  it("should parse a variable declaration with another variable correctly", () => {
    const parser = new Parser(`
      const x = b + 20
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
              type: "Identifier",
              name: "b",
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
          kind: "const",
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
          kind: "let",
        },
      ])
    );
  });

  it("should throw when left hand side of assignment operator is invalid", () => {
    const parser = new Parser(`
      const x() = 20
    `);
    expect(parser.parse).toThrow();
  });
});
