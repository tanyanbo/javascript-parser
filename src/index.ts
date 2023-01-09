import { Parser } from "./parser";

const str = `
const p = new Person(a, 1)
  `;

const parser = new Parser(str);
const ast = parser.parse();
const res = JSON.stringify(ast, null, 2);

console.log(res);
