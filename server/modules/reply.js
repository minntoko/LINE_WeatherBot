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

module.exports = {
  weatherReplyItems,
  notifReplyItems
};
