export type TokenType =
  | "number"
  | "string"
  | "EndOfFile"
  | ";"
  | "{"
  | "}"
  | null;

export interface Token {
  type: TokenType;
  value?: any;
}

export type ASTNodeType =
  | "NumericLiteral"
  | "StringLiteral"
  | "BlockStatement"
  | "Program";

export interface ASTNode {
  type: ASTNodeType;
  value?: any;
  body?: (ASTNode | null)[];
}
