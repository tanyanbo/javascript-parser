import { Parser } from "../src/parser";
import { astFactory } from "../src/helpers/ast-factory";

describe("optional expression", () => {
  it("should parse a non computed optional member expression correctly", () => {
    const parser = new Parser(`
      obj?.a
    `);
    const ast = parser.parse();
    expect(ast).toEqual(
      astFactory([
        {
          type: "OptionalMemberExpression",
          object: {
            type: "Identifier",
            name: "obj",
          },
          property: {
            type: "Identifier",
            name: "a",
          },
          computed: false,
          optional: true,
        },
      ])
    );
  });

  it("should parse a chained optional member expression correctly", () => {
    const parser = new Parser(`
      obj?.a?.b
    `);
    const ast = parser.parse();
    expect(ast).toEqual(
      astFactory([
        {
          type: "OptionalMemberExpression",
          object: {
            type: "OptionalMemberExpression",
            object: {
              type: "Identifier",
              name: "obj",
            },
            property: {
              type: "Identifier",
              name: "a",
            },
            computed: false,
            optional: true,
          },
          property: {
            type: "Identifier",
            name: "b",
          },
          computed: false,
          optional: true,
        },
      ])
    );
  });

  it("should parse an optional computed member expression correctly", () => {
    const parser = new Parser(`
      obj?.[1]
    `);
    const ast = parser.parse();
    expect(ast).toEqual(
      astFactory([
        {
          type: "OptionalMemberExpression",
          object: {
            type: "Identifier",
            name: "obj",
          },
          property: {
            type: "NumericLiteral",
            value: 1,
          },
          computed: true,
          optional: true,
        },
      ])
    );
  });

  it("should parse an optional call expression correctly", () => {
    const parser = new Parser(`
      obj?.(1)
    `);
    const ast = parser.parse();
    expect(ast).toEqual(
      astFactory([
        {
          type: "OptionalCallExpression",
          callee: {
            type: "Identifier",
            name: "obj",
          },
          arguments: [
            {
              type: "NumericLiteral",
              value: 1,
            },
          ],
          optional: true,
        },
      ])
    );
  });

  it("should parse a optional call expression as object in member expression correctly", () => {
    const parser = new Parser(`
      obj?.(1).p(10)
    `);
    const ast = parser.parse();
    expect(ast).toEqual(
      astFactory([
        {
          type: "CallExpression",
          callee: {
            type: "MemberExpression",
            object: {
              type: "OptionalCallExpression",
              callee: {
                type: "Identifier",
                name: "obj",
              },
              arguments: [
                {
                  type: "NumericLiteral",
                  value: 1,
                },
              ],
              optional: true,
            },
            property: {
              type: "Identifier",
              name: "p",
            },
            computed: false,
          },
          arguments: [
            {
              type: "NumericLiteral",
              value: 10,
            },
          ],
        },
      ])
    );
  });
});
