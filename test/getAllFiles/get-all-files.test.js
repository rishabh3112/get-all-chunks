const { resolve, relative } = require("path");
const { getAllFiles } = require("../../lib/utils/getAllFiles.js");

const testPath = resolve(__dirname, "../src/");

describe("getAllFiles", () => {
  it("should list all files", async () => {
    let files = await getAllFiles(testPath);
    files = files.map((file) => {
        return relative(testPath, file);
    });
    expect(files).toMatchInlineSnapshot(`
Array [
  "apple.js",
  "code.js",
  "folderb/b.js",
  "folderc/c.js",
]
`);
  });

  it("should ignore node_modules", async () => {
    const files = await getAllFiles(testPath);
    files.forEach(file => {
      expect(file).not.toContain('node_modules');
    });
  })
});
