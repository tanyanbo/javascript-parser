describe("array literal", () => {
  it("should parse an array literal with no elements correctly", () => {
    expect(`
      const x = []
    `).toHaveAst([
      {
        type: "VariableDeclaration",
        id: {
          type: "Identifier",
          name: "x",
        },
        value: {
          type: "ArrayLiteral",
          elements: [],
        },
        kind: "const",
      },
    ]);
  });

  it("should parse an array literal with one element correctly", () => {
    expect(`
      const x = [1]
    `).toHaveAst([
      {
        type: "VariableDeclaration",
        id: {
          type: "Identifier",
          name: "x",
        },
        value: {
          type: "ArrayLiteral",
          elements: [
            {
              type: "NumericLiteral",
              value: 1,
            },
          ],
        },
        kind: "const",
      },
    ]);
  });

  it("should parse an array literal with multiple elements correctly", () => {
    expect(`
      const x = [1, test() + 3]
    `).toHaveAst([
      {
        type: "VariableDeclaration",
        id: {
          type: "Identifier",
          name: "x",
        },
        value: {
          type: "ArrayLiteral",
          elements: [
            {
              type: "NumericLiteral",
              value: 1,
            },
            {
              type: "BinaryExpression",
              left: {
                type: "CallExpression",
                callee: {
                  type: "Identifier",
                  name: "test",
                },
                arguments: [],
              },
              operator: "+",
              right: {
                type: "NumericLiteral",
                value: 3,
              },
            },
          ],
        },
        kind: "const",
      },
    ]);
  });
});
