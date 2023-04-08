const { client } = require("./config.js");

const { getWeather } = require("./weather.js");


const regex =
/(?=.*(?:天気|てんき|気温|きおん|予報|よほう))(?=.*(?:教えて|おしえて|出力|しゅつりょく))/;
const regionRegister =
/(?=.*(?:地域|ちいき|都市|とし))(?=.*(?:設定|せってい|登録|とうろく))/;
const settingAll =
/(?=.*(?:現在|げんざい))(?=.*(?:設定|せってい))(?=.*(?:表示|ひょうじ))/;

const handleEvent = async (event) => {

  try {
    message = await getWeather();
  } catch {
    console.error('エラーが発生しました');
  }

  // メッセージじゃなかったら返信しない
  if (event.type !== "message" || event.message.type !== "text") {
    return null;

  } else if (event.message.text.match(regionRegister)) {
    await client.replyMessage(event.replyToken, {
      type: "text",
      text: "天気情報をお届けするために、知りたい地域名を教えてください。\n\n入力例：東京都、愛知県、沖縄県など",
    });
    return null;

  } else if (event.message.text.match(regex)) {
    await client.replyMessage(event.replyToken, message);
    return null;

  } else if (event.message.text.match(settingAll)) {
    await client.replyMessage(event.replyToken, {
      type: "text",
      text: "現在登録せれている設定は\n\n地域：名古屋市\n通知時間：平日9時、土日10時です。",
    });
    return null;
  }

  // ここで返信用メッセージを作成
  await client.replyMessage(event.replyToken, {
    type: "text",
    text: `おうむ返しだぁぁ ${event.message.text}`,
  });
  return null;
};

module.exports = {
  handleEvent: handleEvent
};