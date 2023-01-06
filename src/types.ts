export type TokenType =
  | "number"
  | "string"
  | "EndOfFile"
  | ";"
  | "{"
  | "}"
  | "."
  | "SquareBrackets"
  | "AdditiveOperator"
  | "MultiplicativeOperator"
  | "PowerOperator"
  | "AssignmentOperator"
  | "Identifier"
  | "VariableDeclaration"
  | null;

export interface Token {
  type: TokenType;
  value: string;
}

export type ASTNodeType =
  | "NumericLiteral"
  | "StringLiteral"
  | "BlockStatement"
  | "BinaryExpression"
  | "AssignmentExpression"
  | "MemberExpression"
  | "Identifier"
  | "VariableDeclaration"
  | "Program";

export type Operator = "+" | "-" | "*" | "/" | "**";

export interface ASTNode {
  type: ASTNodeType;
  value?: string | number | ASTNode;
  body?: (ASTNode | null)[];
  operator?: Operator;
  left?: ASTNode;
  right?: ASTNode;
  name?: string;
  id?: ASTNode;
  object?: ASTNode;
  property?: ASTNode;
}
