import { Parser } from "../src/parser";
import { astFactory } from "../helpers/ast-factory";

describe("unary expression", () => {
  it("should parse a unary expression correctly", () => {
    const parser = new Parser(`
      !x
    `);
    const ast = parser.parse();
    expect(ast).toEqual(
      astFactory([
        {
          type: "UnaryExpression",
          operator: "!",
          argument: {
            type: "Identifier",
            name: "x",
          },
        },
      ])
    );
  });

  it("should parse a chained unary expression correctly", () => {
    const parser = new Parser(`
      !!x
    `);
    const ast = parser.parse();
    expect(ast).toEqual(
      astFactory([
        {
          type: "UnaryExpression",
          operator: "!",
          argument: {
            type: "UnaryExpression",
            operator: "!",
            argument: {
              type: "Identifier",
              name: "x",
            },
          },
        },
      ])
    );
  });
});
