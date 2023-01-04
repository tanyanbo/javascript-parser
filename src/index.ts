import { Parser } from "./parser";

const str = `
  88 40
  'test'
  
  `;

const parser = new Parser(str);
const ast = parser.parse();
console.log(JSON.stringify(ast, null, 2));
