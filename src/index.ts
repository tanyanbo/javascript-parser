import { Parser } from "./parser";

const str = `
for (;;)
  console.log(i)
  `;

const parser = new Parser(str);
const ast = parser.parse();
console.log(JSON.stringify(ast, null, 2));
