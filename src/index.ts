import { Parser } from "./parser";

// function* test(): Generator<number> {
//   const x = yield 1 + 2;
//   console.log(x);
// }
//
// const gen = test();
// console.log(gen.next().value);

const str = `

      const fn = () => {}
  `;

const parser = new Parser(str);
const ast = parser.parse();
const res = JSON.stringify(ast, null, 2);

console.log(res);
