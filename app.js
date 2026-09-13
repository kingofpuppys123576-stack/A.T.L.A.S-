const orb = document.getElementById("orb");
const statusEl = document.getElementById("status");
const promptEl = document.getElementById("prompt");
const conversation = document.getElementById("conversation");
const form = document.getElementById("chatForm");
const input = document.getElementById("messageInput");

function addMessage(role, text) {
  const box = document.createElement("div");
  box.className = `message ${role === "YOU" ? "user" : "atlas"}`;
  const label = document.createElement("span");
  label.textContent = role;
  const p = document.createElement("p");
  p.textContent = text;
  box.append(label, p);
  conversation.appendChild(box);
  conversation.scrollTop = conversation.scrollHeight;
}

function speak(text) {
  if (!("speechSynthesis" in window)) return;
  speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.rate = 0.95;
  u.pitch = 0.9;
  speechSynthesis.speak(u);
}

function localReply(text) {
  const reply = `I heard: "${text}". My voice interface is working. Connect my AI backend next so I can answer questions and use tools.`;
  addMessage("ATLAS", reply);
  speak(reply);
}

form.addEventListener("submit", e => {
  e.preventDefault();
  const text = input.value.trim();
  if (!text) return;
  addMessage("YOU", text);
  input.value = "";
  localReply(text);
});

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
if (SpeechRecognition) {
  const recognition = new SpeechRecognition();
  recognition.lang = "en-US";
  recognition.interimResults = false;
  recognition.continuous = false;

  orb.addEventListener("click", () => {
    try {
      recognition.start();
      orb.classList.add("listening");
      statusEl.textContent = "LISTENING";
      promptEl.textContent = "Listening…";
    } catch {}
  });

  recognition.onresult = e => {
    const text = e.results[0][0].transcript;
    addMessage("YOU", text);
    localReply(text);
  };

  recognition.onend = () => {
    orb.classList.remove("listening");
    statusEl.textContent = "READY";
    promptEl.textContent = "Tap to speak";
  };

  recognition.onerror = () => {
    orb.classList.remove("listening");
    statusEl.textContent = "VOICE ERROR";
    promptEl.textContent = "Use text or try again";
  };
} else {
  orb.addEventListener("click", () => {
    addMessage("ATLAS", "This browser does not expose speech recognition here. Text chat still works.");
  });
}

if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("./sw.js").catch(() => {});
}