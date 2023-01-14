import { Parser } from "../src/parser";
import { astFactory } from "../helpers/ast-factory";

describe("update expression", () => {
  it("should parse a prefix update expression correctly", () => {
    const parser = new Parser(`
      ++a
    `);
    const ast = parser.parse();
    expect(ast).toEqual(
      astFactory([
        {
          type: "UpdateExpression",
          operator: "++",
          prefix: true,
          argument: {
            type: "Identifier",
            name: "a",
          },
        },
      ])
    );
  });

  it("should parse a postfix update expression correctly", () => {
    const parser = new Parser(`
      a++
    `);
    const ast = parser.parse();
    expect(ast).toEqual(
      astFactory([
        {
          type: "UpdateExpression",
          operator: "++",
          prefix: false,
          argument: {
            type: "Identifier",
            name: "a",
          },
        },
      ])
    );
  });

  it("should parse a prefix update expression with a member expression as the arugment correctly", () => {
    const parser = new Parser(`
      ++a.b
    `);
    const ast = parser.parse();
    expect(ast).toEqual(
      astFactory([
        {
          type: "UpdateExpression",
          operator: "++",
          prefix: true,
          argument: {
            type: "MemberExpression",
            object: {
              type: "Identifier",
              name: "a",
            },
            property: {
              type: "Identifier",
              name: "b",
            },
            computed: false,
          },
        },
      ])
    );
  });

  it("should parse a postfix update expression with a member expression as the argument correctly", () => {
    const parser = new Parser(`
      a.b++
    `);
    const ast = parser.parse();
    expect(ast).toEqual(
      astFactory([
        {
          type: "UpdateExpression",
          operator: "++",
          prefix: false,
          argument: {
            type: "MemberExpression",
            object: {
              type: "Identifier",
              name: "a",
            },
            property: {
              type: "Identifier",
              name: "b",
            },
            computed: false,
          },
        },
      ])
    );
  });
});
