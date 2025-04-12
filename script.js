function addTodo() {
    const input = document.getElementById("todoInput");
    const text = input.value;
    if (text === "") return;

    createTodoItem(text); // ← 新しいアイテムを作成
    saveTodos();          // ← 保存！

    input.value = "";
}

function saveTodos() {
    const todos = [];
    document.querySelectorAll("#todoList li").forEach((li) => {
        const checkbox = li.querySelector("input[type='checkbox']");
        const text = li.querySelector("span").textContent;
        todos.push({ text, done: checkbox.checked });
    });
    localStorage.setItem("todos", JSON.stringify(todos));
}

function loadTodos() {
    const todos = JSON.parse(localStorage.getItem("todos") || "[]");
    todos.forEach((todo) => {
        createTodoItem(todo.text, todo.done);
    });
}

function createTodoItem(text, done = false) {
    const li = document.createElement("li");
    li.classList.add("animate");

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = done;
    checkbox.onchange = () => {
        li.classList.toggle("checked", checkbox.checked);
        saveTodos(); // ✅ 状態が変わったら保存
    };

    const span = document.createElement("span");
    span.textContent = text.replace(/\n/g, "<br>");

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "削除";
    deleteBtn.onclick = () => {
        li.remove();
        saveTodos(); // ✅ 削除したら保存
    };

    li.appendChild(checkbox);
    li.appendChild(span);
    li.appendChild(deleteBtn);

    if (done) li.classList.add("checked");

    document.getElementById("todoList").appendChild(li);
}

window.onload = () => {
    loadTodos();
};

document.getElementById("pasteButton").addEventListener("click", () => {
navigator.clipboard.readText().then((text) => {
  if (text.trim()) {
    createTodoItem(text);  // TODOとして追加！
    saveTodos();
  } else {
    alert("クリップボードにテキストがありません");
  }
}).catch((err) => {
  alert("ペーストに失敗しました：" + err);
});
});


document.getElementById("clearAllButton").addEventListener("click", () => {
if (confirm("本当にすべて削除しますか？")) {
document.getElementById("todoList").innerHTML = ""; // リストを空に
localStorage.removeItem("todos"); // localStorageからも削除
}
});


document.getElementById("downloadCSV").addEventListener("click", () => {
// 1. localStorageからTODOを取得
const todos = JSON.parse(localStorage.getItem("todos") || "[]");

// 🔒 リストが空なら中止＆アラート
if (todos.length === 0) {
alert("TODOリストが空です。CSVをダウンロードできません。");
return;
}

// 2. CSV形式の文字列を作成
let csv = "タスク,完了\n";
todos.forEach(todo => {
const escapedTask = `"${todo.text.replace(/"/g, '""')}"`; // ダブルクオート対策
csv += `${escapedTask},${todo.done}\n`;
});

// 3. BlobでCSVファイルを作る
const blob = new Blob([csv], { type: "text/csv" });
const url = URL.createObjectURL(blob);

// 4. ダウンロードリンクを作って自動クリック
const a = document.createElement("a");
a.href = url;
a.download = "todo.csv";
a.click();

// 5. 後始末
URL.revokeObjectURL(url);
});
