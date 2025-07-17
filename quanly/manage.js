// manage.js
const correctPassword = "yeuthuong123"; // 🔐 Mật khẩu quản lý

function verifyPassword() {
  const input = document.getElementById("adminPass").value;
  if (input === correctPassword) {
    document.getElementById("authBox").style.display = "none";
    document.getElementById("adminPanel").style.display = "block";
    loadMessages();
  } else {
    alert("Sai mật khẩu 🛑");
  }
}

// 🔄 Hiển thị danh sách tin nhắn
function loadMessages() {
  const saved = localStorage.getItem("messages");
  const container = document.getElementById("messageList");
  container.innerHTML = "";

  if (saved) {
    const messages = JSON.parse(saved);
    if (messages.length === 0) {
      container.innerHTML = "<p>Chưa có lời tâm sự nào 🫧</p>";
      return;
    }

    messages.forEach((msg, i) => {
      const div = document.createElement("div");
      div.classList.add("message-item");
      div.innerHTML = `
        <p><strong>🕒 ${msg.time}</strong><br>${msg.content}</p>
        <button onclick="deleteMessage(${i})">❌ Xóa</button>
      `;
      container.appendChild(div);
    });
  } else {
    container.innerHTML = "<p>Chưa có lời tâm sự nào 🫧</p>";
  }
}

// ❌ Xóa 1 lời nhắn
function deleteMessage(index) {
  const saved = JSON.parse(localStorage.getItem("messages") || "[]");
  saved.splice(index, 1);
  localStorage.setItem("messages", JSON.stringify(saved));
  loadMessages();
}

// 🧹 Xóa tất cả lời nhắn
function clearMessages() {
  if (confirm("Bạn chắc chắn muốn xóa hết tất cả lời tâm sự?")) {
    localStorage.removeItem("messages");
    loadMessages();
  }
}

// 📥 Tải về TXT hoặc JSON
function downloadMessages(type) {
  const saved = localStorage.getItem("messages");
  if (!saved || saved === "[]") return alert("Không có gì để tải 😢");

  const messages = JSON.parse(saved);
  const content =
    type === "json"
      ? JSON.stringify(messages, null, 2)
      : messages.map(m => `🕒 ${m.time}\n${m.content}`).join("\n\n---\n\n");

  const blob = new Blob([content], { type: "text/plain" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "loi_tam_su." + (type === "json" ? "json" : "txt");
  link.click();
}
