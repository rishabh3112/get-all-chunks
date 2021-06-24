#!/usr/bin/env node
import createApp from "./server";
import { program as argParser } from "commander";
import { resolve } from "path";
import { cyanBright, greenBright, bold, gray } from "chalk";

const run = () => {
  argParser.option(
    "-r, --root <root>",
    "path to source directory of project",
    "./"
  );
  argParser.parse();

  const args = argParser.opts();
  if (args.root === undefined) {
    args.root = "./";
  }

  const resolvedRoot = resolve(process.cwd(), args.root);

  const app = createApp(resolvedRoot);

  app.listen(3000, () => {
    const baseRoute = "http://localhost:3000";
    console.clear();
    console.log(`\n${bold("Pick Chunks")}\n`);
    console.log(`${greenBright("Root")} : ${resolvedRoot}`);
    console.log(`${greenBright("Routes")} :`);
    console.log(
      ` - ${bold("GET")}  ${cyanBright(`${baseRoute}/files`)} :\n   ${gray(
        "Lists all JS/TS/TSX files in root"
      )}`
    );
    console.log(
      ` - ${bold("POST")} ${cyanBright(`${baseRoute}/chunks`)} :\n   ${gray(
        "Gives list of chunks and dependency tree for given file"
      )}\n`
    );
  });
};

run();
