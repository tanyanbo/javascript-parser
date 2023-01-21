import { Parser } from "../src/parser";
import { astFactory } from "../src/helpers/ast-factory";

describe("comments", () => {
  it("should ignore a single line comment", () => {
    const parser = new Parser(`
      // testing testing
      10
    `);
    const ast = parser.parse();
    expect(ast).toEqual(
      astFactory([
        {
          type: "NumericLiteral",
          value: 10,
        },
      ])
    );
  });

  it("should ignore a multi line comment", () => {
    const parser = new Parser(`
      /*
      aaa     qqq
      */
      a
    `);
    const ast = parser.parse();
    expect(ast).toEqual(
      astFactory([
        {
          type: "Identifier",
          name: "a",
        },
      ])
    );
  });
});
