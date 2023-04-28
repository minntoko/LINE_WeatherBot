const {convertCronToMessage} = require("./setting");

const NotifFlexMessages = (targetUser) => {
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
  const flattenedMessages = flexMessages.reduce((acc, current) => {
    acc.push(newObj, current);
    return acc;
  }, []);

  // 通知のフレックスメッセージ
  const NotifContents = {
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
          weight: "bold",
          size: "xl",
          margin: "md",
          text: "通知の設定",
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
                  text: "設定した通知",
                  size: "md",
                  color: "#555555",
                  flex: 0,
                  weight: "bold",
                },
                {
                  type: "text",
                  text:
                    targetUser.cronExpression.length === 0
                      ? "なし"
                      : targetUser.cronExpression.length + "件",
                  size: "md",
                  color: "#555555",
                  align: "end",
                },
              ],
            },
            {
              type: "box",
              layout: "vertical",
              contents: [...flattenedMessages],
            },
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
  return NotifContents;
};

module.exports = {
  NotifFlexMessages: NotifFlexMessages
};
