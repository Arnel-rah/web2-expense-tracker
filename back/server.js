import express from "express"
const app = express();

const port = 3000;


app.get('/', async (_req, res) => {
    res.json({message: "server run"})
})
app.listen(port, () => {
    console.log(`Server run at http://localhost:${port}`);
})

