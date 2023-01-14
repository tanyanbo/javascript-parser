import { Parser } from "../src/parser";
import { astFactory } from "../helpers/ast-factory";

describe("template literal", () => {
  it("should parse template literal without expressions correctly", () => {
    const parser = new Parser("`testing`");
    const ast = parser.parse();
    expect(ast).toEqual(
      astFactory([
        {
          type: "TemplateLiteral",
          expressions: [],
          quasis: [
            {
              type: "TemplateElement",
              value: "testing",
            },
          ],
        },
      ])
    );
  });

  it("should parse a template literal with one expression correctly", () => {
    const parser = new Parser("`test${a}test`");
    const ast = parser.parse();
    expect(ast).toEqual(
      astFactory([
        {
          type: "TemplateLiteral",
          expressions: [
            {
              type: "Identifier",
              name: "a",
            },
          ],
          quasis: [
            {
              type: "TemplateElement",
              value: "test",
            },
            {
              type: "TemplateElement",
              value: "test",
            },
          ],
        },
      ])
    );
  });

  it("should parse a template literal in an expression correctly", () => {
    const parser = new Parser("`test${a}test` + 'qqq'");
    const ast = parser.parse();
    expect(ast).toEqual(
      astFactory([
        {
          type: "BinaryExpression",
          left: {
            type: "TemplateLiteral",
            expressions: [
              {
                type: "Identifier",
                name: "a",
              },
            ],
            quasis: [
              {
                type: "TemplateElement",
                value: "test",
              },
              {
                type: "TemplateElement",
                value: "test",
              },
            ],
          },
          operator: "+",
          right: {
            type: "StringLiteral",
            value: "qqq",
          },
        },
      ])
    );
  });
});
