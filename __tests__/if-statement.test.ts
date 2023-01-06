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
          condition: {
            type: "Identifier",
            name: "x",
          },
          body: [],
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
          condition: {
            type: "Identifier",
            name: "x",
          },
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
          ],
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
          condition: {
            type: "Identifier",
            name: "x",
          },
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
      ])
    );
  });
});
