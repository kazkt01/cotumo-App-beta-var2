import { Button } from "@mui/material";

function QandA() {
  return (
    <div>
      <div style={{ textAlign: "center" }}>
        <h1>Q & A</h1>
        <p>前文</p>
        <p>
          このアプリは、日々の習慣を可視化することで <br />
          習慣の管理や行動の見直しを促す為に作成しました。
        </p>
        <h2>使い方</h2>
        <p>
          1
          毎回何かした習慣を始める前にHomeにあるカテゴリを選択し開始のタイムスタンプをクリック
        </p>
        <p>
          2,終了と同時に終了用のタイムスタンプをクリックするとその日の習慣に要した時間が算出され表示されます
        </p>
        <p>
          3,カレンダーアイコンや折れ線グラフのアイコンをクリックするといつどんな習慣を何時間したかが見えるようになっています
        </p>
        <h2>お問い合わせ</h2>
        <p>ご質問等ございましたら以下のページへご連絡ださい</p>
        <a href="" target="_blank">
          <Button>作者の連絡先</Button>
        </a>
      </div>
    </div>
  );
}

export default QandA;
