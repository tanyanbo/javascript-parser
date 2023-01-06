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
});
