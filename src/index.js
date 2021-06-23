import * as parser from "@babel/parser";
import traverse from "@babel/traverse";
import { readFileSync } from "fs";
import { resolve } from "path";

const code = readFileSync(resolve(__dirname, "../input/code.txt")).toString();
const staticImport = [];
const dynamicImport = [];

const ast = parser.parse(code, { sourceType: "module" });

traverse(ast, {
  ImportDeclaration(path) {
    staticImport.push(path.node.source.value);
  },
  CallExpression(path) {
    if (path.node.callee.type === "Import") {
      dynamicImport.push(path.node.arguments[0].value);
    }
  },
});

console.log(staticImport);
console.log(dynamicImport);
