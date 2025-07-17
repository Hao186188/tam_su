// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyBHad6ioqBubsp0WgHIBjTUkwVn3dBvQDA",
  authDomain: "loi-tam-su.firebaseapp.com",
  databaseURL: "https://loi-tam-su-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "loi-tam-su",
  storageBucket: "loi-tam-su.firebasestorage.app",
  messagingSenderId: "33789310306",
  appId: "1:33789310306:web:d24429a9576f93a86d283b",
  measurementId: "G-JNL3CWT41P"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.database();

const correctPassword = "yeuthuong123"; // 🔐 Mật khẩu quản lý

function verifyPassword() {
  const input = document.getElementById("adminPass").value.trim();
  if (input === correctPassword) {
    document.getElementById("authBox").style.display = "none";
    document.getElementById("adminPanel").style.display = "block";
    loadMessages();
  } else {
    alert("Sai mật khẩu 🛑");
  }
}

// 🔄 Tải lời tâm sự từ Firebase
function loadMessages() {
  const list = document.getElementById("messageList");
  list.innerHTML = "<p>⏳ Đang tải lời tâm sự...</p>";

  db.ref("messages").on("value", snapshot => {
    const data = snapshot.val();
    list.innerHTML = "";

    if (data) {
      Object.entries(data).reverse().forEach(([key, msg]) => {
        const item = document.createElement("div");
        item.className = "message-item";
        item.innerHTML = `
          <p><strong>🕒 ${msg.time}</strong></p>
          <p>${msg.content}</p>
          <button onclick="deleteMessage('${key}')">❌ Xóa</button>
        `;
        list.appendChild(item);
      });
    } else {
      list.innerHTML = "<p>😢 Chưa có lời tâm sự nào.</p>";
    }
  });
}

// ❌ Xóa lời nhắn riêng
function deleteMessage(id) {
  if (confirm("Bạn chắc muốn xóa lời tâm sự này?")) {
    db.ref("messages/" + id).remove();
  }
}

// 🧹 Xóa toàn bộ lời nhắn
function clearMessages() {
  if (confirm("Bạn chắc chắn muốn xóa hết tất cả lời tâm sự không?")) {
    db.ref("messages").remove();
  }
}

// 📥 Tải lời tâm sự về TXT hoặc JSON
function downloadMessages(type) {
  db.ref("messages").once("value").then(snapshot => {
    const data = snapshot.val();
    if (!data) return alert("Không có gì để tải 😢");

    const messages = Object.values(data);
    const content =
      type === "json"
        ? JSON.stringify(messages, null, 2)
        : messages.map(m => `🕒 ${m.time}\n${m.content}`).join("\n\n---\n\n");

    const blob = new Blob([content], { type: "text/plain" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "tam_su." + (type === "json" ? "json" : "txt");
    link.click();
  });
}
