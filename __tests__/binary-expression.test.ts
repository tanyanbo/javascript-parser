describe("binary expression", () => {
  it("should parse binary expression with plus operator correctly", () => {
    expect(`
      2 + 5
    `).toHaveAst([
      {
        type: "BinaryExpression",
        left: {
          type: "NumericLiteral",
          value: 2,
        },
        operator: "+",
        right: {
          type: "NumericLiteral",
          value: 5,
        },
      },
    ]);
  });

  it("should parse binary expression with multiply operator correctly", () => {
    expect(`
      2 * 5
    `).toHaveAst([
      {
        type: "BinaryExpression",
        left: {
          type: "NumericLiteral",
          value: 2,
        },
        operator: "*",
        right: {
          type: "NumericLiteral",
          value: 5,
        },
      },
    ]);
  });

  it("should parse binary expression with plus and multiply operator correctly", () => {
    expect(`
      3 + 2 * 5
    `).toHaveAst([
      {
        type: "BinaryExpression",
        left: {
          type: "NumericLiteral",
          value: 3,
        },
        operator: "+",
        right: {
          type: "BinaryExpression",
          operator: "*",
          left: {
            type: "NumericLiteral",
            value: 2,
          },
          right: {
            type: "NumericLiteral",
            value: 5,
          },
        },
      },
    ]);
  });

  it("should parse binary expression with multiple plus and multiply operators correctly", () => {
    expect(`
      3 + 3 * 2 * 5
    `).toHaveAst([
      {
        type: "BinaryExpression",
        left: {
          type: "NumericLiteral",
          value: 3,
        },
        operator: "+",
        right: {
          type: "BinaryExpression",
          left: {
            type: "BinaryExpression",
            left: {
              type: "NumericLiteral",
              value: 3,
            },
            operator: "*",
            right: {
              type: "NumericLiteral",
              value: 2,
            },
          },
          operator: "*",
          right: {
            type: "NumericLiteral",
            value: 5,
          },
        },
      },
    ]);
  });

  it("should parse binary expression with plus, multiply and power operators correctly", () => {
    expect(`
      3 + 3 * 2 ** 5
    `).toHaveAst([
      {
        type: "BinaryExpression",
        left: {
          type: "NumericLiteral",
          value: 3,
        },
        operator: "+",
        right: {
          type: "BinaryExpression",
          left: {
            type: "NumericLiteral",
            value: 3,
          },
          operator: "*",
          right: {
            type: "BinaryExpression",
            left: {
              type: "NumericLiteral",
              value: 2,
            },
            operator: "**",
            right: {
              type: "NumericLiteral",
              value: 5,
            },
          },
        },
      },
    ]);
  });

  it("should parse binary expression with equality operator correctly", () => {
    expect(`
      1 + 1 == 2
    `).toHaveAst([
      {
        type: "BinaryExpression",
        left: {
          type: "BinaryExpression",
          left: {
            type: "NumericLiteral",
            value: 1,
          },
          operator: "+",
          right: {
            type: "NumericLiteral",
            value: 1,
          },
        },
        operator: "==",
        right: {
          type: "NumericLiteral",
          value: 2,
        },
      },
    ]);
  });

  it("should parse binary expression with strict equality operator correctly", () => {
    expect(`
      1 + 1 === 2
    `).toHaveAst([
      {
        type: "BinaryExpression",
        left: {
          type: "BinaryExpression",
          left: {
            type: "NumericLiteral",
            value: 1,
          },
          operator: "+",
          right: {
            type: "NumericLiteral",
            value: 1,
          },
        },
        operator: "===",
        right: {
          type: "NumericLiteral",
          value: 2,
        },
      },
    ]);
  });

  it("should parse binary expression with bitwise or operator correctly", () => {
    expect(`
      2 | 5
    `).toHaveAst([
      {
        type: "BinaryExpression",
        left: {
          type: "NumericLiteral",
          value: 2,
        },
        operator: "|",
        right: {
          type: "NumericLiteral",
          value: 5,
        },
      },
    ]);
  });

  it("should parse binary expression with bitwise or, xor and and operators correctly", () => {
    expect(`
      2 | 5 & 10 ^ 5
    `).toHaveAst([
      {
        type: "BinaryExpression",
        left: {
          type: "NumericLiteral",
          value: 2,
        },
        operator: "|",
        right: {
          type: "BinaryExpression",
          left: {
            type: "BinaryExpression",
            left: {
              type: "NumericLiteral",
              value: 5,
            },
            operator: "&",
            right: {
              type: "NumericLiteral",
              value: 10,
            },
          },
          operator: "^",
          right: {
            type: "NumericLiteral",
            value: 5,
          },
        },
      },
    ]);
  });
});
