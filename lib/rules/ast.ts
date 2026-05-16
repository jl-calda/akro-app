export type Literal = { kind: "literal"; value: number | boolean | string };
export type Identifier = { kind: "identifier"; name: string };
export type Member = { kind: "member"; object: Expr; property: string };
export type Unary = { kind: "unary"; op: "-" | "!"; arg: Expr };
export type Binary = {
  kind: "binary";
  op: "+" | "-" | "*" | "/" | "%" | "**" | "==" | "!=" | "<" | "<=" | ">" | ">=" | "&&" | "||";
  left: Expr;
  right: Expr;
};
export type Call = { kind: "call"; callee: string; args: Expr[] };

export type Expr = Literal | Identifier | Member | Unary | Binary | Call;
