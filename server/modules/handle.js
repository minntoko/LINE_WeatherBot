const { client } = require("./config.js");
const { notifFlexMessages, regionFlexMessages, settingAllFlexMessages } = require("./flexmessage.js");
const {
  updateUser,
  convertCityName,
  reverseConvert,
  updateCron,
  convertCronToMessage,
  createCronExpression,
  isExistingCron,
  addUser,
  users,
} = require("./setting.js");
const { getWeather, getWeatherFlex } = require("./weather.js");
const parser = require("cron-parser");
const { weatherReplyItems, notifReplyItems, baseReplyItems, regionReplyItems, deleteNotifReplyItems } = require("./reply.js");
console.log(weatherReplyItems);

const regex =
  /(?=.*(?:天気|てんき|気温|きおん|予報|よほう))(?=.*(?:教えて|おしえて|出力|しゅつりょく))/;
const wheserRegex = /(.+)の(?=.*(?:天気|てんき))(?=.*(?:教えて|おしえて))/; // 他の地域の天気を教えて
const regionRegister = /(?=.*(?:地域の|ちいきの))(?=.*(?:設定|せってい))/;
const regionRegex = /地域を(.+)(?:に変更して|にして|に設定して)/;
const settingAll =
  /(?=.*(?:全て|現在))(?=.*(?:設定|せってい))(?=.*(?:表示|ひょうじ))/;
const notification = /(?=.*(?:通知|つうち))(?=.*(?:設定|せってい))/;
const usage =
  /(?=.*(?:使い方|つかいかた|使用方法|しようほうほう))(?=.*(?:教えて|おしえて|知りたい|しりたい))/;
const notificationRegex = /(?=.*の)(?=.*(?:に通知して|につうちして|に通知))/;
const deleteNotification =
  /(?=.*(?:の通知を|のつうちを))(?=.*(?:削除して|消して|けして))/;

