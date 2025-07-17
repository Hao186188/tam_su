// 🌌 Canvas setup
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// 🔊 Nhạc nền
const music = document.getElementById("bgMusic");
const toggleBtn = document.getElementById("musicToggle");

if (toggleBtn && music) {
  music.volume = 0.3;

  toggleBtn.onclick = () => {
    if (music.paused) {
      music.play().catch(() => {});
      toggleBtn.textContent = "🔈 Tắt nhạc";
    } else {
      music.pause();
      toggleBtn.textContent = "🔇 Bật nhạc";
    }
  };

  // ✅ Autoplay sau lần click đầu
  document.body.addEventListener("click", () => {
    if (music.paused) music.play().catch(() => {});
  }, { once: true });
}

// ✍️ Nội dung
const texts = [
  "Cậu có biết không?",
  "Trong cuộc sống này, mọi thứ vẫn đang lén lút yêu thương cậu.",
  "Hãy để tình yêu chữa lành mọi vết thương của cậu.",
  "Và nếu điều đó vẫn không đủ thì cậu hãy tâm sự với mình.",
  "Vì cậu không cô đơn, mình sẽ luôn ở bên cậu.",
];

let textIndex = 0, charIndex = 0;
const speed = 50, delayBetweenParagraphs = 1000;
const audio = new Audio("assets/keypress.mp3");
audio.volume = 0.4;

const typewriterEl = document.getElementById("typewriter");
const letterBox = document.querySelector('.letter');
const channel = new BroadcastChannel("tam_su_channel");

function typeNext() {
  if (textIndex < texts.length) {
    if (charIndex < texts[textIndex].length) {
      const char = texts[textIndex].charAt(charIndex);
      typewriterEl.innerHTML += char;

      if (char !== " ") {
        audio.pause();
        audio.currentTime = 0;
        audio.play().catch(() => {});
      }

      letterBox.scrollTop = letterBox.scrollHeight;
      charIndex++;
      setTimeout(typeNext, speed);
    } else {
      typewriterEl.innerHTML += "<br><br>";
      textIndex++;
      charIndex = 0;
      setTimeout(typeNext, delayBetweenParagraphs);
    }
  }
}

// 💗 Hiệu ứng trái tim
function createHeart() {
  const heart = document.createElement('div');
  heart.className = 'heart';
  heart.style.left = Math.random() * 100 + 'vw';
  heart.style.animationDuration = Math.random() * 2 + 3 + 's';
  document.body.appendChild(heart);
  setTimeout(() => heart.remove(), 6000);
}

// ✨ Lấp lánh
function createSparkle() {
  const sparkle = document.createElement('div');
  sparkle.className = 'sparkle';
  sparkle.style.left = Math.random() * canvas.width + 'px';
  sparkle.style.top = Math.random() * canvas.height + 'px';
  document.body.appendChild(sparkle);
  setTimeout(() => sparkle.remove(), 3000);
}

// 🌟 Sao nền
function drawStars() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (let i = 0; i < 100; i++) {
    const x = Math.random() * canvas.width;
    const y = Math.random() * canvas.height;
    const size = Math.random() * 2;
    ctx.beginPath();
    ctx.arc(x, y, size, 0, Math.PI * 2);
    ctx.fill();
  }
}

function startDecor() {
  setInterval(createHeart, 300);
  setInterval(createSparkle, 500);
  setInterval(drawStars, 100);
}

// 🧁 Toast
function showToast(message) {
  const toast = document.createElement("div");
  toast.className = "toast";
  toast.innerHTML = `
    <div class="toast-icon">💌</div>
    <div class="toast-message">${message}</div>
    <a href="https://www.facebook.com/tranthanhhoang186207" target="_blank" class="toast-btn">Liên hệ tớ</a>
  `;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 5000);
}

// 💌 Gửi lời nhắn
function saveMessage() {
  const textarea = document.getElementById("userMessage");
  const btn = textarea?.nextElementSibling;
  const message = textarea?.value.trim();

  if (!message) {
    alert("Viết gì đó trước khi gửi nhé!");
    return;
  }

  btn.disabled = true;
  btn.innerText = "Đang gửi...";

  const saved = localStorage.getItem("messages") || "[]";
  const messages = JSON.parse(saved);
  const newMsg = {
    id: Date.now(),
    time: new Date().toLocaleString(),
    content: message
  };

  messages.push(newMsg);
  localStorage.setItem("messages", JSON.stringify(messages));

  // Gửi sang trang quản lý nếu đang mở
  channel.postMessage(newMsg);

  showToast("💖 Tâm sự của cậu đã được lưu lại! Có gì thì liên hệ tớ ở Facebook nha 💬");

  textarea.value = "";
  btn.disabled = false;
  btn.innerText = "Gửi tâm sự";

  letterBox?.classList.add("sent");
  setTimeout(() => letterBox?.classList.remove("sent"), 1000);
}

// 🗂 TXT
function downloadText() {
  const messages = JSON.parse(localStorage.getItem("messages") || "[]");
  if (!messages.length) return alert("Chưa có lời tâm sự nào để tải 😢");

  const content = messages.map(m => `🕒 ${m.time}\n${m.content}`).join("\n\n---\n\n");
  const blob = new Blob([content], { type: "text/plain" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "loi_tam_su.txt";
  a.click();
}

// 🗃 JSON
function downloadJSON() {
  const data = localStorage.getItem("messages");
  if (!data || data === "[]") return alert("Không có dữ liệu để tải 😢");

  const blob = new Blob([data], { type: "application/json" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "tam_su.json";
  a.click();
}

// 📤 Toggle form
function toggleForm() {
  const form = document.getElementById("form-container");
  if (form) {
    form.style.display = (form.style.display === "none" || !form.style.display)
      ? "block" : "none";
  }
}

// 🚀 Start
window.onload = () => {
  typeNext();
  startDecor();
};
// // 🗣️ Nhận tin nhắn từ trang quản lý
// channel.onmessage = (event) => {
//   const message = event.data;
//   if (message && message.content) {
//     showToast("💌 Có lời tâm sự mới từ trang quản lý!");
//     loadMessages(); // Cập nhật danh sách tin nhắn
//   }
// };
