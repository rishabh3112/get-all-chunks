import express from "express";

const app = express();

app.use(express.json());

app.post('/chunks', (req, res) => {
    // TODO
});

app.get('/files', (req, res) => {
    // TODO
});

app.listen(3000, () => {

});
