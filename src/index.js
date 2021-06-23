import * as parser from "@babel/parser";
import traverse from "@babel/traverse";
import { existsSync, readFileSync } from "fs";
import { resolve, dirname } from "path";

const getAllChunks = (path, cwd) => {
  const staticImports = [];
  const dynamicImports = new Set();
  
  const code = readFileSync(path).toString();
  const ast = parser.parse(code, { sourceType: "module" });
  traverse(ast, {
    ImportDeclaration(path) {
      staticImports.push(path.node.source.value);
    },
    CallExpression(path) {
      if (path.node.callee.type === "Import") {
        dynamicImports.add(path.node.arguments[0].value);
      }
    },
  });

  const chunks = new Set();
  dynamicImports.forEach((chunk) => {
    if (!chunk.endsWith("js")) {
      chunk += ".js";
    }

    const pathToChunk = resolve(cwd, chunk);
    if (!existsSync(pathToChunk)) return;

    chunks.add(pathToChunk);
  });
  dynamicImports.clear();

  const children = [];

  // Traverse children of current path, dynamic imports are not children
  for (const staticImport of staticImports) {
    if (!staticImport.endsWith("js")) {
      staticImport += ".js";
    }

    const pathToStaticImport = resolve(cwd, staticImport);
    const folderPath = dirname(pathToStaticImport);
    if (!existsSync(pathToStaticImport)) continue;

    children.push(
      getAllChunks(pathToStaticImport, folderPath)
    );
  }


  return new Promise((resolve) => {
    Promise.all(children).then((childChunks) => {
      const allChunks = childChunks.reduce((all, curr) => {
        return [...all, ...curr];
      }, chunks);
      resolve(new Set(allChunks));
    });
  });
}

getAllChunks(resolve(__dirname, '../input/code.js'), resolve(__dirname, '../input/')).then((chunks) => {
  console.log(chunks);
});