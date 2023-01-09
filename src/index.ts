import { Parser } from "./parser";

const str = `
    for (const x of arr) {
      return x
    }
`;

// const str = `
// export class Tokenizer {
//   string = "";
//   cursor = 0;
//   constructor(str) {
//     this.string = str;
//   }
//
//   isEndOfFile() {
//     return this.cursor >= this.string.length;
//   }
//
//   getNextToken() {
//     this.string = this.string.slice(this.cursor);
//
//     for (const tokenType of tokenTypes) {
//       const result = tokenType[0].exec(this.string);
//       if (result.index === 0) {
//         this.cursor = result.indices[0][1];
//
//         if (tokenType[1] == null) {
//           this.string = this.string.slice(this.cursor);
//           continue;
//         }
//
//         return {
//           type: tokenType[1],
//           value: result[0],
//         };
//       }
//     }
//
//     if (this.isEndOfFile()) {
//       return {
//         type: "EndOfFile",
//         value: "",
//       };
//     }
//
//     new SyntaxError("Unsupported token this.string[0]");
//   }
// }
//   `;

const parser = new Parser(str);
const ast = parser.parse();
const res = JSON.stringify(ast, null, 2);

console.log(res);
