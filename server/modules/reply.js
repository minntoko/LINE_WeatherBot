const { convertCronToMessage } = require("./setting");

const weatherReplyItems = [
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
];

const notifReplyItems = [
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
];

const baseReplyItems = [
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
];

const regionReplyItems = [
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
];

// 通知を削除するクイックリプライの作成
const deleteNotifReplyItems = (targetUser) => {
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
  return items;
};

module.exports = {
  weatherReplyItems,
  notifReplyItems,
  baseReplyItems,
  regionReplyItems,
  deleteNotifReplyItems,
};
