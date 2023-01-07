import { Parser } from "../src/parser";
import { astFactory } from "../helpers/ast-factory";

describe("boolean literal", () => {
  it("should parse a boolean literal correctly", () => {
    const parser = new Parser(`
      true
    `);
    const ast = parser.parse();
    expect(ast).toEqual(
      astFactory([
        {
          type: "BooleanLiteral",
          value: true,
        },
      ])
    );
  });
});
