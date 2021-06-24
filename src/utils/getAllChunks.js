import * as parser from "@babel/parser";
import traverse from "@babel/traverse";
import { existsSync, readFileSync } from "fs";
import { resolve, dirname } from "path";

let store = {};
const extensions = [".js", ".ts", ".tsx"];

export const clearStore = () => {
  store = {};
};

export const getAllChunks = (path) => {

  if (store[path] === null) {
    return Promise.resolve({
      path,
      children: [],
      chunks: new Set(),
      isCyclic: true,
    });
  }

  if (store[path] !== undefined) {
    return Promise.resolve(store[path]);
  }

  store[path] = null;

  const cwd = dirname(path);
  const staticImports = [];
  const dynamicImports = new Set();

  const code = readFileSync(path).toString();
  const ast = parser.parse(code, {
    sourceType: "module",
    plugins: ["jsx", "typescript", "classProperties", "exportDefaultFrom"],
  });

  traverse(ast, {
    ImportDeclaration(path) {
      staticImports.push(path.node.source.value);
    },
    CallExpression(path) {
      if (path.node.callee.type === "Import") {
        dynamicImports.add(path.node.arguments[0].value);
      }
    },
    ExportNamedDeclaration(path) {
      if (!!path.node.source) {
        staticImports.push(path.node.source.value);
      }
    },
    ExportAllDeclaration(path) {
      if (!!path.node.source) {
        staticImports.push(path.node.source.value);
      }
    },
  });

  const chunks = new Set();
  dynamicImports.forEach((chunk) => {
    let chunkPath = chunk;
    for (const extension of extensions) {
      if (!chunkPath.endsWith(extension)) {
        chunkPath += extension;
      }

      const pathToChunk = resolve(cwd, chunkPath);
      if (!existsSync(pathToChunk)) {
        chunkPath = chunk;
        continue;
      }

      chunks.add(pathToChunk);
    }
  });
  dynamicImports.clear();

  const children = [];

  // Traverse children of current path, dynamic imports are not children
  for (const staticImport of staticImports) {
    let staticImportPath = staticImport;
    for (const extension of extensions) {
      if (!staticImportPath.endsWith(extension)) {
        staticImportPath += extension;
      }

      const pathToStaticImport = resolve(cwd, staticImportPath);
      if (!existsSync(pathToStaticImport)) {
        staticImportPath = staticImport;
        continue;
      }

      children.push(getAllChunks(pathToStaticImport));
    }
  }

  return new Promise((resolve) => {
    Promise.all(children).then((childChunks) => {
      const allChunks = childChunks.reduce((all, curr) => {
        return [...all, ...curr.chunks];
      }, chunks);

      store[path] = {
        path,
        chunks: new Set(allChunks),
        children: childChunks,
      };

      resolve(store[path]);
    });
  });
};
