import { Parser } from "../src/parser";
import { astFactory } from "../src/helpers/ast-factory";

describe("object literal", () => {
  it("should parse an object literal with no entries correctly", () => {
    const parser = new Parser(`
      const x = {} 
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
            type: "ObjectLiteral",
            properties: [],
          },
          kind: "const",
        },
      ])
    );
  });

  it("should parse an object literal with one entry correctly", () => {
    const parser = new Parser(`
      const x = {a: 1}
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
            type: "ObjectLiteral",
            properties: [
              {
                type: "Property",
                key: {
                  type: "Identifier",
                  name: "a",
                },
                value: {
                  type: "NumericLiteral",
                  value: 1,
                },
                computed: false,
                method: false,
              },
            ],
          },
          kind: "const",
        },
      ])
    );
  });

  it("should parse an object literal with a string literal as the key correctly", () => {
    const parser = new Parser(`
      const x = {'2': 1}
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
            type: "ObjectLiteral",
            properties: [
              {
                type: "Property",
                key: {
                  type: "StringLiteral",
                  value: "2",
                },
                value: {
                  type: "NumericLiteral",
                  value: 1,
                },
                computed: false,
                method: false,
              },
            ],
          },
          kind: "const",
        },
      ])
    );
  });

  it("should parse an object literal with multiple entries correctly", () => {
    const parser = new Parser(`
      const x = {a: 1, b: 2}
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
            type: "ObjectLiteral",
            properties: [
              {
                type: "Property",
                key: {
                  type: "Identifier",
                  name: "a",
                },
                value: {
                  type: "NumericLiteral",
                  value: 1,
                },
                computed: false,
                method: false,
              },
              {
                type: "Property",
                key: {
                  type: "Identifier",
                  name: "b",
                },
                value: {
                  type: "NumericLiteral",
                  value: 2,
                },
                computed: false,
                method: false,
              },
            ],
          },
          kind: "const",
        },
      ])
    );
  });

  it("should parse an object literal with one computed property correctly", () => {
    const parser = new Parser(`
      const x = {[a + 1]: 1}
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
            type: "ObjectLiteral",
            properties: [
              {
                type: "Property",
                key: {
                  type: "BinaryExpression",
                  left: {
                    type: "Identifier",
                    name: "a",
                  },
                  operator: "+",
                  right: {
                    type: "NumericLiteral",
                    value: 1,
                  },
                },
                value: {
                  type: "NumericLiteral",
                  value: 1,
                },
                computed: true,
                method: false,
              },
            ],
          },
          kind: "const",
        },
      ])
    );
  });

  it("should parse an object literal with one method correctly", () => {
    const parser = new Parser(`
      const x = {
        test() {}
      }
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
            type: "ObjectLiteral",
            properties: [
              {
                type: "Property",
                key: {
                  type: "Identifier",
                  name: "test",
                },
                value: {
                  type: "FunctionExpression",
                  params: [],
                  body: {
                    type: "BlockStatement",
                    body: [],
                  },
                  async: false,
                  generator: false,
                },
                computed: false,
                method: true,
              },
            ],
          },
          kind: "const",
        },
      ])
    );
  });

  it("should parse an object literal with one async method correctly", () => {
    const parser = new Parser(`
      const x = {
        async test() {}
      }
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
            type: "ObjectLiteral",
            properties: [
              {
                type: "Property",
                key: {
                  type: "Identifier",
                  name: "test",
                },
                value: {
                  type: "FunctionExpression",
                  params: [],
                  body: {
                    type: "BlockStatement",
                    body: [],
                  },
                  async: true,
                  generator: false,
                },
                computed: false,
                method: true,
              },
            ],
          },
          kind: "const",
        },
      ])
    );
  });

  it("should parse an object literal with one computed method correctly", () => {
    const parser = new Parser(`
      const x = {
        [1+1]() {}
      }
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
            type: "ObjectLiteral",
            properties: [
              {
                type: "Property",
                key: {
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
                value: {
                  type: "FunctionExpression",
                  params: [],
                  body: {
                    type: "BlockStatement",
                    body: [],
                  },
                  async: false,
                  generator: false,
                },
                computed: true,
                method: true,
              },
            ],
          },
          kind: "const",
        },
      ])
    );
  });

  it("should parse an object literal with one async computed method correctly", () => {
    const parser = new Parser(`
      const x = {
        async [1+1]() {}
      }
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
            type: "ObjectLiteral",
            properties: [
              {
                type: "Property",
                key: {
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
                value: {
                  type: "FunctionExpression",
                  params: [],
                  body: {
                    type: "BlockStatement",
                    body: [],
                  },
                  async: true,
                  generator: false,
                },
                computed: true,
                method: true,
              },
            ],
          },
          kind: "const",
        },
      ])
    );
  });
});
