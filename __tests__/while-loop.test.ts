import { Parser } from "../src/parser";
import { astFactory } from "../src/helpers/ast-factory";

describe("while loop", () => {
  it("should parse a while loop correctly", () => {
    const parser = new Parser(`
      while (i < 10) {
        console.log(i);
      }
    `);
    const ast = parser.parse();
    expect(ast).toEqual(
      astFactory([
        {
          type: "WhileStatement",
          test: {
            type: "BinaryExpression",
            left: {
              type: "Identifier",
              name: "i",
            },
            operator: "<",
            right: {
              type: "NumericLiteral",
              value: 10,
            },
          },
          body: {
            type: "BlockStatement",
            body: [
              {
                type: "CallExpression",
                callee: {
                  type: "MemberExpression",
                  object: {
                    type: "Identifier",
                    name: "console",
                  },
                  property: {
                    type: "Identifier",
                    name: "log",
                  },
                  computed: false,
                },
                arguments: [
                  {
                    type: "Identifier",
                    name: "i",
                  },
                ],
              },
            ],
          },
        },
      ])
    );
  });

  it("should parse a for loop without curly braces", () => {
    const parser = new Parser(`
      while (x) 
        console.log(x);
    `);
    const ast = parser.parse();
    expect(ast).toEqual(
      astFactory([
        {
          type: "WhileStatement",
          test: {
            type: "Identifier",
            name: "x",
          },
          body: {
            type: "CallExpression",
            callee: {
              type: "MemberExpression",
              object: {
                type: "Identifier",
                name: "console",
              },
              property: {
                type: "Identifier",
                name: "log",
              },
              computed: false,
            },
            arguments: [
              {
                type: "Identifier",
                name: "x",
              },
            ],
          },
        },
      ])
    );
  });

  it("should parse a continue statement correctly", () => {
    const parser = new Parser(`
      while (i < 10) {
        continue
      }
    `);
    const ast = parser.parse();
    expect(ast).toEqual(
      astFactory([
        {
          type: "WhileStatement",
          test: {
            type: "BinaryExpression",
            left: {
              type: "Identifier",
              name: "i",
            },
            operator: "<",
            right: {
              type: "NumericLiteral",
              value: 10,
            },
          },
          body: {
            type: "BlockStatement",
            body: [
              {
                type: "ContinueStatement",
              },
            ],
          },
        },
      ])
    );
  });

  it("should parse a continue statement with semicolon correctly", () => {
    const parser = new Parser(`
      while (i < 10) {
        continue;
      }
    `);
    const ast = parser.parse();
    expect(ast).toEqual(
      astFactory([
        {
          type: "WhileStatement",
          test: {
            type: "BinaryExpression",
            left: {
              type: "Identifier",
              name: "i",
            },
            operator: "<",
            right: {
              type: "NumericLiteral",
              value: 10,
            },
          },
          body: {
            type: "BlockStatement",
            body: [
              {
                type: "ContinueStatement",
              },
            ],
          },
        },
      ])
    );
  });

  it("should parse a do while loop correctly", () => {
    const parser = new Parser(`
      do {
        console.log(i);
      } while (i < 10)
    `);
    const ast = parser.parse();
    expect(ast).toEqual(
      astFactory([
        {
          type: "DoWhileStatement",
          body: {
            type: "BlockStatement",
            body: [
              {
                type: "CallExpression",
                callee: {
                  type: "MemberExpression",
                  object: {
                    type: "Identifier",
                    name: "console",
                  },
                  property: {
                    type: "Identifier",
                    name: "log",
                  },
                  computed: false,
                },
                arguments: [
                  {
                    type: "Identifier",
                    name: "i",
                  },
                ],
              },
            ],
          },
          test: {
            type: "BinaryExpression",
            left: {
              type: "Identifier",
              name: "i",
            },
            operator: "<",
            right: {
              type: "NumericLiteral",
              value: 10,
            },
          },
        },
      ])
    );
  });

  it("should parse a do while loop with parenthesis in while test correctly", () => {
    const parser = new Parser(`
      do {
        console.log(i);
      } while ((i < 10))
    `);
    const ast = parser.parse();
    expect(ast).toEqual(
      astFactory([
        {
          type: "DoWhileStatement",
          body: {
            type: "BlockStatement",
            body: [
              {
                type: "CallExpression",
                callee: {
                  type: "MemberExpression",
                  object: {
                    type: "Identifier",
                    name: "console",
                  },
                  property: {
                    type: "Identifier",
                    name: "log",
                  },
                  computed: false,
                },
                arguments: [
                  {
                    type: "Identifier",
                    name: "i",
                  },
                ],
              },
            ],
          },
          test: {
            type: "ParenthesizedExpression",
            body: {
              type: "BinaryExpression",
              left: {
                type: "Identifier",
                name: "i",
              },
              operator: "<",
              right: {
                type: "NumericLiteral",
                value: 10,
              },
            },
          },
        },
      ])
    );
  });

  it("should parse a break statement correctly", () => {
    const parser = new Parser(`
      while (i < 10) {
        break;
      }
    `);
    const ast = parser.parse();
    expect(ast).toEqual(
      astFactory([
        {
          type: "WhileStatement",
          test: {
            type: "BinaryExpression",
            left: {
              type: "Identifier",
              name: "i",
            },
            operator: "<",
            right: {
              type: "NumericLiteral",
              value: 10,
            },
          },
          body: {
            type: "BlockStatement",
            body: [
              {
                type: "BreakStatement",
              },
            ],
          },
        },
      ])
    );
  });
});
