const express = require("express")
const line = require('@line/bot-sdk')
const dotenv = require('dotenv')
const app = express()
dotenv.config();
const port = process.env.PORT

const config = {
  channelAccessToken: process.env.LINE_ACCESS_TOKEN,
  channelSecret: process.env.SECRET_KEY,
}

const client = new line.Client(config)

app.post('/webhook', line.middleware(config), (req, res) => {
  const events = req.body.events
  console.log(events)
  res.sendStatus(200);
})

app.listen(port, () => {
  console.log("Node.js app listening at http://localhost:" + port)
})