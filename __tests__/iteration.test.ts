import { Parser } from "../src/parser";
import { astFactory } from "../helpers/ast-factory";

describe.skip("iteration", () => {
  it("should parse a for loop correctly", () => {
    const parser = new Parser(`
      for (let i=0; i<10; i++) {
        console.log(i);
      }
    `);
    const ast = parser.parse();
    expect(ast).toEqual(
      astFactory([
        {
          type: "ForStatement",
          init: {
            type: "Identifier",
            name: "test",
          },
          arguments: [],
        },
      ])
    );
  });
});
