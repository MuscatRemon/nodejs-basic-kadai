// 外部データを取得
async function fetchData() {
  console.log("ユーザーデータの取得を開始します。");
  try {
    const res = await fetch("https://jsonplaceholder.typicode.com/users");
    const users = await res.json();

    console.log(`データ取得が完了しました。取得件数：${users.length}`);

    console.log("ユーザー一覧：");

    users.forEach((user) => {
      console.log(user.name);
    });

    console.log("ユーザーデータの取得が終了しました。");
  } catch (error) {
    console.error("エラー発生：", error);
  }
}

console.log("fetchData()関数を実行します。");
fetchData();
console.log("fetchData()関数を実行しました。");

let count = 1;
const interval = setInterval(() => {
  console.log(`別の処理を実行中... ${count++}`);
  if (count > 10) clearInterval(interval);
}, 10);
