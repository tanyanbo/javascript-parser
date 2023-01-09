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
  | "=>"
  | "function"
  | "function*"
  | "yield"
  | "async"
  | "await"
  | "return"
  | "if"
  | "for"
  | "while"
  | "SquareBrackets"
  | "UnaryOperator"
  | "AdditiveOperator"
  | "MultiplicativeOperator"
  | "PowerOperator"
  | "AssignmentOperator"
  | "ComparisonOperator"
  | "EqualityOperator"
  | "ComplexAssignmentOperator"
  | "Identifier"
  | "VariableDeclaration"
  | "boolean"
  | null;

export interface Token {
  type: TokenType;
  value: string;
}

export type ASTNodeType =
  | "NumericLiteral"
  | "StringLiteral"
  | "BooleanLiteral"
  | "BlockStatement"
  | "ForStatement"
  | "WhileStatement"
  | "ReturnStatement"
  | "BinaryExpression"
  | "UnaryExpression"
  | "ParenthesizedExpression"
  | "AssignmentExpression"
  | "ComplexAssignmentExpression"
  | "MemberExpression"
  | "AwaitExpression"
  | "YieldExpression"
  | "SequenceExpression"
  | "ArrowFunctionExpression"
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
  | "!"
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
  | "!=="
  | "=>";

export interface ASTNode {
  type: ASTNodeType;
  value?: string | number | boolean | ASTNode;
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
  generator?: boolean;
  async?: boolean;
  arguments?: ASTNode[];
  callee?: ASTNode;
  init?: ASTNode | null;
  test?: ASTNode | null;
  update?: ASTNode | null;
  kind?: "let" | "const";
  argument?: ASTNode;
  expressions?: ASTNode[];
}
