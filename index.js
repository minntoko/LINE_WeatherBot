const express = require("express");
const cron = require("cron");
const dotenv = require("dotenv");

const { line, config, client } = require("./config.js");
const { handleEvent } = require("./handle.js");
const app = express();
dotenv.config();
const port = process.env.PORT;

let message = {};

const userIDs = [process.env.USER_ID1];

app.post("/webhook", line.middleware(config), (req, res) => {
  const events = req.body.events;
  console.log(events);
  res.sendStatus(200).end();
  events.map(handleEvent);
});

const job = new cron.CronJob(
  "12 20 * * *",
  () => {
    // 21時になったら、メッセージを送信する
    client
      .multicast(userIDs, message)
      .then(() => {
        console.log("21:00にメッセージを送信しました。");
      })
      .catch((err) => {
        console.error(err);
      });
  },
  null,
  false,
  "Asia/Tokyo"
);

job.start();

app.listen(port || 3000, () => {
  console.log("Node.js app listening at http://localhost:" + port);
});
