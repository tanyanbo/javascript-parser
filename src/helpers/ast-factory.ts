import { ASTNode } from "../types";

export function astFactory(body: (ASTNode | null)[]): ASTNode {
  return {
    type: "Program",
    body,
  };
}
