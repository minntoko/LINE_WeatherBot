const { convertCronToMessage, reverseConvert } = require("./setting");
const dotenv = require("dotenv").config();
const imageUrl = process.env.URL;

const settingAllFlexMessages = (targetUser) => {
  const flexMessages = targetUser.cronExpression.map((expression) => ({
    type: "box",
    layout: "vertical",
    contents: [
      {
        type: "text",
        text: convertCronToMessage(expression),
        color: "#555555",
        size: "sm",
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
  settingAllContents = {
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
          text: "全ての設定",
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
                  size: "sm",
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
                  size: "sm",
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
  return settingAllContents;
};

const notifFlexMessages = (targetUser) => {
  const flexMessages = targetUser.cronExpression.map((expression) => ({
    type: "box",
    layout: "horizontal",
    contents: [
      {
        type: "text",
        text: "通知時間",
        color: "#555555",
        size: "md",
        flex: 1,
        weight: "bold",
      },
      {
        type: "text",
        text: convertCronToMessage(expression),
        color: "#555555",
        size: "sm",
        flex: 2,
        align: "end",
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
                  size: "xl",
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
                  size: "sm",
                  color: "#555555",
                  align: "end",
                },
              ],
              alignItems: "center",
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

const regionFlexMessages = (region) => {
  const regionContents = {
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
          text: "地域の設定",
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
                  text: reverseConvert(region),
                  size: "sm",
                  color: "#555555",
                  align: "end",
                },
              ],
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
  return regionContents;
};

const defaultColor = {
  type: "linearGradient",
  angle: "135deg",
  startColor: "#418DFD",
  endColor: "#2ED4FF",
};

const cloudsColor = {
  type: "linearGradient",
  angle: "135deg",
  startColor: "#949faf",
  endColor: "#888888",
};

const rainColor = {
  type: "linearGradient",
  angle: "135deg",
  startColor: "#949faf",
  endColor: "#5bc8f5",
};

const snowColor = {
  type: "linearGradient",
  angle: "135deg",
  endColor: "#949faf",
  startColor: "#a8caf0",
};

const weatherFlexMessages = ({ city, weather, temp, main }) => {
  let background = {};
  switch (main) {
    case "Clouds":
      background = cloudsColor;
      break;
    case "Rain":
      background = rainColor;
      break;
    case "Snow":
      background = snowColor;
      break;
    default:
      background = defaultColor;
      break;
  }
  const weatherContents = {
    type: "bubble",
    body: {
      type: "box",
      layout: "vertical",
      contents: [
        {
          type: "box",
          layout: "vertical",
          contents: [
            {
              type: "box",
              layout: "vertical",
              contents: [
                {
                  type: "text",
                  contents: [],
                  size: "xl",
                  wrap: true,
                  text: "現在の天気 ⛅️",
                  color: "#ffffff",
                  weight: "bold",
                },
                {
                  type: "text",
                  text: `地域 ${city}`,
                  color: "#ffffffcc",
                  size: "sm",
                  margin: "md",
                },
              ],
              spacing: "sm",
            },
            {
              type: "box",
              layout: "vertical",
              contents: [
                {
                  type: "box",
                  layout: "vertical",
                  contents: [
                    {
                      type: "text",
                      contents: [],
                      size: "sm",
                      wrap: true,
                      color: "#ffffffde",
                      text: `天気は${weather}\n気温は${temp}°Cです。`,
                    },
                  ],
                },
              ],
              paddingAll: "13px",
              backgroundColor: "#ffffff1A",
              cornerRadius: "4px",
              margin: "xl",
            },
          ],
        },
      ],
      paddingAll: "20px",
      background: background,
    },
  };
  return weatherContents;
};

const usageFlexMessages = {
  type: "carousel",
  contents: [
    {
      type: "bubble",
      hero: {
        type: "image",
        size: "full",
        aspectRatio: "20:13",
        aspectMode: "cover",
        url: `${imageUrl}/images/01_weather.png`,
      },
      body: {
        type: "box",
        layout: "vertical",
        contents: [
          {
            type: "text",
            text: "現在の天気情報をお届け",
            wrap: true,
            weight: "bold",
            size: "md",
          },
          {
            type: "text",
            text: "メニューから天気をタップすると\n登録地域の天気をお届けします。",
            wrap: true,
          },
        ],
      },
      footer: {
        type: "box",
        layout: "vertical",
        contents: [
          {
            type: "separator",
          },
          {
            type: "button",
            action: {
              type: "message",
              label: "現在の天気の状況を見る",
              text: "天気を教えて",
            },
          },
        ],
      },
    },
    {
      type: "bubble",
      hero: {
        type: "image",
        size: "full",
        aspectRatio: "20:13",
        aspectMode: "cover",
        url: `${imageUrl}/images/02_region.png`,
      },
      body: {
        type: "box",
        layout: "vertical",
        contents: [
          {
            type: "text",
            text: "地域を登録しよう",
            wrap: true,
            weight: "bold",
            size: "md",
          },
          {
            type: "text",
            text: "メニューから地域をタップして\n自分が住んでる地域を登録してね",
            wrap: true,
          },
        ],
      },
      footer: {
        type: "box",
        layout: "vertical",
        contents: [
          {
            type: "separator",
          },
          {
            type: "button",
            action: {
              type: "message",
              label: "ここからでも地域を登録できるよ",
              text: "地域の設定",
            },
          },
        ],
      },
    },
    {
      type: "bubble",
      hero: {
        type: "image",
        size: "full",
        aspectRatio: "20:13",
        aspectMode: "cover",
        url: `${imageUrl}/images/03_notif.png`,
      },
      body: {
        type: "box",
        layout: "vertical",
        contents: [
          {
            type: "text",
            text: "通知を設定しよう",
            wrap: true,
            weight: "bold",
            size: "md",
          },
          {
            type: "text",
            text: "通知して欲しい時間を設定すると\nその時間に天気情報をお届けするよ",
            wrap: true,
          },
        ],
      },
      footer: {
        type: "box",
        layout: "vertical",
        contents: [
          {
            type: "separator",
          },
          {
            type: "button",
            action: {
              type: "message",
              label: "通知する時間を登録してね",
              text: "通知時間の設定",
            },
          },
        ],
      },
    },
  ],
};

module.exports = {
  settingAllFlexMessages: settingAllFlexMessages,
  notifFlexMessages: notifFlexMessages,
  regionFlexMessages: regionFlexMessages,
  weatherFlexMessages: weatherFlexMessages,
  usageFlexMessages: usageFlexMessages,
};
