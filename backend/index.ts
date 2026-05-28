import express from "express"
import cors from "cors"
//npx nodemon --exec ts-node index.ts


let tasks: any[] = []
const app = express()

app.use(express.json())
app.use(cors())

app.post('/data', (req, res) => {
    tasks.push(req.body)
    res.json(tasks)
})

app.get("/data", (req, res) => {
    res.json(tasks)
})

app.listen(3000, () => console.log("Listening on port 3000"))