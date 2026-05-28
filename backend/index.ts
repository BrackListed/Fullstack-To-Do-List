import "dotenv/config"
import express from "express"
import cors from "cors"
import { Pool } from "pg"

//npx nodemon --exec ts-node index.ts


const pool = new Pool({ connectionString: process.env.DATABASE_URL})
let tasks: any[] = []
const app = express()


app.use(express.json())
app.use(cors())

// app.post('/data', async (req, res) => {
//     const result = await pool.query("SELECT name FROM tasks")
//     tasks.push(result)
//     res.json(result)
// })

app.get("/data", async (req, res) => {
    const result = await pool.query("SELECT * FROM tasks")
    console.log(result.rows)
    res.json(result.rows)
})



app.listen(3000, () => console.log("Listening on port 3000"))