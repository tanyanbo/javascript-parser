import { Parser } from "../src/parser";
import { astFactory } from "../helpers/ast-factory";

describe("if statement", () => {
  it("should parse an if statement with an empty body correctly", () => {
    const parser = new Parser(`
      if (x) {}
    `);
    const ast = parser.parse();
    expect(ast).toEqual(
      astFactory([
        {
          type: "IfStatement",
          test: {
            type: "Identifier",
            name: "x",
          },
          consequent: {
            type: "BlockStatement",
            body: [],
          },
        },
      ])
    );
  });

  it("should parse an if statement without {} correctly", () => {
    const parser = new Parser(`
      if (x)
        x = 20 
    `);
    const ast = parser.parse();
    expect(ast).toEqual(
      astFactory([
        {
          type: "IfStatement",
          test: {
            type: "Identifier",
            name: "x",
          },
          consequent: {
            type: "AssignmentExpression",
            id: {
              type: "Identifier",
              name: "x",
            },
            operator: "=",
            value: {
              type: "NumericLiteral",
              value: 20,
            },
          },
        },
      ])
    );
  });

  it("should parse an if statement with multiple statements in body correctly", () => {
    const parser = new Parser(`
      if (x) {
        x = 20 
        y = 30
      }
    `);
    const ast = parser.parse();
    expect(ast).toEqual(
      astFactory([
        {
          type: "IfStatement",
          test: {
            type: "Identifier",
            name: "x",
          },
          consequent: {
            type: "BlockStatement",
            body: [
              {
                type: "AssignmentExpression",
                id: {
                  type: "Identifier",
                  name: "x",
                },
                operator: "=",
                value: {
                  type: "NumericLiteral",
                  value: 20,
                },
              },
              {
                type: "AssignmentExpression",
                id: {
                  type: "Identifier",
                  name: "y",
                },
                operator: "=",
                value: {
                  type: "NumericLiteral",
                  value: 30,
                },
              },
            ],
          },
        },
      ])
    );
  });

  it("should parse an if statement with an expression for the condition", () => {
    const parser = new Parser(`
      if (1 + 1 === 2) {}
    `);
    const ast = parser.parse();
    expect(ast).toEqual(
      astFactory([
        {
          type: "IfStatement",
          test: {
            type: "BinaryExpression",
            left: {
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
            operator: "===",
            right: {
              type: "NumericLiteral",
              value: 2,
            },
          },
          consequent: {
            type: "BlockStatement",
            body: [],
          },
        },
      ])
    );
  });

  it("should parse an else correctly", () => {
    const parser = new Parser(`
      if (1 + 1 === 2) {} else {}
    `);
    const ast = parser.parse();
    expect(ast).toEqual(
      astFactory([
        {
          type: "IfStatement",
          test: {
            type: "BinaryExpression",
            left: {
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
            operator: "===",
            right: {
              type: "NumericLiteral",
              value: 2,
            },
          },
          consequent: {
            type: "BlockStatement",
            body: [],
          },
          alternate: {
            type: "BlockStatement",
            body: [],
          },
        },
      ])
    );
  });

  it("should parse an if else if else statement correctly", () => {
    const parser = new Parser(`
      if (1 + 1 === 2) {} else if (1+1<2) {} else {}
    `);
    const ast = parser.parse();
    expect(ast).toEqual(
      astFactory([
        {
          type: "IfStatement",
          test: {
            type: "BinaryExpression",
            left: {
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
            operator: "===",
            right: {
              type: "NumericLiteral",
              value: 2,
            },
          },
          consequent: {
            type: "BlockStatement",
            body: [],
          },
          alternate: {
            type: "IfStatement",
            test: {
              type: "BinaryExpression",
              left: {
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
              operator: "<",
              right: {
                type: "NumericLiteral",
                value: 2,
              },
            },
            consequent: {
              type: "BlockStatement",
              body: [],
            },
            alternate: {
              type: "BlockStatement",
              body: [],
            },
          },
        },
      ])
    );
  });
});
