import type { Expr } from "./ast";
import { parse } from "./parser";
import { linearCut } from "@/lib/cutting/linear";
import { plateCut } from "@/lib/cutting/plate";

export type Scope = Record<string, unknown>;

const BUILTINS: Record<string, (...args: unknown[]) => unknown> = {
  ceil: (n) => Math.ceil(Number(n)),
  floor: (n) => Math.floor(Number(n)),
  round: (n) => Math.round(Number(n)),
  min: (...xs) => Math.min(...xs.map(Number)),
  max: (...xs) => Math.max(...xs.map(Number)),
  abs: (n) => Math.abs(Number(n)),
  if: (cond, then, otherwise) => (Boolean(cond) ? then : otherwise),
  linearCut: (cuts, stockLengths, kerf) =>
    linearCut(cuts as number[], stockLengths as number[], Number(kerf ?? 3)),
  plateCut: (pieces, sheet, kerf, grain) =>
    plateCut(
      pieces as { width: number; height: number; qty: number }[],
      sheet as { width: number; height: number },
      Number(kerf ?? 3),
      (grain as "with_grain" | "across_grain" | null) ?? null,
    ),
};

function lookup(scope: Scope, name: string): unknown {
  if (name in scope) return scope[name];
  throw new Error(`Unknown identifier: ${name}`);
}

export function evaluate(node: Expr, scope: Scope): unknown {
  switch (node.kind) {
    case "literal":
      return node.value;
    case "identifier":
      return lookup(scope, node.name);
    case "member": {
      const obj = evaluate(node.object, scope);
      if (obj == null) return undefined;
      const value = (obj as Record<string, unknown>)[node.property];
      return value;
    }
    case "unary": {
      const v = evaluate(node.arg, scope);
      if (node.op === "-") return -Number(v);
      if (node.op === "!") return !v;
      return undefined;
    }
    case "binary": {
      // short-circuit logical
      if (node.op === "&&") return Boolean(evaluate(node.left, scope)) && Boolean(evaluate(node.right, scope));
      if (node.op === "||") return Boolean(evaluate(node.left, scope)) || Boolean(evaluate(node.right, scope));

      const l = evaluate(node.left, scope);
      const r = evaluate(node.right, scope);
      const ln = Number(l);
      const rn = Number(r);
      switch (node.op) {
        case "+":
          return ln + rn;
        case "-":
          return ln - rn;
        case "*":
          return ln * rn;
        case "/":
          return ln / rn;
        case "%":
          return ln % rn;
        case "**":
          return ln ** rn;
        case "==":
          return l === r;
        case "!=":
          return l !== r;
        case "<":
          return ln < rn;
        case "<=":
          return ln <= rn;
        case ">":
          return ln > rn;
        case ">=":
          return ln >= rn;
      }
      return undefined;
    }
    case "call": {
      const fn = BUILTINS[node.callee];
      if (!fn) throw new Error(`Unknown function: ${node.callee}`);
      const args = node.args.map((a) => evaluate(a, scope));
      return fn(...args);
    }
  }
}

export function evaluateExpression(source: string, scope: Scope) {
  const ast = parse(source);
  return evaluate(ast, scope);
}
