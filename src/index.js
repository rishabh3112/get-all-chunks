import express from "express";
import { getAllFiles } from "./utils/getAllFiles";

const app = express();

app.use(express.json());

app.post('/chunks', (req, res) => {
    // TODO
});

app.get('/files', (req, res) => {
    const files = getAllFiles();
    res.send({
        cwd: process.cwd(),
        files,
    });
});

app.listen(3000, () => {
    console.log(`http://localhost:3000/files`);
});
