const { getAllChunks } = require("../../lib/utils/getAllChunks.js");
const { resolve } = require("path");

const testPath = resolve(__dirname, "../src/code.js");

describe("basic", () => {
  it("should output correct dependency tree", async () => {
    const depTree = await getAllChunks(testPath);
    expect(depTree).toMatchSnapshot({
      children: expect.any(Array),
      chunks: expect.any(Set),
      path: expect.any(String),
    });
  });

  it("should output correct set of chunks", async () => {
    const depTree = await getAllChunks(testPath);
    expect(depTree.path).toBe(testPath);
    expect(depTree.chunks.size).toBe(2);
    expect(depTree.chunks).toMatchInlineSnapshot(
      `
Set {
  "${resolve(__dirname, "../src/folderc/c.js")}",
  "${resolve(__dirname, "../src/folderb/b.js")}",
}
`
    );
  });
});
