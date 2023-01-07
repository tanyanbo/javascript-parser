import { Parser } from "./parser";

const str = `
let x = 10;
function loop() {
  for (let i = 0; i< 10; i += 1) {
    x += 1
    console.log(x)
  }
}

if (1 + 1 === 2)
  loop();
  `;

const parser = new Parser(str);
const ast = parser.parse();
console.log(JSON.stringify(ast, null, 2));
