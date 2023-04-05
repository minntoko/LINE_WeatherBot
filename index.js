const express = require("express");
const cron = require("cron");
const line = require("@line/bot-sdk");
const dotenv = require("dotenv");
const request = require("request");
const app = express();
dotenv.config();
const port = process.env.PORT;

const config = {
  channelAccessToken: process.env.LINE_ACCESS_TOKEN,
  channelSecret: process.env.SECRET_KEY,
};

const client = new line.Client(config);

const city = "Nagoya";

const options = {
  url: `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&lang=ja&appid=${process.env.API_KEY}`,
  method: "GET",
  json: true,
};

let message = {};
request(options, (error, res, body) => {
  // 英語の天気表現を、日本語の天気表現に変換する
  const weatherDict = {
    Clouds: "曇り",
    Sunny: "晴れ",
    Rain: "雨",
  };

  function convertWeather(weather) {
    const matchedKey = Object.keys(weatherDict).find((key) => {
      const regex = new RegExp(key, "i");
      return regex.test(weather);
    });

    const converted = weatherDict[matchedKey];
    return converted ? converted : weather;
  }

  const temp_max = body.main.temp_max.toFixed(1);
  const temp_min = body.main.temp_min.toFixed(1);
  const temp = body.main.temp.toFixed(1);
  const weather = convertWeather(body.weather[0].main);
  message = {
    type: "text",
    text: `現在の${body.name}の天気は${weather}です。気温は${temp}°Cです。`,
  };
});

const userIDs = [process.env.USER_ID1];

const handleEvent = async (event) => {
  const regex =
    /(?=.*(?:天気|てんき|気温|きおん|予報|よほう))(?=.*(?:教えて|おしえて|出力|しゅつりょく))/;
  // メッセージじゃなかったら返信しない
  if (
    event.type !== "message" ||
    event.message.type !== "text" ||
    !event.message.text.match(regex)
  ) {
    await client.replyMessage(event.replyToken, {
      type: 'text',
      text: `おうむ返しだぁぁ ${event.message.text}`
    });
    return null;
  }

  // ここで返信用メッセージを作成
  await client.replyMessage(event.replyToken, message);
};

app.post("/webhook", line.middleware(config), (req, res) => {
  const events = req.body.events;
  console.log(events);
  res.sendStatus(200).end();
  events.map(handleEvent);
});

const job = new cron.CronJob(
  "0 21 * * *",
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
