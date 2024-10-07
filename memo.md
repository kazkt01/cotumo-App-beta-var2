2024/10/07
ともかのアイデア
・合計時間の見えるところとその習慣を何回やったかの回数が見えるといいかも
・スタンプみたいな可愛いのとかあったらいいかもとのこと
確かにこれらのアイデアは有益だと感じた。

学習は、青で
筋トレ：赤
仕事：グレー

2024/10/06
ビルド成功　←チャンクかなんかの設定をした方が良いらしい。。。
versel：デプロイ完了
バックアップファイル：作成完了

2024/10/06
全エラー解消　18:04
ここからリファクタリングデザインを再構築していく

2024/10/05
漸くアプリが動くレベルにできた
あとは、コードを綺麗にして共通化できるところは、共通化して
可読性と保守性を高めましょう
あとカラーリングも見直したいところ

2024/10/04
アプリ概要言語化；
習慣を可視化するアプリ
習慣開始時間と終了時間をカレンダーとグラフで可視化
カレンダーには、何を何時間
グラフにも何を何時間かわかるようにしたい
+α
習慣開始時のタイムスタンプを押す段階でカテゴリー選択を可能にする
カテオリー別にカレンダーやグラフでの表示を色分け

使用ライブラリ
・fullCarendar: npm install @fullcalendar/react @fullcalendar/core @fullcalendar/daygrid
・React-Router-Dom ：npm i react-router-dom
・MUI 　+ icon： npm install @mui/icons-material @mui/material @emotion/styled @emotion/react
・MUI X-Charts: npm install @mui/x-charts
・MUI ToolPad 　：npm install -S @toolpad/core

試しに
・React-Chart-js :npm install --save chart.js react-chartjs-2
・date-Fns：npm install chartjs-adapter-date-fns

All done ：2024/10/04

バックエンド
・Firebase : Cotumo-beta-var2
npm install firebase

使用検討
・Zod
・npm timeStamp

使用Hooks
・useMemo
