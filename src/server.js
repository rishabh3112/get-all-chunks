import express from "express";
import { getAllFiles } from "./utils/getAllFiles";
import { getAllChunks, clearStore } from "./utils/getAllChunks";

const createApp = (root) => {
  const app = express();

  app.use(express.json());

  app.post("/chunks", async (req, res) => {
    const body = req.body;
    const tree = await getAllChunks(body.path).then((tree) => {
      clearStore();
      return tree;
    });
    const response = JSON.stringify(
      {
        tree,
        chunks: tree.chunks,
      },
      (_, value) => {
        // Stringify Set
        if (typeof value === "object" && value instanceof Set) {
          return [...value];
        }
        return value;
      }
    );
    res.json(JSON.parse(response));
  });

  app.get("/files", async (req, res) => {
    const query = req.query.q || "";
    const files = await getAllFiles(root, query);
    const filesPerPage = 10;
    const pages = {};

    files.forEach((file, index) => {
      const page = parseInt(index / filesPerPage);
      if (pages[page] === undefined) {
        pages[page] = [];
      }
      pages[page].push(file);
    });

    res.send({
      directory: root,
      pages,
    });
  });

  return app;
};

export default createApp;
