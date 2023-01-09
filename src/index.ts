import { Parser } from "./parser";

const str = `
      class Person {
        #age
        static name
        async #greet() {}
      }
  `;

const parser = new Parser(str);
const ast = parser.parse();
const res = JSON.stringify(ast, null, 2);

console.log(res);
