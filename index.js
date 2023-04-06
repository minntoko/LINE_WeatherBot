const express = require("express");
const cron = require("cron");
const line = require("@line/bot-sdk");
const dotenv = require("dotenv");

const { getWeather } = require("./weather.js");
const app = express();
dotenv.config();
const port = process.env.PORT;

const config = {
  channelAccessToken: process.env.LINE_ACCESS_TOKEN,
  channelSecret: process.env.SECRET_KEY,
};

const client = new line.Client(config);

const userIDs = [process.env.USER_ID1];

const handleEvent = async (event) => {

  try {
    const message = await getWeather();
    console.log(message);
  } catch {
    console.error('エラーが発生しました');
  }

  const regex =
    /(?=.*(?:天気|てんき|気温|きおん|予報|よほう))(?=.*(?:教えて|おしえて|出力|しゅつりょく))/;
  // メッセージじゃなかったら返信しない
  if (
    event.type !== "message" ||
    event.message.type !== "text" ||
    !event.message.text.match(regex)
  ) {
    await client.replyMessage(event.replyToken, {
      type: "text",
      text: `おうむ返しだぁぁ ${event.message.text}`,
    });
    return null;
  }

  // ここで返信用メッセージを作成
  // await client.replyMessage(event.replyToken, message);
};

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
