const express = require("express");
const dotenv = require("dotenv").config();

const { line, config } = require("./server/modules/config.js");
const { handleEvent } = require("./server/modules/handle.js");

const app = express();
const port = process.env.PORT;

app.use(express.static('server'));

app.post("/webhook", line.middleware(config), (req, res) => {
  const events = req.body.events;
  console.log(events);
  res.sendStatus(200).end();
  events.map(handleEvent);
});

app.listen(port || 3000, () => {
  console.log("Node.js app listening at http://localhost:" + port);
});