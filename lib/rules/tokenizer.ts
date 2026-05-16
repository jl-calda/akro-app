export type Token =
  | { kind: "num"; value: number }
  | { kind: "str"; value: string }
  | { kind: "ident"; value: string }
  | { kind: "punct"; value: string }
  | { kind: "kw"; value: "true" | "false" | "and" | "or" | "not" }
  | { kind: "eof" };

const PUNCT_2 = ["==", "!=", "<=", ">=", "&&", "||", "**"];
const PUNCT_1 = ["+", "-", "*", "/", "%", "(", ")", ",", ".", "<", ">", "!", "?", ":"];

const KEYWORDS = new Set(["true", "false", "and", "or", "not"]);

export function tokenize(src: string): Token[] {
  const out: Token[] = [];
  let i = 0;
  while (i < src.length) {
    const c = src[i];
    if (c === " " || c === "\t" || c === "\n" || c === "\r") {
      i++;
      continue;
    }
    // string
    if (c === "'" || c === '"') {
      const q = c;
      let j = i + 1;
      let s = "";
      while (j < src.length && src[j] !== q) {
        if (src[j] === "\\" && j + 1 < src.length) {
          s += src[j + 1];
          j += 2;
        } else {
          s += src[j];
          j++;
        }
      }
      if (src[j] !== q) throw new Error("Unterminated string");
      out.push({ kind: "str", value: s });
      i = j + 1;
      continue;
    }
    // number
    if ((c >= "0" && c <= "9") || (c === "." && src[i + 1] >= "0" && src[i + 1] <= "9")) {
      let j = i;
      while (j < src.length && ((src[j] >= "0" && src[j] <= "9") || src[j] === ".")) j++;
      out.push({ kind: "num", value: Number(src.slice(i, j)) });
      i = j;
      continue;
    }
    // ident
    if ((c >= "a" && c <= "z") || (c >= "A" && c <= "Z") || c === "_") {
      let j = i;
      while (
        j < src.length &&
        ((src[j] >= "a" && src[j] <= "z") ||
          (src[j] >= "A" && src[j] <= "Z") ||
          (src[j] >= "0" && src[j] <= "9") ||
          src[j] === "_")
      )
        j++;
      const word = src.slice(i, j);
      if (KEYWORDS.has(word)) {
        out.push({ kind: "kw", value: word as "true" | "false" | "and" | "or" | "not" });
      } else {
        out.push({ kind: "ident", value: word });
      }
      i = j;
      continue;
    }
    // 2-char punct
    const two = src.slice(i, i + 2);
    if (PUNCT_2.includes(two)) {
      out.push({ kind: "punct", value: two });
      i += 2;
      continue;
    }
    if (PUNCT_1.includes(c)) {
      out.push({ kind: "punct", value: c });
      i++;
      continue;
    }
    throw new Error(`Unexpected character: ${c} at position ${i}`);
  }
  out.push({ kind: "eof" });
  return out;
}
