const { client } = require("./config.js");
const { updateUser } = require("./setting.js");
const { getWeather } = require("./weather.js");

const regex = /(?=.*(?:天気|てんき|気温|きおん|予報|よほう))(?=.*(?:教えて|おしえて|出力|しゅつりょく))/;
const regionRegister = /(?=.*(?:地域|ちいき|都市|とし))(?=.*(?:設定|せってい|登録|とうろく))/;
const regionRegex = /地域を(.+)(?:に変更して|に設定して)/;
const settingAll = /(?=.*(?:現在|げんざい))(?=.*(?:設定|せってい))(?=.*(?:表示|ひょうじ))/;
const Notification = /(?=.*(?:通知|つうち))(?=.*(?:設定|せってい))/;
const usage = /(?=.*(?:使い方|つかいかた|使用方法|しようほうほう))(?=.*(?:教えて|おしえて|知りたい|しりたい))/;

const handleEvent = async (event) => {
  try {
    message = await getWeather();
  } catch {
    console.error("エラーが発生しました");
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
  } else if (event.message.text.match(Notification)) {
    await client.replyMessage(event.replyToken, {
      type: "text",
      text: "天気をお知らせする時間を選択してね\n設定の例\n\n平日(月〜金)9:00\n休日(土〜日)10:00",
    });
    return null;
  } else if (event.message.text.match(usage)) {
    await client.replyMessage(event.replyToken, {
      type: "text",
      text: "天気予報くんの使い方は\n天気を知りたい場所の地域名と通知して欲しい時間を設定すると、その時間にお天気状況をお知らせします。",
    });
    return null;
  } else if (event.message.text.match(regionRegex)) {
    const match = userMessage.match(regionRegex);
    const newUserData = {
      userId: event.source.userId,
      region: match[1]
    }
    updateUser(newUserData);
  }

  // ここで返信用メッセージを作成
  await client.replyMessage(event.replyToken, {
    type: "text",
    text: `おうむ返しだぁぁ ${event.message.text}`,
  });
  return null;
};

module.exports = {
  handleEvent: handleEvent,
};
