const { client } = require("./config.js");
const {
  updateUser,
  convertCityName,
  reverseConvert,
  updateCron,
  convertCronToMessage,
  users,
} = require("./setting.js");
const { getWeather } = require("./weather.js");

const regex =
  /(?=.*(?:天気|てんき|気温|きおん|予報|よほう))(?=.*(?:教えて|おしえて|出力|しゅつりょく))/;
const regionRegister = /(?=.*(?:地域の|ちいきの))(?=.*(?:設定|せってい))/;
const regionRegex = /地域を(.+)(?:に変更して|にして|に設定して)/;
const settingAll =
  /(?=.*(?:現在|げんざい))(?=.*(?:設定|せってい))(?=.*(?:表示|ひょうじ))/;
const notification = /(?=.*(?:通知|つうち))(?=.*(?:設定|せってい))/;
const usage =
  /(?=.*(?:使い方|つかいかた|使用方法|しようほうほう))(?=.*(?:教えて|おしえて|知りたい|しりたい))/;
const notificationRegex = /(?=.*の)(?=.*(?:に通知して|につうちして|に通知))/;

const handleEvent = async (event) => {
  try {
    // メッセージじゃなかったら返信しない
    if (event.type !== "message" || event.message.type !== "text") {
      return null;
    } else if (event.message.text.match(regionRegister)) {
      await client.replyMessage(event.replyToken, {
        type: "text",
        text: "天気情報をお届けするために、知りたい地域名を教えてください。\n\n入力例：\n地域を東京都に設定して、\n地域を名古屋にしてなど。",
      });
      return null;
    } else if (event.message.text.match(regex)) {
      message = await getWeather(users[0].region || "Nagoya");
      await client.replyMessage(event.replyToken, message);
      return null;
    } else if (event.message.text.match(settingAll)) {
      await client.replyMessage(event.replyToken, {
        type: "text",
        text: `現在登録せれている設定は\n\n地域：${reverseConvert(
          users[0].region
        ) || "なし"}\n通知時間：${users[0].cronExpression
          .map((expression) => {
            return '\n' + convertCronToMessage(expression);
          })
          .join("、") || "なし"}`,
      });
      return null;
    } else if (event.message.text.match(notificationRegex)) {
      updateCron({ message: event.message.text, userId: event.source.userId });

      let message = "現在登録せれている通知は\n\n通知時間：\n";
      message += users[0].cronExpression
        .map((expression) => {
          return convertCronToMessage(expression);
        })
        .join("、\n");
      message += "です。";
      await client.replyMessage(event.replyToken, {
        type: "text",
        text: message,
      });
      return null;
    } else if (event.message.text.match(notification)) {
      await client.replyMessage(event.replyToken, {
        type: "text",
        text: "天気をお知らせする時間を選択してね。\n\n設定の例:\n平日の9時に通知して\n土日の22時に通知してなど。",
      });
      return null;
    } else if (event.message.text.match(usage)) {
      await client.replyMessage(event.replyToken, {
        type: "text",
        text: "天気予報くんの使い方は\n天気を知りたい場所の地域名と通知して欲しい時間を設定すると、その時間にお天気状況をお知らせします。",
      });
      return null;
    } else if (event.message.text.match(regionRegex)) {
      const match = event.message.text.match(regionRegex);
      const newCity = convertCityName(match[1]);
      if (newCity) {
        const newUserData = {
          userId: event.source.userId,
          region: newCity,
        };
        const updatedUser = updateUser(newUserData);
        await client.replyMessage(event.replyToken, {
          type: "text",
          text: `登録する地域を${reverseConvert(
            updatedUser.region
          )}にしました。`,
        });
      } else {
        await client.replyMessage(event.replyToken, {
          type: "text",
          text: `対応していない地域です。県名や県庁所在地など別の地域をお試しください。`,
        });
      }
      return null;
    }

    // ここで返信用メッセージを作成
    await client.replyMessage(event.replyToken, {
      type: "text",
      text: `おうむ返しだぁぁ ${event.message.text}`,
    });
    return null;
  } catch {
    console.error("エラーが発生しました");
  }
};

module.exports = {
  handleEvent: handleEvent,
};