const handleEvent = async (event) => {
  try {
    const text = event.message.text;
    const userId = event.source.userId;
    const targetUser = users.find((user) => user.userId === userId);
    // 新しいユーザの場合は追加する
    if (!targetUser) {
      addUser(event.source.userId);
    }

    // メッセージじゃなかったら返信しない
    if (event.type !== "message" || event.message.type !== "text") {
      return null;
    }
    let message = "";

    switch (true) {
      case regionRegister.test(text):
        await client.replyMessage(event.replyToken, {
          type: "text",
          text: "天気情報をお届けするために、知りたい地域名を教えてください。\n\n入力例：\n地域を東京都に設定して、\n地域を名古屋にしてなど。",
          quickReply: {
            items: weatherReplyItems
          },
        });
        break;
      case wheserRegex.test(text):
        const otherRegion = convertCityName(text.match(wheserRegex)[1]);
        const otherRegionName = reverseConvert(otherRegion);
        message = await getWeather(otherRegion); // 他の地域の天気
        const otherRegionContents = await getWeatherFlex(otherRegion);
        const otherRegionMessages = [
          { type: "text", text: `${otherRegionName}の天気をお伝えします。` },
          {
            type: "flex",
            altText: message,
            contents: otherRegionContents,
            quickReply: {
              items: weatherReplyItems
            },
          }
        ];

        await client.replyMessage(event.replyToken, otherRegionMessages);
        break;
      case regex.test(text):
        const regionName = reverseConvert(targetUser.region || 'Nagoya');
        message = await getWeather(targetUser.region || "Nagoya");
        const weatherContents = await getWeatherFlex(targetUser.region || "Nagoya");
        const weatherMessages = [
          { type: "text", text: `${regionName}の天気をお伝えします。` },
          {
            type: "flex",
            altText: message,
            contents: weatherContents,
            quickReply: {
              items: weatherReplyItems
            },
          }
        ]
        await client.replyMessage(event.replyToken, weatherMessages);
        break;
      case settingAll.test(text):
        const contents = settingAllFlexMessages(targetUser);

        const items = deleteNotifReplyItems(targetUser);
        
        await client.replyMessage(event.replyToken, {
          type: "flex",
          altText: "天気予報",
          contents: contents,
          quickReply: {
            items: items,
          },
        });
        break;
      case notification.test(text):
        await client.replyMessage(event.replyToken, {
          type: "text",
          text: "通知を設定するために、知りたい時間を教えてください。\n\n入力例：\n平日の9時に通知して\n土日の22時に通知してなど。",
          quickReply: {
            items: notifReplyItems
          },
        });
        break;
      case usage.test(text):
        await client.replyMessage(event.replyToken, {
          type: "text",
          text: "天気予報くんの使い方は\n\n天気を知りたい場所の地域名と通知して欲しい時間を設定すると、その時間にお天気状況をお知らせします。",
          quickReply: {
            items: baseReplyItems
          },
        });
        break;
      case regionRegex.test(text):
        const region = convertCityName(text.match(regionRegex)[1]);
        if (region) {
          await updateUser({ userId: userId, region: region });
          const contents = regionFlexMessages(region);
          await client.replyMessage(event.replyToken, {
            type: "flex",
            altText: "天気予報",
            contents: contents,
            quickReply: {
              items: regionReplyItems
            },
          });
        } else {
          await client.replyMessage(event.replyToken, {
            type: "text",
            text: "地域名が正しくありません。もう一度入力してください。",
          });
        }
        break;
      case notificationRegex.test(text):
        // createCronExpressionをここで行う
        let expression = false;
        try {
          expression = createCronExpression(text);
        } catch (error) {
          console.log('クーロン式への変換に失敗しました');
        }
        // expressionが正しい可動かを判定する
        let expressionJudge = false;
        try {
          parser.parseExpression(expression);
          expressionJudge = true;
        } catch {
          console.log("expressionが正しくありません");
        }
        if (expressionJudge) {
          // 既に登録されているかを判定する
          const isExisting = isExistingCron({
            userId: targetUser.userId,
            expression: expression,
          });
          if (isExisting) {
            await client.replyMessage(event.replyToken, {
              type: "text",
              text: "既に登録されている通知です。",
            });
            break;
          }
          updateCron({ expression: expression, userId: userId });
          // let message = "現在登録せれている通知は\n\n通知時間：\n";
          // message += targetUser.cronExpression
          //   .map((expression) => {
          //     return convertCronToMessage(expression);
          //   })
          //   .join("、\n");
          // message += "です。";

          const contents = notifFlexMessages(targetUser);

          const items = deleteNotifReplyItems(targetUser);

          await client.replyMessage(event.replyToken, {
            type: "flex",
            altText: "天気予報",
            contents: contents,
            quickReply: {
              items: items,
            },
          });
        } else {
          await client.replyMessage(event.replyToken, {
            type: "text",
            text: "時間が正しくありません。もう一度入力してください。",
          });
        }
        break;
      case deleteNotification.test(text):
        const deleteExpression = createCronExpression(text);
        const deleteIndex = targetUser.cronExpression.findIndex(
          (expression) => expression === deleteExpression
        );
        if (deleteIndex !== -1) {
          targetUser.cronExpression.splice(deleteIndex, 1); // インデックス番号deleteIndexから1つ要素を削除
          await updateUser({
            userId: userId,
            cronExpression: targetUser.cronExpression,
          });
          let message = "現在登録せれている通知は\n\n通知時間：";
          message +=
            targetUser.cronExpression
              .map((expression) => {
                return "\n" + convertCronToMessage(expression);
              })
              .join("、") || "未設定";
          message += "です。";
          const items = deleteNotifReplyItems(targetUser);

          await client.replyMessage(event.replyToken, {
            type: "text",
            text: message,
            quickReply: {
              items: items
            },
          });
        } else {
          await client.replyMessage(event.replyToken, {
            type: "text",
            text: "削除したい通知が見つかりませんでした。",
          });
        }
        break;
      default:
        await client.replyMessage(event.replyToken, {
          type: "text",
          text: `おうむ返しだぁぁ ${text}`,
        });
        break;
    }
    return null;
  } catch {
    await client.replyMessage(event.replyToken, {
      type: "text",
      text: `すいません、よく分かりませんでした。`,
    });
    console.error("エラーが発生しました");
  }
};

module.exports = {
  handleEvent: handleEvent,
};
