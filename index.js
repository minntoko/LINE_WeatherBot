const express = require("express");
const cron = require('cron');
const line = require("@line/bot-sdk");
const dotenv = require("dotenv");
const app = express();
dotenv.config();
const port = process.env.PORT;

const config = {
  channelAccessToken: process.env.LINE_ACCESS_TOKEN,
  channelSecret: process.env.SECRET_KEY,
};

const client = new line.Client(config);

const message = {
  type: 'text',
  text: '明日の名古屋市の天気は晴れのち曇りです。最高気温23度、最低気温は12度です。'
};

const userIDs = [process.env.USER_ID1];

const handleEvent = async (event) => {
  // メッセージじゃなかったら返信しない
  if (event.type !== 'message' || event.message.type !== 'text') {
    return null;
  }

  // ここで返信用メッセージを作成
  await client.replyMessage(event.replyToken, {
    type: 'text',
    text: event.message.text
  })
}

app.post("/webhook", line.middleware(config), (req, res) => {
  const events = req.body.events;
  console.log(events);
  res.sendStatus(200);
  events.map(handleEvent);
});

const job = new cron.CronJob('* 21 * * *', () => {
  // 21時になったら、メッセージを送信する
  client.multicast(userIDs, message)
    .then(() => {
      console.log('21:00にメッセージを送信しました。');
    })
    .catch((err) => {
      console.error(err);
    });
}, null, false, 'Asia/Tokyo');

job.start();

app.listen(port, () => {
  console.log("Node.js app listening at http://localhost:" + port);
});
