const { client } = require("./config.js");
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
const { getWeather } = require("./weather.js");
const parser = require("cron-parser");

const regex =
  /(?=.*(?:天気|てんき|気温|きおん|予報|よほう))(?=.*(?:教えて|おしえて|出力|しゅつりょく))/;
const wheserRegex = /(.+)の(?=.*(?:天気|てんき))(?=.*(?:教えて|おしえて))/; // 他の地域の天気を教えて
const regionRegister = /(?=.*(?:地域の|ちいきの))(?=.*(?:設定|せってい))/;
const regionRegex = /地域を(.+)(?:に変更して|にして|に設定して)/;
const settingAll =
  /(?=.*(?:現在|げんざい))(?=.*(?:設定|せってい))(?=.*(?:表示|ひょうじ))/;
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
            items: [
              {
                type: "action",
                action: {
                  type: "message",
                  label: "札幌",
                  text: "地域を札幌に設定して",
                },
              },
              {
                type: "action",
                action: {
                  type: "message",
                  label: "仙台",
                  text: "地域を仙台に設定して",
                },
              },
              {
                type: "action",
                action: {
                  type: "message",
                  label: "東京",
                  text: "地域を東京に設定して",
                },
              },
              {
                type: "action",
                action: {
                  type: "message",
                  label: "名古屋",
                  text: "地域を名古屋に設定して",
                },
              },
              {
                type: "action",
                action: {
                  type: "message",
                  label: "大阪",
                  text: "地域を大阪に設定して",
                },
              },
              {
                type: "action",
                action: {
                  type: "message",
                  label: "福岡",
                  text: "地域を福岡に設定して",
                },
              },
              {
                type: "action",
                action: {
                  type: "message",
                  label: "那覇",
                  text: "地域を那覇に設定して",
                },
              },
            ],
          },
        });
        break;
      case wheserRegex.test(text):
        const otherRegion = convertCityName(text.match(wheserRegex)[1]);
        message = await getWeather(otherRegion); // 他の地域の天気
        await client.replyMessage(event.replyToken, {
          type: "text",
          text: message,
          quickReply: {
            items: [
              {
                type: "action",
                action: {
                  type: "message",
                  label: "札幌の天気",
                  text: "札幌の天気を教えて",
                },
              },
              {
                type: "action",
                action: {
                  type: "message",
                  label: "仙台の天気",
                  text: "仙台の天気を教えて",
                },
              },
              {
                type: "action",
                action: {
                  type: "message",
                  label: "東京の天気",
                  text: "東京の天気を教えて",
                },
              },
              {
                type: "action",
                action: {
                  type: "message",
                  label: "名古屋の天気",
                  text: "名古屋の天気を教えて",
                },
              },
              {
                type: "action",
                action: {
                  type: "message",
                  label: "大阪の天気",
                  text: "大阪の天気を教えて",
                },
              },
              {
                type: "action",
                action: {
                  type: "message",
                  label: "福岡の天気",
                  text: "福岡の天気を教えて",
                },
              },
              {
                type: "action",
                action: {
                  type: "message",
                  label: "那覇の天気",
                  text: "那覇の天気を教えて",
                },
              },
            ],
          },
        });
        break;
      case regex.test(text):
        message = await getWeather(targetUser.region || "Nagoya");
        console.log(message);
        await client.replyMessage(event.replyToken, {
          type: "text",
          text: message,
          quickReply: {
            items: [
              {
                type: "action",
                action: {
                  type: "message",
                  label: "札幌の天気",
                  text: "札幌の天気を教えて",
                },
              },
              {
                type: "action",
                action: {
                  type: "message",
                  label: "仙台の天気",
                  text: "仙台の天気を教えて",
                },
              },
              {
                type: "action",
                action: {
                  type: "message",
                  label: "東京の天気",
                  text: "東京の天気を教えて",
                },
              },
              {
                type: "action",
                action: {
                  type: "message",
                  label: "名古屋の天気",
                  text: "名古屋の天気を教えて",
                },
              },
              {
                type: "action",
                action: {
                  type: "message",
                  label: "大阪の天気",
                  text: "大阪の天気を教えて",
                },
              },
              {
                type: "action",
                action: {
                  type: "message",
                  label: "福岡の天気",
                  text: "福岡の天気を教えて",
                },
              },
              {
                type: "action",
                action: {
                  type: "message",
                  label: "那覇の天気",
                  text: "那覇の天気を教えて",
                },
              },
            ],
          },
        });
        break;
      case settingAll.test(text):
        const flexMessages = targetUser.cronExpression.map((expression) => ({
          type: "box",
          layout: "vertical",
          contents: [
            {
              type: "text",
              text: convertCronToMessage(expression),
              color: "#555555",
              size: "md",
              align: "center",
            },
          ],
          margin: "xxl",
        }));
        const newObj = {
          type: "separator",
          margin: "xxl",
        };
        console.log('ここまできてる？');
        const flattenedMessages = flexMessages.reduce((acc, current) => {
          acc.push(newObj,current);
          return acc;
        }, []);
        contents = {
          type: "bubble",
          body: {
            type: "box",
            layout: "vertical",
            contents: [
              {
                type: "text",
                text: "天気予報くん",
                weight: "bold",
                color: "#7ABEf3",
                size: "sm",
              },
              {
                type: "text",
                text: "現在の設定",
                weight: "bold",
                size: "xl",
                margin: "md",
              },
              {
                type: "separator",
                margin: "xxl",
              },
              {
                type: "box",
                layout: "vertical",
                margin: "xxl",
                spacing: "sm",
                contents: [
                  {
                    type: "box",
                    layout: "horizontal",
                    contents: [
                      {
                        type: "text",
                        text: "設定地域",
                        size: "md",
                        color: "#555555",
                        flex: 0,
                        weight: "bold",
                      },
                      {
                        type: "text",
                        text: reverseConvert(targetUser.region) || "なし",
                        size: "md",
                        color: "#555555",
                        align: "end",
                      },
                    ],
                  },
                  {
                    type: "separator",
                    margin: "xxl",
                  },
                  {
                    type: "box",
                    layout: "horizontal",
                    margin: "xxl",
                    contents: [
                      {
                        type: "text",
                        text: "設定した通知",
                        size: "md",
                        color: "#555555",
                        weight: "bold",
                      },
                      {
                        type: "text",
                        text:
                          targetUser.cronExpression.length === 0
                            ? "なし"
                            : targetUser.cronExpression.length + "件",
                        align: "end",
                        size: "md",
                        color: "#555555",
                      },
                    ],
                  },
                  ...flattenedMessages,
                ],
              },
            ],
          },
          styles: {
            footer: {
              separator: true,
            },
          },
        };
        const messageCrons = targetUser.cronExpression.slice(0, 11);
        const items = messageCrons.map((cron) => {
          return {
            type: "action",
            action: {
              type: "message",
              label: `${convertCronToMessage(cron)}を削除`,
              text: `${convertCronToMessage(cron)}の通知を削除して`,
            },
          };
        });
        items.unshift(
          {
            type: "action",
            action: {
              type: "message",
              label: "地域を設定",
              text: "地域の設定",
            },
          },
          {
            type: "action",
            action: {
              type: "message",
              label: "通知の設定",
              text: "通知時間の設定",
            },
          }
        );
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
            items: [
              {
                type: "action",
                action: {
                  type: "message",
                  label: "平日の9時",
                  text: "平日の9時に通知して",
                },
              },
              {
                type: "action",
                action: {
                  type: "message",
                  label: "平日の8時",
                  text: "平日の8時に通知して",
                },
              },
              {
                type: "action",
                action: {
                  type: "message",
                  label: "土日の10時",
                  text: "土日の10時に通知して",
                },
              },
              {
                type: "action",
                action: {
                  type: "message",
                  label: "土日の22時",
                  text: "土日の22時に通知して",
                },
              },
              {
                type: "action",
                action: {
                  type: "message",
                  label: "月曜日の8時30分",
                  text: "月曜日の8時30分に通知して",
                },
              },
            ],
          },
        });
        break;
      case usage.test(text):
        await client.replyMessage(event.replyToken, {
          type: "text",
          text: "天気予報くんの使い方は\n\n天気を知りたい場所の地域名と通知して欲しい時間を設定すると、その時間にお天気状況をお知らせします。",
          quickReply: {
            items: [
              {
                type: "action",
                action: {
                  type: "message",
                  label: "地域を設定",
                  text: "地域の設定",
                },
              },
              {
                type: "action",
                action: {
                  type: "message",
                  label: "通知の設定",
                  text: "通知時間の設定",
                },
              },
              {
                type: "action",
                action: {
                  type: "message",
                  label: "現在の天気",
                  text: "天気を教えて",
                },
              },
              {
                type: "action",
                action: {
                  type: "message",
                  label: "現在の設定",
                  text: "現在の設定を表示",
                },
              },
            ],
          },
        });
        break;
      case regionRegex.test(text):
        const region = convertCityName(text.match(regionRegex)[1]);
        if (region) {
          await updateUser({ userId: userId, region: region });
          await client.replyMessage(event.replyToken, {
            type: "text",
            text: `登録地域を${reverseConvert(region)}に設定しました。`,
            quickReply: {
              items: [
                {
                  type: "action",
                  action: {
                    type: "message",
                    label: "地域を再設定",
                    text: "地域の設定",
                  },
                },
                {
                  type: "action",
                  action: {
                    type: "message",
                    label: "通知の設定",
                    text: "通知時間の設定",
                  },
                },
                {
                  type: "action",
                  action: {
                    type: "message",
                    label: "現在の天気",
                    text: "天気を教えて",
                  },
                },
              ],
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
        const expression = createCronExpression(text);
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
          let message = "現在登録せれている通知は\n\n通知時間：\n";
          message += targetUser.cronExpression
            .map((expression) => {
              return convertCronToMessage(expression);
            })
            .join("、\n");
          message += "です。";

          const messageCrons = targetUser.cronExpression.slice(0, 11);
          const items = messageCrons.map((cron) => {
            return {
              type: "action",
              action: {
                type: "message",
                label: `${convertCronToMessage(cron)}を削除`,
                text: `${convertCronToMessage(cron)}の通知を削除して`,
              },
            };
          });
          items.unshift(
            {
              type: "action",
              action: {
                type: "message",
                label: "使い方について",
                text: "使い方を教えて",
              },
            },
            {
              type: "action",
              action: {
                type: "message",
                label: "通知を追加",
                text: "通知時間の設定",
              },
            }
          );

          await client.replyMessage(event.replyToken, {
            type: "text",
            text: message,
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

          const messageCrons = targetUser.cronExpression.slice(0, 12);
          const items = messageCrons.map((cron) => {
            return {
              type: "action",
              action: {
                type: "message",
                label: `${convertCronToMessage(cron)}を削除`,
                text: `${convertCronToMessage(cron)}の通知を削除して`,
              },
            };
          });
          items.unshift({
            type: "action",
            action: {
              type: "message",
              label: "通知の設定",
              text: "通知時間の設定",
            },
          });
          await client.replyMessage(event.replyToken, {
            type: "text",
            text: message,
            quickReply: {
              items: items,
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
    console.error("エラーが発生しました");
  }
};

module.exports = {
  handleEvent: handleEvent,
};

// 地域のフレックスメッセージ

// {
//   "type": "bubble",
//   "body": {
//     "type": "box",
//     "layout": "vertical",
//     "contents": [
//       {
//         "type": "text",
//         "text": "天気予報くん",
//         "weight": "bold",
//         "color": "#7ABEf3",
//         "size": "sm"
//       },
//       {
//         "type": "text",
//         "weight": "bold",
//         "size": "xxl",
//         "margin": "md",
//         "text": "地域を設定"
//       },
//       {
//         "type": "separator",
//         "margin": "xxl"
//       },
//       {
//         "type": "box",
//         "layout": "vertical",
//         "margin": "xxl",
//         "spacing": "sm",
//         "contents": [
//           {
//             "type": "box",
//             "layout": "horizontal",
//             "contents": [
//               {
//                 "type": "text",
//                 "text": "設定地域",
//                 "size": "md",
//                 "color": "#555555",
//                 "flex": 0,
//                 "weight": "bold"
//               },
//               {
//                 "type": "text",
//                 "text": "名古屋",
//                 "size": "md",
//                 "color": "#555555",
//                 "align": "end"
//               }
//             ]
//           }
//         ]
//       }
//     ]
//   },
//   "styles": {
//     "footer": {
//       "separator": true
//     }
//   }
// }

// 通知のフレックスメッセージ
// {
//   "type": "bubble",
//   "body": {
//     "type": "box",
//     "layout": "vertical",
//     "contents": [
//       {
//         "type": "text",
//         "text": "天気予報くん",
//         "weight": "bold",
//         "color": "#7ABEf3",
//         "size": "sm"
//       },
//       {
//         "type": "text",
//         "weight": "bold",
//         "size": "xxl",
//         "margin": "md",
//         "text": "通知を設定"
//       },
//       {
//         "type": "separator",
//         "margin": "xxl"
//       },
//       {
//         "type": "box",
//         "layout": "vertical",
//         "margin": "xxl",
//         "spacing": "sm",
//         "contents": [
//           {
//             "type": "box",
//             "layout": "horizontal",
//             "contents": [
//               {
//                 "type": "text",
//                 "text": "設定した通知",
//                 "size": "md",
//                 "color": "#555555",
//                 "flex": 0,
//                 "weight": "bold"
//               },
//               {
//                 "type": "text",
//                 "text": "2件",
//                 "size": "md",
//                 "color": "#555555",
//                 "align": "end"
//               }
//             ]
//           },
//           {
//             "type": "separator",
//             "margin": "xxl"
//           },
//           {
//             "type": "box",
//             "layout": "vertical",
//             "contents": [
//               {
//                 "type": "text",
//                 "text": "毎週平日の19時30分",
//                 "align": "center",
//                 "size": "md",
//                 "margin": "xxl"
//               }
//             ]
//           }
//         ]
//       }
//     ]
//   },
//   "styles": {
//     "footer": {
//       "separator": true
//     }
//   }
// }
