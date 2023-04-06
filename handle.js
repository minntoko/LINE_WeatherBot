const { client } = require("./config.js");

const { getWeather } = require("./weather.js");

const handleEvent = async (event) => {

  try {
    message = await getWeather();
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
  await client.replyMessage(event.replyToken, message);
};

module.exports = {
  handleEvent: handleEvent
};