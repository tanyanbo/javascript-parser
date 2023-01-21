import { ASTNode } from "../src/types";

declare interface CustomMatchers {
  toHaveAst(partialAst: ASTNode[]): void;
}

declare global {
  namespace Vi {
    interface Assertion extends CustomMatchers {}
    interface AsymmetricMatchersContaining extends CustomMatchers {}
  }
}
