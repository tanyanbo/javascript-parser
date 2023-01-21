import { Parser } from "../src/parser";
import { astFactory } from "../src/helpers/ast-factory";

describe("arrow function", () => {
  it("should parse an arrow function with no parameters and no body correctly", () => {
    const parser = new Parser(`
      const fn = () => {}
    `);
    const ast = parser.parse();
    expect(ast).toEqual(
      astFactory([
        {
          type: "VariableDeclaration",
          id: {
            type: "Identifier",
            name: "fn",
          },
          value: {
            type: "ArrowFunctionExpression",
            generator: false,
            async: false,
            params: [],
            body: {
              type: "BlockStatement",
              body: [],
            },
          },
          kind: "const",
        },
      ])
    );
  });

  it("should parse an arrow function with one parameter and no body correctly", () => {
    const parser = new Parser(`
      const fn = (a) => {}
    `);
    const ast = parser.parse();
    expect(ast).toEqual(
      astFactory([
        {
          type: "VariableDeclaration",
          id: {
            type: "Identifier",
            name: "fn",
          },
          value: {
            type: "ArrowFunctionExpression",
            generator: false,
            async: false,
            params: [
              {
                type: "Identifier",
                name: "a",
              },
            ],
            body: {
              type: "BlockStatement",
              body: [],
            },
          },
          kind: "const",
        },
      ])
    );
  });

  it("should parse an arrow function with one parameter and no function parentheses and no body correctly", () => {
    const parser = new Parser(`
      const fn = a => {}
    `);
    const ast = parser.parse();
    expect(ast).toEqual(
      astFactory([
        {
          type: "VariableDeclaration",
          id: {
            type: "Identifier",
            name: "fn",
          },
          value: {
            type: "ArrowFunctionExpression",
            generator: false,
            async: false,
            params: [
              {
                type: "Identifier",
                name: "a",
              },
            ],
            body: {
              type: "BlockStatement",
              body: [],
            },
          },
          kind: "const",
        },
      ])
    );
  });

  it("should parse an arrow function with two parameters and no body correctly", () => {
    const parser = new Parser(`
      const fn = (a, b) => {}
    `);
    const ast = parser.parse();
    expect(ast).toEqual(
      astFactory([
        {
          type: "VariableDeclaration",
          id: {
            type: "Identifier",
            name: "fn",
          },
          value: {
            type: "ArrowFunctionExpression",
            generator: false,
            async: false,
            params: [
              {
                type: "Identifier",
                name: "a",
              },
              {
                type: "Identifier",
                name: "b",
              },
            ],
            body: {
              type: "BlockStatement",
              body: [],
            },
          },
          kind: "const",
        },
      ])
    );
  });

  it("should parse an async arrow function with no parameters and no body correctly", () => {
    const parser = new Parser(`
      const fn = async () => {}
    `);
    const ast = parser.parse();
    expect(ast).toEqual(
      astFactory([
        {
          type: "VariableDeclaration",
          id: {
            type: "Identifier",
            name: "fn",
          },
          value: {
            type: "ArrowFunctionExpression",
            generator: false,
            async: true,
            params: [],
            body: {
              type: "BlockStatement",
              body: [],
            },
          },
          kind: "const",
        },
      ])
    );
  });

  it("should parse an async arrow function with one parameter and no function parentheses and no body correctly", () => {
    const parser = new Parser(`
      const fn = async a => {}
    `);
    const ast = parser.parse();
    expect(ast).toEqual(
      astFactory([
        {
          type: "VariableDeclaration",
          id: {
            type: "Identifier",
            name: "fn",
          },
          value: {
            type: "ArrowFunctionExpression",
            generator: false,
            async: true,
            params: [
              {
                type: "Identifier",
                name: "a",
              },
            ],
            body: {
              type: "BlockStatement",
              body: [],
            },
          },
          kind: "const",
        },
      ])
    );
  });

  it("should parse an arrow function with no parameters and body without curly braces correctly", () => {
    const parser = new Parser(`
      const fn = () => 1
    `);
    const ast = parser.parse();
    expect(ast).toEqual(
      astFactory([
        {
          type: "VariableDeclaration",
          id: {
            type: "Identifier",
            name: "fn",
          },
          value: {
            type: "ArrowFunctionExpression",
            generator: false,
            async: false,
            params: [],
            body: {
              type: "NumericLiteral",
              value: 1,
            },
          },
          kind: "const",
        },
      ])
    );
  });

  it("should parse an arrow function with no parameters and body with curly braces correctly", () => {
    const parser = new Parser(`
      const fn = () => {
        return 1
      }
    `);
    const ast = parser.parse();
    expect(ast).toEqual(
      astFactory([
        {
          type: "VariableDeclaration",
          id: {
            type: "Identifier",
            name: "fn",
          },
          value: {
            type: "ArrowFunctionExpression",
            generator: false,
            async: false,
            params: [],
            body: {
              type: "BlockStatement",
              body: [
                {
                  type: "ReturnStatement",
                  argument: {
                    type: "NumericLiteral",
                    value: 1,
                  },
                },
              ],
            },
          },
          kind: "const",
        },
      ])
    );
  });

  it("should parse an arrow function with one default parameter correctly", () => {
    const parser = new Parser(`
      const fn = (a = 1) => {}
    `);
    const ast = parser.parse();
    expect(ast).toEqual(
      astFactory([
        {
          type: "VariableDeclaration",
          id: {
            type: "Identifier",
            name: "fn",
          },
          value: {
            type: "ArrowFunctionExpression",
            generator: false,
            async: false,
            params: [
              {
                type: "AssignmentPattern",
                left: {
                  type: "Identifier",
                  name: "a",
                },
                right: {
                  type: "NumericLiteral",
                  value: 1,
                },
              },
            ],
            body: {
              type: "BlockStatement",
              body: [],
            },
          },
          kind: "const",
        },
      ])
    );
  });

  it("should parse an arrow function with two default parameters correctly", () => {
    const parser = new Parser(`
      const fn = (a = 1, b = 2) => {}
    `);
    const ast = parser.parse();
    expect(ast).toEqual(
      astFactory([
        {
          type: "VariableDeclaration",
          id: {
            type: "Identifier",
            name: "fn",
          },
          value: {
            type: "ArrowFunctionExpression",
            generator: false,
            async: false,
            params: [
              {
                type: "AssignmentPattern",
                left: {
                  type: "Identifier",
                  name: "a",
                },
                right: {
                  type: "NumericLiteral",
                  value: 1,
                },
              },
              {
                type: "AssignmentPattern",
                left: {
                  type: "Identifier",
                  name: "b",
                },
                right: {
                  type: "NumericLiteral",
                  value: 2,
                },
              },
            ],
            body: {
              type: "BlockStatement",
              body: [],
            },
          },
          kind: "const",
        },
      ])
    );
  });
});
