import express from "express"
import cors from "cors"
//npx nodemon --exec ts-node index.ts

const app = express()

app.use(express.json())
app.use(cors())

app.post('/data', (req, res) => {
    res.json([req.body])
})

app.listen(3000, () => console.log("Listening on port 3000"))