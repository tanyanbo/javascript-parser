import { Parser } from "../src/parser";
import { astFactory } from "../src/helpers/ast-factory";

describe("for loop", () => {
  it("should parse a for loop correctly", () => {
    const parser = new Parser(`
      for (let i=0; i<10; i+=1) {
        console.log(i);
      }
    `);
    const ast = parser.parse();
    expect(ast).toEqual(
      astFactory([
        {
          type: "ForStatement",
          init: {
            type: "VariableDeclaration",
            id: {
              type: "Identifier",
              name: "i",
            },
            value: {
              type: "NumericLiteral",
              value: 0,
            },
            kind: "let",
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
          update: {
            type: "ComplexAssignmentExpression",
            id: {
              type: "Identifier",
              name: "i",
            },
            operator: "+=",
            value: {
              type: "NumericLiteral",
              value: 1,
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

  it("should parse a for loop without init, test and update correctly", () => {
    const parser = new Parser(`
      for (;;) {
        console.log(i);
      }
    `);
    const ast = parser.parse();
    expect(ast).toEqual(
      astFactory([
        {
          type: "ForStatement",
          init: null,
          test: null,
          update: null,
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
      for (;;) 
        console.log(i);
    `);
    const ast = parser.parse();
    expect(ast).toEqual(
      astFactory([
        {
          type: "ForStatement",
          init: null,
          test: null,
          update: null,
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
                name: "i",
              },
            ],
          },
        },
      ])
    );
  });

  it("should parse a for of loop correctly", () => {
    const parser = new Parser(`
      for (const x of arr) 
        console.log(x);
    `);
    const ast = parser.parse();
    expect(ast).toEqual(
      astFactory([
        {
          type: "ForOfStatement",
          left: {
            type: "Identifier",
            name: "x",
          },
          right: {
            type: "Identifier",
            name: "arr",
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
});
