import { Parser } from "./parser";

const str = `

/**
 * Adds the key-value \`pair\` to \`map\`.
 *
 * @private
 * @param {Object} map The map to modify.
 * @param {Array} pair The key-value pair to add.
 * @returns {Object} Returns \`map\`.
 */
function addMapEntry(map, pair) {
  // dont return \`map.set\`because
  map.set(pair[0], pair[1])
  return map
}
`;

// const str = `
// class Tokenizer {
//   #string = "";
//   #cursor = 0;
//   constructor(str) {
//     this.#string = str;
//   }
//
//   isEndOfFile() {
//     return this.#cursor >= this.#string.length;
//   }
//
//   getNextToken() {
//     this.#string = this.#string.slice(this.#cursor);
//
//     let idx = 0;
//     while (idx < tokenTypes.length) {
//       const tokenType = tokenTypes[idx];
//       const result = tokenType[0].exec(this.#string);
//       if (result?.index === 0) {
//         // @ts-ignore
//         this.#cursor = result.indices[0][1];
//
//         if (tokenType[1] == null) {
//           this.#string = this.#string.slice(this.#cursor);
//           idx = 0;
//           continue;
//         }
//
//         return {
//           type: tokenType[1],
//           value: result[0],
//         };
//       }
//
//       idx++;
//     }
//
//     if (this.isEndOfFile()) {
//       return {
//         type: "EndOfFile",
//         value: "",
//       };
//     }
//
//     throw new SyntaxError("Unsupported token this.#string[0]");
//   }
// }
//   `;

const parser = new Parser(str);
const ast = parser.parse();
const res = JSON.stringify(ast, null, 2);

console.log(res);
