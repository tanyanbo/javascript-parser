import { Parser } from "./parser";

// const str = `
//   88
//   'test'         ;
//   {
//   20
//   }
//   {
//     'abc';
//     {
//       20
//       30
//       40
//     }
//   }
//   `;

const str = `
  const x = a.b + 30 * b.c + d
`;

const parser = new Parser(str);
const ast = parser.parse();
console.log(JSON.stringify(ast, null, 2));
