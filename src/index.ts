import { Parser } from "./parser";

const str = `
10 * (2 + 5)
  `;

const parser = new Parser(str);
const ast = parser.parse();
console.log(JSON.stringify(ast, null, 2));
