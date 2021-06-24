import express from "express";
import { getAllFiles } from "./utils/getAllFiles";
import { getAllChunks } from "./utils/getAllChunks";

const app = express();

app.use(express.json());

app.post('/chunks', async (req, res) => {
    const body = req.body;
    const tree = await getAllChunks(body.path);
    const response = JSON.stringify({
        tree,
        chunks: tree.chunks,
    }, (_, value) => {
        // Stringify Set
        if (typeof value === 'object' && value instanceof Set) {
            return [...value];
        }
        return value;        
    });
    res.json(JSON.parse(response));
});

app.get('/files', async (req, res) => {
    const files = await getAllFiles();
    res.send({
        cwd: process.cwd(),
        files,
    });
});

app.listen(3000, () => {
    console.log(`http://localhost:3000/files`);
});
