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
    res.json({message: "Deleted the task"})
})

app.post("/complete/:id", async(req, res) => {
    const identifier = await pool.query("SELECT * FROM tasks WHERE id = $1", [req.params.id]) //select the entire row that has a matching id
    const testUserId = await pool.query("SELECT user_id FROM tasks WHERE id = $1", [req.params.id])
    const task = identifier.rows[0] //selects the first row that has that identifier, since it's unique it selects that 1 row
    await pool.query("INSERT into completed_tasks(user_id, content) VALUES($1, $2)", [task.user_id, task.content ])
    await pool.query("DELETE FROM tasks WHERE id = $1", [req.params.id])
    console.log(testUserId.rows[0]) 
    res.json([{message: "Tast marked as done!"}])
})

app.get("/complete", async(req, res) => {
    const {userId} = getAuth(req)
    const id = await pool.query("SELECT id FROM users WHERE clerk_user_id = $1", [userId])
    const completedtask = await pool.query("SELECT * FROM completed_tasks WHERE user_id = $1", [id.rows[0].id]) //when adding a task it's automatically bound to user_id, this should work
    res.json(completedtask.rows)
})

app.delete("/complete/:id", async(req, res) => {
    await pool.query("DELETE FROM completed_tasks WHERE id = $1", [req.params.id])
    res.json({message: "Deleted the completed task"})
})

app.post("/data", async (req, res) => {
    const {userId} = (getAuth(req))
    //you're the user, this thing will find your id by checking which clerkuserid you have right now
    const id = await pool.query("SELECT id FROM users WHERE clerk_user_id = $1", [userId])
    console.log(userId)
    console.log(id.rows)
    if(userId){

    }
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