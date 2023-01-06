export type TokenType =
  | "number"
  | "string"
  | "EndOfFile"
  | ";"
  | "{"
  | "}"
  | "AdditiveOperator"
  | "MultiplicativeOperator"
  | "PowerOperator"
  | "Identifier"
  | null;

export interface Token {
  type: TokenType;
  value?: any;
}

export type ASTNodeType =
  | "NumericLiteral"
  | "StringLiteral"
  | "BlockStatement"
  | "BinaryExpression"
  | "Identifier"
  | "Program";

export type Operator = "+" | "-" | "*" | "/" | "**";

export interface ASTNode {
  type: ASTNodeType;
  value?: any;
  body?: (ASTNode | null)[];
  operator?: Operator;
  left?: ASTNode;
  right?: ASTNode;
  name?: string;
}
