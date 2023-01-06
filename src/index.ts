import { Parser } from "./parser";

const str = `
let x = 20
x += 30;
function testing(arg1) {
  console.log(arg1);
}
testing(x)
  `;

const parser = new Parser(str);
const ast = parser.parse();
console.log(JSON.stringify(ast, null, 2));
