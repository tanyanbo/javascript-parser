import { Parser } from "../src/parser";
import { astFactory } from "../helpers/ast-factory";

describe("member expression", () => {
  it("should parse a non computed member expression correctly", () => {
    const parser = new Parser(`
      obj.a
    `);
    const ast = parser.parse();
    expect(ast).toEqual(
      astFactory([
        {
          type: "MemberExpression",
          object: {
            type: "Identifier",
            name: "obj",
          },
          property: {
            type: "Identifier",
            name: "a",
          },
          computed: false,
        },
      ])
    );
  });

  it("should parse a computed member expression correctly", () => {
    const parser = new Parser(`
      obj[1]
    `);
    const ast = parser.parse();
    expect(ast).toEqual(
      astFactory([
        {
          type: "MemberExpression",
          object: {
            type: "Identifier",
            name: "obj",
          },
          property: {
            type: "NumericLiteral",
            value: 1,
          },
          computed: true,
        },
      ])
    );
  });

  it("should parse chained member expression correctly", () => {
    const parser = new Parser(`
      obj.a[1]
    `);
    const ast = parser.parse();
    expect(ast).toEqual(
      astFactory([
        {
          type: "MemberExpression",
          object: {
            type: "MemberExpression",
            object: {
              type: "Identifier",
              name: "obj",
            },
            property: {
              type: "Identifier",
              name: "a",
            },
            computed: false,
          },
          property: {
            type: "NumericLiteral",
            value: 1,
          },
          computed: true,
        },
      ])
    );
  });
});
