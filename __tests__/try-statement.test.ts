import { Parser } from "../src/parser";
import { astFactory } from "../helpers/ast-factory";

describe("try statement", () => {
  it("should parse a try statement with a catch block correctly", () => {
    const parser = new Parser(`
      try {
      } catch {
      }
    `);
    const ast = parser.parse();
    expect(ast).toEqual(
      astFactory([
        {
          type: "TryStatement",
          block: {
            type: "BlockStatement",
            body: [],
          },
          handler: {
            type: "CatchClause",
            body: {
              type: "BlockStatement",
              body: [],
            },
          },
        },
      ])
    );
  });

  it("should parse a catch statement with a parameter correctly", () => {
    const parser = new Parser(`
      try {
      } catch(e) {
      }
    `);
    const ast = parser.parse();
    expect(ast).toEqual(
      astFactory([
        {
          type: "TryStatement",
          block: {
            type: "BlockStatement",
            body: [],
          },
          handler: {
            type: "CatchClause",
            param: {
              type: "Identifier",
              name: "e",
            },
            body: {
              type: "BlockStatement",
              body: [],
            },
          },
        },
      ])
    );
  });

  it("should parse a try finally block correctly", () => {
    const parser = new Parser(`
      try {
      } finally {
      }
    `);
    const ast = parser.parse();
    expect(ast).toEqual(
      astFactory([
        {
          type: "TryStatement",
          block: {
            type: "BlockStatement",
            body: [],
          },
          finalizer: {
            type: "BlockStatement",
            body: [],
          },
        },
      ])
    );
  });

  it("should parse a try catch finally block correctly", () => {
    const parser = new Parser(`
      try {
      } catch {
      } finally {
      }
    `);
    const ast = parser.parse();
    expect(ast).toEqual(
      astFactory([
        {
          type: "TryStatement",
          block: {
            type: "BlockStatement",
            body: [],
          },
          handler: {
            type: "CatchClause",
            body: {
              type: "BlockStatement",
              body: [],
            },
          },
          finalizer: {
            type: "BlockStatement",
            body: [],
          },
        },
      ])
    );
  });

  it("should parse a try finally block with body correctly", () => {
    const parser = new Parser(`
      try {
        const x = 1
      } catch(e) {
        log(e)
      } finally {
        log(1)
      }
    `);
    const ast = parser.parse();
    expect(ast).toEqual(
      astFactory([
        {
          type: "TryStatement",
          block: {
            type: "BlockStatement",
            body: [
              {
                type: "VariableDeclaration",
                id: {
                  type: "Identifier",
                  name: "x",
                },
                value: {
                  type: "NumericLiteral",
                  value: 1,
                },
                kind: "const",
              },
            ],
          },
          handler: {
            type: "CatchClause",
            param: {
              type: "Identifier",
              name: "e",
            },
            body: {
              type: "BlockStatement",
              body: [
                {
                  type: "CallExpression",
                  callee: {
                    type: "Identifier",
                    name: "log",
                  },
                  arguments: [
                    {
                      type: "Identifier",
                      name: "e",
                    },
                  ],
                },
              ],
            },
          },
          finalizer: {
            type: "BlockStatement",
            body: [
              {
                type: "CallExpression",
                callee: {
                  type: "Identifier",
                  name: "log",
                },
                arguments: [
                  {
                    type: "NumericLiteral",
                    value: 1,
                  },
                ],
              },
            ],
          },
        },
      ])
    );
  });
});
