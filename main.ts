const fs = require("node:fs");
const path = require("node:path");

const LINE =
  "v2.8.0: Fixed a bug where an arm fell asleep and stopped reporting its position. The arm is now retrieved manually by the other arm.";

const outDir = process.env.MAKEFUN_OUTPUT_DIR || "/output";
const outFile = path.join(outDir, "entry.txt");

const points = [...LINE].length;
if (points < 1 || points > 160) {
  throw new Error(`entry must be 1-160 code points, got ${points}`);
}
if (!LINE.trim()) {
  throw new Error("entry must not be only white space");
}
if (/[\r\n]/.test(LINE)) {
  throw new Error("entry must be a single line");
}
if (/[^\x20-\x7E]/.test(LINE)) {
  throw new Error("entry must be printable ASCII");
}

fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(outFile, LINE, "utf8");

const expected = Buffer.from(LINE, "utf8");
const written = fs.readFileSync(outFile);
if (!written.equals(expected)) {
  throw new Error("entry.txt does not match LINE byte for byte");
}
if (written.length !== expected.length) {
  throw new Error("entry.txt has trailing bytes");
}
if (written.includes(0x0a) || written.includes(0x0d)) {
  throw new Error("entry.txt must not contain a newline");
}

console.log(
  `wrote ${outFile} (${points} code points, ${written.length} bytes, no newline)`
);
