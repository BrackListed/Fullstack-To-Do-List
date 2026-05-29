import "dotenv/config"
import express from "express"
import cors from "cors"
import { Pool } from "pg"
import { clerkMiddleware, getAuth } from '@clerk/express'
import { drizzle } from 'drizzle-orm/node-postgres';
import { verifyWebhook } from '@clerk/express/webhooks'

//npx nodemon --exec ts-node index.ts

const pool = new Pool({ connectionString: process.env.DATABASE_URL})
const db = drizzle(process.env.DATABASE_URL!);
const app = express()


app.use(express.json())
app.use(cors())
app.use(clerkMiddleware())


app.post('/webhooks/clerk', express.raw({ type: 'application/json' }), async (req, res) => {
    try {
        const evt = await verifyWebhook(req)
        const { id } = evt.data
        const eventType = evt.type
        console.log(`Received webhook with ID ${id} and event type of ${eventType}`)
        console.log('Webhook payload:', evt.data)
        if(evt.type === "user.created"){
            const {id, email_addresses, first_name} = evt.data
            await pool.query("INSERT INTO users(clerkUserId, email, username) VALUES($1, $2, $3)", [id, email_addresses[0]?.email_address ?? "", first_name])
        }
        return res.send('Webhook received')
    } catch (err) {
        console.error('Error verifying webhook:', err)
        return res.status(400).send('Error verifying webhook')
    }
})

app.delete("/data/:id", async (req, res) => {
    await pool.query("DELETE FROM tasks WHERE id = $1", [req.params.id])
    res.json({message: "Deleted"})
})

app.post("/webhooks/clerk", express.raw({type: "application/json"}), async(req, res) => {
    console.log(req.body)
    res.json({message: "Clerk info received!"})
})

app.post("/data", async (req, res) => {
    console.log(getAuth(req))
    await pool.query("INSERT into tasks(content, completed) VALUES($1, $2)", [req.body.content, false])
    console.log(req.body)
    res.json([{message: "Task added!"}])
})


app.get("/data", async (req, res) => {
    const result = await pool.query("SELECT * FROM tasks")
    res.json(result.rows)
})



app.listen(3000, () => console.log("Listening on port 3000"))