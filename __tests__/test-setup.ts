import { ASTNode } from "../src/types";
import { Parser } from "../src/parser";
import { astFactory } from "../src/helpers/ast-factory";
import { expect } from "vitest";
import _ from "lodash";

expect.extend({
  toHaveAst(code: string, partialAst: ASTNode[]) {
    const parser = new Parser(code);
    const receivedAst = parser.parse();
    const expectedAst = astFactory(partialAst);

    if (this.isNot) {
      if (_.isEqual(receivedAst, expectedAst)) {
        return {
          pass: true,
          message: () => "Received the ast in provided",
        };
      } else {
        return {
          pass: false,
          message: () => "",
        };
      }
    }

    if (_.isEqual(receivedAst, expectedAst)) {
      return {
        pass: true,
        message: () => "",
      };
    }

    return {
      pass: false,
      message: () => "Ast does not match the provided ast",
      actual: receivedAst,
      expected: expectedAst,
    };
  },
});
