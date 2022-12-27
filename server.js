import express from 'express';
import fs  from 'fs';
import cors from 'cors';

const app = express();

app.use(cors({
    origin: '*',
}));

app.use(express.json())

function writeFile(data) {
    fs.writeFile("file.txt", data, (err) => {
        if (err) throw err;
    });
}

app.get('/', (req, res) => {
    let data = fs.readFileSync('./file.txt', 'utf-8')

    res.end(JSON.stringify(data));
})

app.post('/', async (req, res) => {
    let parsedData = JSON.stringify(req.body);
    await writeFile(parsedData);
    res.status(201).end();
})

const port = 3000;
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})