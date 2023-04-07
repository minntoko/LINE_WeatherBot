const express = require("express");
const cron = require("cron");
const dotenv = require("dotenv");

const { line, config, client } = require("./config.js");
const { getWeather } = require("./weather.js");
const { handleEvent } = require("./handle.js");

const app = express();
dotenv.config();
const port = process.env.PORT;
let message = {};

const users = [
  {
    userId: process.env.USER_ID1,
    cronExpression: ["0 0 9,21 * * Mon-Fri", "0 0 10,23 * * Sat-Sun"],
    region: "Nagoya",
  },
  {
    userId: process.env.USER_ID1,
    cronExpression: ["0 25 22 * * Fri"],
    region: "Tokyo",
  },
];

users.forEach((user) => {
  const cronExpressions = user.cronExpression;
  cronExpressions.forEach((cronExpression) => {
    const job = new cron.CronJob(
      cronExpression,
      () => {
        // message = await getWeather();
        const message = {
          type: "text",
          text: "定期メッセージ",
        };
        client
          .pushMessage(user.userId, message)
          .then(() => {
            console.log(
              `ユーザーID ${user.userId} にメッセージを送信しました。`
            );
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
  });
});

app.post("/webhook", line.middleware(config), (req, res) => {
  const events = req.body.events;
  console.log(events);
  res.sendStatus(200).end();
  events.map(handleEvent);
});

app.listen(port || 3000, () => {
  console.log("Node.js app listening at http://localhost:" + port);
});
