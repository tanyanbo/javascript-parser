import { Parser } from "../src/parser";
import { astFactory } from "../helpers/ast-factory";

describe("function declaration", () => {
  it("should parse a function declaration with no arguments and no body", () => {
    const parser = new Parser(`
      function test() {}
    `);
    const ast = parser.parse();
    expect(ast).toEqual(
      astFactory([
        {
          type: "FunctionDeclaration",
          id: {
            type: "Identifier",
            name: "test",
          },
          generator: false,
          async: false,
          params: [],
          body: {
            type: "BlockStatement",
            body: [],
          },
        },
      ])
    );
  });

  it("should parse a function declaration with arguments correctly", () => {
    const parser = new Parser(`
      function test(a, b) {}
    `);
    const ast = parser.parse();
    expect(ast).toEqual(
      astFactory([
        {
          type: "FunctionDeclaration",
          id: {
            type: "Identifier",
            name: "test",
          },
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
      ])
    );
  });

  it("should parse a function declaration with body correctly", () => {
    const parser = new Parser(`
      function test() {
        const a = 10
        a+=20
      }
    `);
    const ast = parser.parse();
    expect(ast).toEqual(
      astFactory([
        {
          type: "FunctionDeclaration",
          id: {
            type: "Identifier",
            name: "test",
          },
          generator: false,
          async: false,
          params: [],
          body: {
            type: "BlockStatement",
            body: [
              {
                type: "VariableDeclaration",
                id: {
                  type: "Identifier",
                  name: "a",
                },
                value: {
                  type: "NumericLiteral",
                  value: 10,
                },
                kind: "const",
              },
              {
                type: "ComplexAssignmentExpression",
                id: {
                  type: "Identifier",
                  name: "a",
                },
                operator: "+=",
                value: {
                  type: "NumericLiteral",
                  value: 20,
                },
              },
            ],
          },
        },
      ])
    );
  });

  it("should parse return statement correctly", () => {
    const parser = new Parser(`
      function test() {
        return 10
      }
    `);
    const ast = parser.parse();
    expect(ast).toEqual(
      astFactory([
        {
          type: "FunctionDeclaration",
          id: {
            type: "Identifier",
            name: "test",
          },
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
                  value: 10,
                },
              },
            ],
          },
        },
      ])
    );
  });

  it("should throw when it encounters a return statement outside of a function", () => {
    const parser = new Parser(`
    for (;;) {
      return 10
    }
    `);
    expect(() => parser.parse()).toThrowError();
  });

  it("should throw when it encounters a return statement outside of a function and block", () => {
    const parser = new Parser(`
      return 10
    `);
    expect(() => parser.parse()).toThrowError();
  });
});
