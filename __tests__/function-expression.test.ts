import { Parser } from "../src/parser";
import { astFactory } from "../src/helpers/ast-factory";

describe("function expression", () => {
  it("should parse an object literal with one function expression correctly", () => {
    const parser = new Parser(`
      const x = {
        a: function() {}
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
                  name: "a",
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
                method: false,
              },
            ],
          },
          kind: "const",
        },
      ])
    );
  });

  it("should parse an object literal with one async function expression correctly", () => {
    const parser = new Parser(`
      const x = {
        a: async function() {}
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
                  name: "a",
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
                method: false,
              },
            ],
          },
          kind: "const",
        },
      ])
    );
  });

  it("should parse a variable declaration with one function expression correctly", () => {
    const parser = new Parser(`
      const x = function() {}
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
            type: "FunctionExpression",
            params: [],
            body: {
              type: "BlockStatement",
              body: [],
            },
            async: false,
            generator: false,
          },
          kind: "const",
        },
      ])
    );
  });

  it("should parse a variable declaration with one async function expression correctly", () => {
    const parser = new Parser(`
      const x = async function() {}
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
            type: "FunctionExpression",
            params: [],
            body: {
              type: "BlockStatement",
              body: [],
            },
            async: true,
            generator: false,
          },
          kind: "const",
        },
      ])
    );
  });
});
