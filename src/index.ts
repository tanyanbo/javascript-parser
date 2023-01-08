import { Parser } from "./parser";

// function* test(): Generator<number> {
//   const x = yield 1 + 2;
//   console.log(x);
// }
//
// const gen = test();
// console.log(gen.next().value);

const str = `
let x
function* test() {
  x = yield 1 + 2;
  console.log(x);
}
  `;

const parser = new Parser(str);
const ast = parser.parse();
console.log(JSON.stringify(ast, null, 2));
