import { Parser } from "../src/parser";
import { astFactory } from "../src/helpers/ast-factory";

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

  it("should parse a generator function declaration with no arguments and no body", () => {
    const parser = new Parser(`
      function* test() {}
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
          generator: true,
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

  it("should parse an async function declaration with no arguments and no body", () => {
    const parser = new Parser(`
      async function test() {}
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
          async: true,
          params: [],
          body: {
            type: "BlockStatement",
            body: [],
          },
        },
      ])
    );
  });

  it("should parse an async generator function declaration with no arguments and no body", () => {
    const parser = new Parser(`
      async function* test() {}
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
          generator: true,
          async: true,
          params: [],
          body: {
            type: "BlockStatement",
            body: [],
          },
        },
      ])
    );
  });

  it("should parse await expression correctly", () => {
    const parser = new Parser(`
      async function test() {
        const x = 1 + await 10
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
          async: true,
          params: [],
          body: {
            type: "BlockStatement",
            body: [
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
                    type: "AwaitExpression",
                    argument: {
                      type: "NumericLiteral",
                      value: 10,
                    },
                  },
                },
                kind: "const",
              },
            ],
          },
        },
      ])
    );
  });

  it("should parse yield expression correctly", () => {
    const parser = new Parser(`
      function* test() {
        yield 10
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
          generator: true,
          async: false,
          params: [],
          body: {
            type: "BlockStatement",
            body: [
              {
                type: "YieldExpression",
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

  it("should parse yield expression in binary expression correctly", () => {
    const parser = new Parser(`
      function* test() {
        const x = 1 + yield 10
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
          generator: true,
          async: false,
          params: [],
          body: {
            type: "BlockStatement",
            body: [
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
                    type: "YieldExpression",
                    argument: {
                      type: "NumericLiteral",
                      value: 10,
                    },
                  },
                },
                kind: "const",
              },
            ],
          },
        },
      ])
    );
  });

  it("should parse a function declaration with default arguments", () => {
    const parser = new Parser(`
      function test(b, a = 3) {}
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
              name: "b",
            },
            {
              type: "AssignmentPattern",
              left: {
                type: "Identifier",
                name: "a",
              },
              right: {
                type: "NumericLiteral",
                value: 3,
              },
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
});
