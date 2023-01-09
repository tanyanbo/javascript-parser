import { Parser } from "../src/parser";
import { astFactory } from "../helpers/ast-factory";

describe("class", () => {
  it("should parse a class declaration correctly", () => {
    const parser = new Parser(`
      class Person {}
    `);
    const ast = parser.parse();
    expect(ast).toEqual(
      astFactory([
        {
          type: "ClassDeclaration",
          id: {
            type: "Identifier",
            name: "Person",
          },
          body: {
            type: "ClassBody",
            body: [],
          },
        },
      ])
    );
  });

  it("should parse a class which extends another class correctly", () => {
    const parser = new Parser(`
      class Person extends People {}
    `);
    const ast = parser.parse();
    expect(ast).toEqual(
      astFactory([
        {
          type: "ClassDeclaration",
          id: {
            type: "Identifier",
            name: "Person",
          },
          body: {
            type: "ClassBody",
            body: [],
          },
          superClass: {
            type: "Identifier",
            name: "People",
          },
        },
      ])
    );
  });

  it("should parse a class declaration with one class property with an initial value correctly", () => {
    const parser = new Parser(`
      class Person {
        age = 20
      }
    `);
    const ast = parser.parse();
    expect(ast).toEqual(
      astFactory([
        {
          type: "ClassDeclaration",
          id: {
            type: "Identifier",
            name: "Person",
          },
          body: {
            type: "ClassBody",
            body: [
              {
                type: "ClassProperty",
                key: {
                  type: "Identifier",
                  name: "age",
                },
                value: {
                  type: "NumericLiteral",
                  value: 20,
                },
                static: false,
              },
            ],
          },
        },
      ])
    );
  });

  it("should parse a class declaration with one class property without an initial value correctly", () => {
    const parser = new Parser(`
      class Person {
        age 
      }
    `);
    const ast = parser.parse();
    expect(ast).toEqual(
      astFactory([
        {
          type: "ClassDeclaration",
          id: {
            type: "Identifier",
            name: "Person",
          },
          body: {
            type: "ClassBody",
            body: [
              {
                type: "ClassProperty",
                key: {
                  type: "Identifier",
                  name: "age",
                },
                static: false,
              },
            ],
          },
        },
      ])
    );
  });

  it("should parse a class declaration with one private class property correctly", () => {
    const parser = new Parser(`
      class Person {
        #age 
      }
    `);
    const ast = parser.parse();
    expect(ast).toEqual(
      astFactory([
        {
          type: "ClassDeclaration",
          id: {
            type: "Identifier",
            name: "Person",
          },
          body: {
            type: "ClassBody",
            body: [
              {
                type: "ClassPrivateProperty",
                key: {
                  type: "PrivateName",
                  id: {
                    type: "Identifier",
                    name: "age",
                  },
                },
                static: false,
              },
            ],
          },
        },
      ])
    );
  });

  it("should parse a class declaration with one static private class property correctly", () => {
    const parser = new Parser(`
      class Person {
        static #age 
      }
    `);
    const ast = parser.parse();
    expect(ast).toEqual(
      astFactory([
        {
          type: "ClassDeclaration",
          id: {
            type: "Identifier",
            name: "Person",
          },
          body: {
            type: "ClassBody",
            body: [
              {
                type: "ClassPrivateProperty",
                key: {
                  type: "PrivateName",
                  id: {
                    type: "Identifier",
                    name: "age",
                  },
                },
                static: true,
              },
            ],
          },
        },
      ])
    );
  });

  it("should parse multiple class properties correctly", () => {
    const parser = new Parser(`
      class Person {
        static #age;
        name
        #height
      }
    `);
    const ast = parser.parse();
    expect(ast).toEqual(
      astFactory([
        {
          type: "ClassDeclaration",
          id: {
            type: "Identifier",
            name: "Person",
          },
          body: {
            type: "ClassBody",
            body: [
              {
                type: "ClassPrivateProperty",
                key: {
                  type: "PrivateName",
                  id: {
                    type: "Identifier",
                    name: "age",
                  },
                },
                static: true,
              },
              {
                type: "ClassProperty",
                key: {
                  type: "Identifier",
                  name: "name",
                },
                static: false,
              },
              {
                type: "ClassPrivateProperty",
                key: {
                  type: "PrivateName",
                  id: {
                    type: "Identifier",
                    name: "height",
                  },
                },
                static: false,
              },
            ],
          },
        },
      ])
    );
  });

  it("should parse constructor correctly", () => {
    const parser = new Parser(`
      class Person {
        constructor() {}
      }
    `);
    const ast = parser.parse();
    expect(ast).toEqual(
      astFactory([
        {
          type: "ClassDeclaration",
          id: {
            type: "Identifier",
            name: "Person",
          },
          body: {
            type: "ClassBody",
            body: [
              {
                type: "ClassMethodDefinition",
                key: {
                  type: "Identifier",
                  name: "constructor",
                },
                static: false,
                kind: "constructor",
                value: {
                  type: "FunctionExpression",
                  generator: false,
                  async: false,
                  params: [],
                  body: {
                    type: "BlockStatement",
                    body: [],
                  },
                },
              },
            ],
          },
        },
      ])
    );
  });

  it("should parse method correctly", () => {
    const parser = new Parser(`
      class Person {
        greet() {}
      }
    `);
    const ast = parser.parse();
    expect(ast).toEqual(
      astFactory([
        {
          type: "ClassDeclaration",
          id: {
            type: "Identifier",
            name: "Person",
          },
          body: {
            type: "ClassBody",
            body: [
              {
                type: "ClassMethodDefinition",
                key: {
                  type: "Identifier",
                  name: "greet",
                },
                static: false,
                kind: "method",
                value: {
                  type: "FunctionExpression",
                  generator: false,
                  async: false,
                  params: [],
                  body: {
                    type: "BlockStatement",
                    body: [],
                  },
                },
              },
            ],
          },
        },
      ])
    );
  });

  it("should parse async method correctly", () => {
    const parser = new Parser(`
      class Person {
        async greet() {}
      }
    `);
    const ast = parser.parse();
    expect(ast).toEqual(
      astFactory([
        {
          type: "ClassDeclaration",
          id: {
            type: "Identifier",
            name: "Person",
          },
          body: {
            type: "ClassBody",
            body: [
              {
                type: "ClassMethodDefinition",
                key: {
                  type: "Identifier",
                  name: "greet",
                },
                static: false,
                kind: "method",
                value: {
                  type: "FunctionExpression",
                  generator: false,
                  async: true,
                  params: [],
                  body: {
                    type: "BlockStatement",
                    body: [],
                  },
                },
              },
            ],
          },
        },
      ])
    );
  });

  it("should parse static async method correctly", () => {
    const parser = new Parser(`
      class Person {
        static async greet() {}
      }
    `);
    const ast = parser.parse();
    expect(ast).toEqual(
      astFactory([
        {
          type: "ClassDeclaration",
          id: {
            type: "Identifier",
            name: "Person",
          },
          body: {
            type: "ClassBody",
            body: [
              {
                type: "ClassMethodDefinition",
                key: {
                  type: "Identifier",
                  name: "greet",
                },
                static: true,
                kind: "method",
                value: {
                  type: "FunctionExpression",
                  generator: false,
                  async: true,
                  params: [],
                  body: {
                    type: "BlockStatement",
                    body: [],
                  },
                },
              },
            ],
          },
        },
      ])
    );
  });

  it("should parse private async method correctly", () => {
    const parser = new Parser(`
      class Person {
        async #greet() {}
      }
    `);
    const ast = parser.parse();
    expect(ast).toEqual(
      astFactory([
        {
          type: "ClassDeclaration",
          id: {
            type: "Identifier",
            name: "Person",
          },
          body: {
            type: "ClassBody",
            body: [
              {
                type: "ClassMethodDefinition",
                key: {
                  type: "PrivateName",
                  id: {
                    type: "Identifier",
                    name: "greet",
                  },
                },
                static: false,
                kind: "method",
                value: {
                  type: "FunctionExpression",
                  generator: false,
                  async: true,
                  params: [],
                  body: {
                    type: "BlockStatement",
                    body: [],
                  },
                },
              },
            ],
          },
        },
      ])
    );
  });

  it("should parse static private async method correctly", () => {
    const parser = new Parser(`
      class Person {
        static async #greet() {}
      }
    `);
    const ast = parser.parse();
    expect(ast).toEqual(
      astFactory([
        {
          type: "ClassDeclaration",
          id: {
            type: "Identifier",
            name: "Person",
          },
          body: {
            type: "ClassBody",
            body: [
              {
                type: "ClassMethodDefinition",
                key: {
                  type: "PrivateName",
                  id: {
                    type: "Identifier",
                    name: "greet",
                  },
                },
                static: true,
                kind: "method",
                value: {
                  type: "FunctionExpression",
                  generator: false,
                  async: true,
                  params: [],
                  body: {
                    type: "BlockStatement",
                    body: [],
                  },
                },
              },
            ],
          },
        },
      ])
    );
  });

  it("should parse async method with properties correctly", () => {
    const parser = new Parser(`
      class Person {
        #age
        name
        async #greet() {}
      }
    `);
    const ast = parser.parse();
    expect(ast).toEqual(
      astFactory([
        {
          type: "ClassDeclaration",
          id: {
            type: "Identifier",
            name: "Person",
          },
          body: {
            type: "ClassBody",
            body: [
              {
                type: "ClassPrivateProperty",
                key: {
                  type: "PrivateName",
                  id: {
                    type: "Identifier",
                    name: "age",
                  },
                },
                static: false,
              },
              {
                type: "ClassProperty",
                key: {
                  type: "Identifier",
                  name: "name",
                },
                static: false,
              },
              {
                type: "ClassMethodDefinition",
                key: {
                  type: "PrivateName",
                  id: {
                    type: "Identifier",
                    name: "greet",
                  },
                },
                static: false,
                kind: "method",
                value: {
                  type: "FunctionExpression",
                  generator: false,
                  async: true,
                  params: [],
                  body: {
                    type: "BlockStatement",
                    body: [],
                  },
                },
              },
            ],
          },
        },
      ])
    );
  });

  it("should parse a new expression without arguments correctly", () => {
    const parser = new Parser(`
      const p = new Person()
    `);
    const ast = parser.parse();
    expect(ast).toEqual(
      astFactory([
        {
          type: "VariableDeclaration",
          id: {
            type: "Identifier",
            name: "p",
          },
          value: {
            type: "NewExpression",
            callee: {
              type: "Identifier",
              name: "Person",
            },
            arguments: [],
          },
          kind: "const",
        },
      ])
    );
  });

  it("should parse a new expression with member expression without arguments correctly", () => {
    const parser = new Parser(`
      const p = new Person.Student()
    `);
    const ast = parser.parse();
    expect(ast).toEqual(
      astFactory([
        {
          type: "VariableDeclaration",
          id: {
            type: "Identifier",
            name: "p",
          },
          value: {
            type: "NewExpression",
            callee: {
              type: "MemberExpression",
              object: {
                type: "Identifier",
                name: "Person",
              },
              property: {
                type: "Identifier",
                name: "Student",
              },
              computed: false,
            },
            arguments: [],
          },
          kind: "const",
        },
      ])
    );
  });

  it("should parse a new expression with multiple arguments correctly", () => {
    const parser = new Parser(`
      const p = new Person.Student(a, 1)
    `);
    const ast = parser.parse();
    expect(ast).toEqual(
      astFactory([
        {
          type: "VariableDeclaration",
          id: {
            type: "Identifier",
            name: "p",
          },
          value: {
            type: "NewExpression",
            callee: {
              type: "MemberExpression",
              object: {
                type: "Identifier",
                name: "Person",
              },
              property: {
                type: "Identifier",
                name: "Student",
              },
              computed: false,
            },
            arguments: [
              {
                type: "Identifier",
                name: "a",
              },
              {
                type: "NumericLiteral",
                value: 1,
              },
            ],
          },
          kind: "const",
        },
      ])
    );
  });

  it("should parse calling a private method correctly", () => {
    const parser = new Parser(`
      this.#test()
    `);
    const ast = parser.parse();
    expect(ast).toEqual(
      astFactory([
        {
          type: "CallExpression",
          callee: {
            type: "MemberExpression",
            object: {
              type: "ThisExpression",
            },
            property: {
              type: "PrivateName",
              id: {
                type: "Identifier",
                name: "test",
              },
            },
            computed: false,
          },
          arguments: [],
        },
      ])
    );
  });
});
