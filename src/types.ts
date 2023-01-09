export type TokenType =
  | "number"
  | "string"
  | "EndOfFile"
  | ";"
  | "{"
  | "}"
  | "["
  | "]"
  | "("
  | ")"
  | "."
  | ","
  | ":"
  | "#"
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
  | "class"
  | "extends"
  | "static"
  | null;

export interface Token {
  type: TokenType;
  value: string;
}

export type ASTNodeType =
  | "NumericLiteral"
  | "StringLiteral"
  | "BooleanLiteral"
  | "ArrayLiteral"
  | "ObjectLiteral"
  | "Property"
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
  | "FunctionExpression"
  | "Identifier"
  | "VariableDeclaration"
  | "FunctionDeclaration"
  | "ClassDeclaration"
  | "ClassBody"
  | "ClassProperty"
  | "ClassPrivateProperty"
  | "ClassMethodDefinition"
  | "PrivateName"
  | "AssignmentPattern"
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
  kind?: "let" | "const" | "constructor" | "method";
  argument?: ASTNode;
  expressions?: ASTNode[];
  properties?: ASTNode[];
  key?: ASTNode;
  computed?: boolean;
  method?: boolean;
  elements?: ASTNode[];
  superClass?: ASTNode;
  static?: boolean;
}
