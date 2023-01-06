import { Parser } from "../src/parser";
import { astFactory } from "../helpers/ast-factory";

describe("variables", () => {
  it("should parse a variable correctly", () => {
    const parser = new Parser(`
      x
    `);
    const ast = parser.parse();
    expect(ast).toEqual(
      astFactory([
        {
          type: "Identifier",
          name: "x",
        },
      ])
    );
  });

  it("should parse a variable with a number correctly", () => {
    const parser = new Parser(`
      x2
    `);
    const ast = parser.parse();
    expect(ast).toEqual(
      astFactory([
        {
          type: "Identifier",
          name: "x2",
        },
      ])
    );
  });

  it("should parse a binary expression with a variable on both sides correctly", () => {
    const parser = new Parser(`
      x + y
    `);
    const ast = parser.parse();
    expect(ast).toEqual(
      astFactory([
        {
          type: "BinaryExpression",
          left: {
            type: "Identifier",
            name: "x",
          },
          operator: "+",
          right: {
            type: "Identifier",
            name: "y",
          },
        },
      ])
    );
  });

  it("should parse variable redeclaration correctly", () => {
    const parser = new Parser(`
      x = 20
    `);
    const ast = parser.parse();
    expect(ast).toEqual(
      astFactory([
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
      ])
    );
  });

  it("should parse complex variable redeclaration correctly", () => {
    const parser = new Parser(`
      x += 20
    `);
    const ast = parser.parse();
    expect(ast).toEqual(
      astFactory([
        {
          type: "ComplexAssignmentExpression",
          id: {
            type: "Identifier",
            name: "x",
          },
          operator: "+=",
          value: {
            type: "NumericLiteral",
            value: 20,
          },
        },
      ])
    );
  });

  it("should parse chained variable redeclaration correctly", () => {
    const parser = new Parser(`
      x = y = 20
    `);
    const ast = parser.parse();
    expect(ast).toEqual(
      astFactory([
        {
          type: "AssignmentExpression",
          id: {
            type: "Identifier",
            name: "x",
          },
          operator: "=",
          value: {
            type: "AssignmentExpression",
            id: {
              type: "Identifier",
              name: "y",
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
});
