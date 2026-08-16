const express = require("express");
const app = express();
const PORT = 3000;

const { executeQuery, closePool } = require("./db");

app.use(express.json());

function handleServerError(res, error, message = "サーバーエラー") {
  console.error(error);
  res.status(500).json({ error: message });
}

app.post("/todos", async (req, res) => {
  const { title, priority } = req.body;
  try {
    const result = await executeQuery("INSERT INTO todos (title, priority) VALUES (?, ?);", [title, priority]);
    res.status(201).json({ id: result.insertId, title, priority });
  } catch (err) {
    handleServerError(res, err, "todo追加に失敗しました");
  }
});

app.get("/todos", async (req, res) => {
  try {
    const rows = await executeQuery("SELECT * FROM todos;");
    res.status(200).json(rows);
  } catch (err) {
    handleServerError(res, err);
  }
});

app.put("/todos/:id", async (req, res) => {
  const { title, priority, status } = req.body;
  try {
    const result = await executeQuery("UPDATE todos SET title = ?, priority = ?, status = ? WHERE id = ?;", [title, priority, status, req.params.id]);

    result.affectedRows === 0 ? res.status(404).json({ error: "更新対象のtodoが見つかりません" }) : res.status(200).json({ id: req.params.id, title, priority, status });
  } catch (err) {
    handleServerError(res, err, "todo更新に失敗しました");
  }
});

app.delete("/todos/:id", async (req, res) => {
  try {
    const result = await executeQuery("DELETE FROM todos WHERE id = ?;", [req.params.id]);

    result.affectedRows === 0 ? res.status(404).json({ error: "削除対象のtodoが見つかりません" }) : res.status(200).json({ message: "todoを削除しました" });
  } catch (err) {
    handleServerError(res, err, "todoの削除に失敗しました");
  }
});

// アプリ終了時にDB接続プールを安全に破棄する
["SIGINT", "SIGTERM", "SIGHUP"].forEach((signal) => {
  process.on(signal, async () => {
    console.log(`\n${signal}を受信。アプリケーションの終了処理中...`);
    await closePool();
    process.exit();
  });
});

// Webサーバーを起動
app.listen(PORT, () => {
  console.log(`${PORT}番ポートでWebサーバーが起動しました。`);
});
