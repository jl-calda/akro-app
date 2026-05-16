import type { Expr } from "./ast";
import { tokenize, type Token } from "./tokenizer";

/**
 * Recursive-descent parser. Grammar (simplified):
 *   expr     := or
 *   or       := and ( ("||" | "or") and )*
 *   and      := equality ( ("&&" | "and") equality )*
 *   equality := compare ( ("=="|"!=") compare )*
 *   compare  := sum ( ("<"|"<="|">"|">=") sum )*
 *   sum      := product ( ("+"|"-") product )*
 *   product  := power ( ("*"|"/"|"%") power )*
 *   power    := unary ( "**" unary )*
 *   unary    := ("-"|"!"|"not") unary | primary
 *   primary  := literal | "(" expr ")" | call | member
 */
export function parse(src: string): Expr {
  const tokens = tokenize(src);
  let pos = 0;

  function peek(): Token {
    return tokens[pos];
  }
  function eat(): Token {
    return tokens[pos++];
  }
  function eatPunct(p: string): boolean {
    if (peek().kind === "punct" && (peek() as { value: string }).value === p) {
      pos++;
      return true;
    }
    return false;
  }
  function expectPunct(p: string) {
    if (!eatPunct(p)) throw new Error(`Expected '${p}' but got ${JSON.stringify(peek())}`);
  }

  function parseExpr(): Expr {
    return parseOr();
  }
  function parseOr(): Expr {
    let left = parseAnd();
    while (
      (peek().kind === "punct" && (peek() as { value: string }).value === "||") ||
      (peek().kind === "kw" && (peek() as { value: string }).value === "or")
    ) {
      eat();
      const right = parseAnd();
      left = { kind: "binary", op: "||", left, right };
    }
    return left;
  }
  function parseAnd(): Expr {
    let left = parseEq();
    while (
      (peek().kind === "punct" && (peek() as { value: string }).value === "&&") ||
      (peek().kind === "kw" && (peek() as { value: string }).value === "and")
    ) {
      eat();
      const right = parseEq();
      left = { kind: "binary", op: "&&", left, right };
    }
    return left;
  }
  function parseEq(): Expr {
    let left = parseCmp();
    while (peek().kind === "punct" && ["==", "!="].includes((peek() as { value: string }).value)) {
      const op = (eat() as { value: string }).value as "==" | "!=";
      const right = parseCmp();
      left = { kind: "binary", op, left, right };
    }
    return left;
  }
  function parseCmp(): Expr {
    let left = parseSum();
    while (peek().kind === "punct" && ["<", "<=", ">", ">="].includes((peek() as { value: string }).value)) {
      const op = (eat() as { value: string }).value as "<" | "<=" | ">" | ">=";
      const right = parseSum();
      left = { kind: "binary", op, left, right };
    }
    return left;
  }
  function parseSum(): Expr {
    let left = parseProduct();
    while (peek().kind === "punct" && ["+", "-"].includes((peek() as { value: string }).value)) {
      const op = (eat() as { value: string }).value as "+" | "-";
      const right = parseProduct();
      left = { kind: "binary", op, left, right };
    }
    return left;
  }
  function parseProduct(): Expr {
    let left = parsePower();
    while (peek().kind === "punct" && ["*", "/", "%"].includes((peek() as { value: string }).value)) {
      const op = (eat() as { value: string }).value as "*" | "/" | "%";
      const right = parsePower();
      left = { kind: "binary", op, left, right };
    }
    return left;
  }
  function parsePower(): Expr {
    let left = parseUnary();
    while (peek().kind === "punct" && (peek() as { value: string }).value === "**") {
      eat();
      const right = parseUnary();
      left = { kind: "binary", op: "**", left, right };
    }
    return left;
  }
  function parseUnary(): Expr {
    if (peek().kind === "punct" && ((peek() as { value: string }).value === "-" || (peek() as { value: string }).value === "!")) {
      const op = (eat() as { value: string }).value as "-" | "!";
      return { kind: "unary", op, arg: parseUnary() };
    }
    if (peek().kind === "kw" && (peek() as { value: string }).value === "not") {
      eat();
      return { kind: "unary", op: "!", arg: parseUnary() };
    }
    return parsePrimary();
  }
  function parsePrimary(): Expr {
    const tk = peek();
    if (tk.kind === "num") {
      eat();
      return { kind: "literal", value: tk.value };
    }
    if (tk.kind === "str") {
      eat();
      return { kind: "literal", value: tk.value };
    }
    if (tk.kind === "kw" && (tk.value === "true" || tk.value === "false")) {
      eat();
      return { kind: "literal", value: tk.value === "true" };
    }
    if (tk.kind === "punct" && tk.value === "(") {
      eat();
      const e = parseExpr();
      expectPunct(")");
      return e;
    }
    if (tk.kind === "ident") {
      const name = tk.value;
      eat();
      // call?
      if (peek().kind === "punct" && (peek() as { value: string }).value === "(") {
        eat();
        const args: Expr[] = [];
        if (!(peek().kind === "punct" && (peek() as { value: string }).value === ")")) {
          args.push(parseExpr());
          while (peek().kind === "punct" && (peek() as { value: string }).value === ",") {
            eat();
            args.push(parseExpr());
          }
        }
        expectPunct(")");
        return { kind: "call", callee: name, args };
      }
      // member chain
      let node: Expr = { kind: "identifier", name };
      while (peek().kind === "punct" && (peek() as { value: string }).value === ".") {
        eat();
        const propTok = eat();
        if (propTok.kind !== "ident") throw new Error("Expected identifier after '.'");
        node = { kind: "member", object: node, property: propTok.value };
      }
      return node;
    }
    throw new Error(`Unexpected token ${JSON.stringify(tk)}`);
  }

  const expr = parseExpr();
  if (peek().kind !== "eof") throw new Error("Trailing tokens");
  return expr;
}
