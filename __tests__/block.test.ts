import { Parser } from "../src/parser";
import { astFactory } from "../helpers/ast-factory";

describe("block code", () => {
  it("should parse an empty code block correctly", () => {
    const parser = new Parser(`
      {}
    `);
    const ast = parser.parse();
    expect(ast).toEqual(
      astFactory([
        {
          type: "BlockStatement",
          body: [],
        },
      ])
    );
  });

  it("should parse a code block with one line correctly", () => {
    const parser = new Parser(`
      {
        20;
      }
    `);
    const ast = parser.parse();
    expect(ast).toEqual(
      astFactory([
        {
          type: "BlockStatement",
          body: [
            {
              type: "NumericLiteral",
              value: 20,
            },
          ],
        },
      ])
    );
  });

  it("should parse a code block with two lines correctly", () => {
    const parser = new Parser(`
      {
        20;
        "qqq"
      }
    `);
    const ast = parser.parse();
    expect(ast).toEqual(
      astFactory([
        {
          type: "BlockStatement",
          body: [
            {
              type: "NumericLiteral",
              value: 20,
            },
            {
              type: "StringLiteral",
              value: "qqq",
            },
          ],
        },
      ])
    );
  });

  it("should parse nested blocks correctly", () => {});
});
