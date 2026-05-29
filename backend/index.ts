import "dotenv/config"
import express from "express"
import cors from "cors"
import { Pool } from "pg"
import { clerkMiddleware } from '@clerk/express'
import { drizzle } from 'drizzle-orm/node-postgres';

//npx nodemon --exec ts-node index.ts

const pool = new Pool({ connectionString: process.env.DATABASE_URL})
const db = drizzle(process.env.DATABASE_URL!);
const app = express()


app.use(express.json())
app.use(cors())
app.use(clerkMiddleware())

app.delete("/data/:id", async (req, res) => {
    await pool.query("DELETE FROM tasks WHERE id = $1", [req.params.id])
    res.json({message: "Deleted"})
})

app.post("/webhooks/clerk", express.raw({type: "application/json"}), async(req, res) => {
    console.log(req.body)
    res.json({message: "Clerk info received!"})
})

app.post("/data", async (req, res) => {
    await pool.query("INSERT into tasks(content, completed) VALUES($1, $2)", [req.body.content, false])
    console.log(req.body)
    res.json([{message: "Task added!"}])
})


app.get("/data", async (req, res) => {
    const result = await pool.query("SELECT * FROM tasks")
    res.json(result.rows)
})



app.listen(3000, () => console.log("Listening on port 3000"))