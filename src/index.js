import * as babel from "@babel/core";
import { readFileSync } from "fs";
import { resolve } from "path";

const code = readFileSync(resolve(__dirname, "../input/code.txt")).toString();
const staticImport = [];
const dynamicImport = [];

babel.transformSync(code, {
  plugins: [() => ({
    visitor: {
      ImportDeclaration(path) {
        staticImport.push(path.node.source.value);
      },
      CallExpression(path) {
        if (path.node.callee.type === "Import") {
          dynamicImport.push(path.node.arguments[0].value);
        }
      }
    }
  })],
});

console.log(staticImport);
console.log(dynamicImport);