## 概要
このサービスは、設定した地域の天気情報をLINEで確認できるLINEBotです。また、通知して欲しい時間を設定することでその時間になったら天気をお届けする機能も備えています。Node.jsとExpressを使って書きました。
クイックリプライで他の地域の天気もすぐに送ってもらうこともできます。天気のカードは4つあります。

<table>
  <tr>
    <td>
      <img src="https://user-images.githubusercontent.com/85634654/235693119-bc771846-5fd0-4ec8-8878-64b920826066.jpg" width="320px">
    </td>
    <td>
      <div>
        <img src="https://user-images.githubusercontent.com/85634654/235690468-7c0164e9-10a2-47c9-bda0-dde02782a06c.png" width="270px">
        <img src="https://user-images.githubusercontent.com/85634654/235688999-7b9c1c19-0234-4c7b-a4d3-9720de8fe556.png" width="270px">
      </div>
      <div>
        <img src="https://user-images.githubusercontent.com/85634654/235688990-debd16b9-600f-4081-b00a-1c1470983b3f.png" width="270px">
        <img src="https://user-images.githubusercontent.com/85634654/235689004-41fbfbda-8706-426d-a012-3a7b8ac5ad54.png" width="270px">
      </div>
    </td>
  </tr>
</table>

## 使い方
LINEアカウントでログインし、LINEBotの友達登録を行ってください。
フォローされたら、Botからメッセージが送られてきます。そのメッセージに従い、地域を設定してください。
設定が完了すると、天気情報を確認することができます。また、通知して欲しい時間を設定することもできます。

## インストール
このリポジトリをクローンしてください。
npm installを実行して、必要なパッケージをインストールしてください。
.envを作成してください。必要に応じて環境変数を設定してください。
npm startを実行して、サーバーを起動してください。

## 環境変数
このサービスを使うには、以下の環境変数を設定する必要があります。

LINE_ACCESS_TOKEN: LINE Messaging APIのアクセストークン
SECRET_KEY: LINE Messaging APIのチャネルシークレット
OPEN_WEATHER_MAP_API_KEY: OpenWeatherMap APIのアクセスキー
URL: 使い方の説明で必要な画像のリンク先
