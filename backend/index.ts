import "dotenv/config"
import express from "express"
import cors from "cors"
import { Pool } from "pg"
import { clerkMiddleware, getAuth } from '@clerk/express'
import { drizzle } from 'drizzle-orm/node-postgres';
import { verifyWebhook } from '@clerk/express/webhooks'

//npx nodemon --exec ts-node index.ts
const app = express()
app.use(cors({origin: "http://localhost:5173", credentials: true}))
app.use(clerkMiddleware())
const pool = new Pool({ connectionString: process.env.DATABASE_URL})
const db = drizzle(process.env.DATABASE_URL!);


app.use(express.json())




app.post('/webhooks/clerk', express.raw({ type: 'application/json' }), async (req, res) => {
    try {
        const evt = await verifyWebhook(req)
        const { id } = evt.data
        const eventType = evt.type
        console.log(`Received webhook with ID ${id} and event type of ${eventType}`)
        console.log('Webhook payload:', evt.data)
        if(evt.type === "user.created"){
            const {id, email_addresses, first_name} = evt.data
            await pool.query("INSERT INTO users(clerk_user_id, email, username) VALUES($1, $2, $3)", [id, email_addresses[0]?.email_address ?? "", first_name])
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


app.post("/data", async (req, res) => {
    const {userId} = (getAuth(req))
    //you're the user, this thing will find your id by checking which clerkuserid you have right now
    const id = await pool.query("SELECT id FROM users WHERE clerk_user_id = $1", [userId])
    console.log(userId)
    console.log(id.rows)
    await pool.query("INSERT into tasks(user_id, content, completed) VALUES($1, $2, $3)", [id.rows[0].id,req.body.content, false])
    console.log(req.body)
    res.json([{message: "Task added!"}])
})


app.get("/data", async (req, res) => {
    const {userId} = getAuth(req)
    const id = await pool.query("SELECT id FROM users WHERE clerk_user_id = $1", [userId])
    const result = await pool.query("SELECT * FROM tasks WHERE user_id = $1", [id.rows[0].id])
    res.json(result.rows)
})



app.listen(3000, () => console.log("Listening on port 3000"))