import { Parser } from "./parser";

const str = `
test() = 20
  `;

const parser = new Parser(str);
const ast = parser.parse();
console.log(JSON.stringify(ast, null, 2));
