const Bull = require("bull")
const express = require('express')

const app = express()
const port = 3000
const queue = new Bull("messageQueue",
    `redis://${(process.env.REDIS_HOST)}:6379`)

app.use(express.json())

// Server receives messages and puts them on a queue.
app.post('/messages', (req, res) => {
    console.log(req.method, req.path, Date.now())

    queue.add(req.body)

    res.json({
        message: "Job added to queue",
        timestamp: Date.now()
    })
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})
