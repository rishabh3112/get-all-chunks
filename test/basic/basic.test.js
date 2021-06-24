const { getAllChunks } = require("../../lib/index.js");
const { resolve } = require("path");

const testPath = resolve(__dirname, "./src/code.js");
const folderPath = resolve(__dirname, "./src");

describe("basic", () => {
  it("should output correct chunks", async () => {
    const depTree = await getAllChunks(testPath, folderPath);
    expect(depTree).toMatchSnapshot();
  });
});
