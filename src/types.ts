export type TokenType =
  | "number"
  | "string"
  | "EndOfFile"
  | ";"
  | "{"
  | "}"
  | "("
  | ")"
  | "."
  | ","
  | "function"
  | "return"
  | "if"
  | "for"
  | "while"
  | "SquareBrackets"
  | "AdditiveOperator"
  | "MultiplicativeOperator"
  | "PowerOperator"
  | "AssignmentOperator"
  | "ComparisonOperator"
  | "EqualityOperator"
  | "ComplexAssignmentOperator"
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
  | "ForStatement"
  | "WhileStatement"
  | "BinaryExpression"
  | "ParenthesizedExpression"
  | "AssignmentExpression"
  | "ComplexAssignmentExpression"
  | "MemberExpression"
  | "Identifier"
  | "VariableDeclaration"
  | "FunctionDeclaration"
  | "CallExpression"
  | "IfStatement"
  | "Program";

export type Operator =
  | "+"
  | "-"
  | "*"
  | "/"
  | "**"
  | "="
  | "+="
  | "-="
  | "*="
  | "/="
  | "<"
  | ">"
  | "<="
  | ">="
  | "=="
  | "!="
  | "==="
  | "!==";

export interface ASTNode {
  type: ASTNodeType;
  value?: string | number | ASTNode;
  body?: (ASTNode | null)[] | ASTNode;
  operator?: Operator;
  left?: ASTNode;
  right?: ASTNode;
  name?: string;
  id?: ASTNode;
  object?: ASTNode;
  property?: ASTNode;
  condition?: ASTNode;
  params?: ASTNode[];
  arguments?: ASTNode[];
  callee?: ASTNode;
  init?: ASTNode;
  test?: ASTNode;
  update?: ASTNode;
}
