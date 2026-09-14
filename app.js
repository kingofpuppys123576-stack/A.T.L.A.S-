const orb = document.getElementById("orb");
const statusEl = document.getElementById("status");
const promptEl = document.getElementById("prompt");
const conversation = document.getElementById("conversation");
const form = document.getElementById("chatForm");
const input = document.getElementById("messageInput");

const ATLAS_CORE =
  "https://atlas-core.kingofpuppys123576.workers.dev/";

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

async function speak(text) {
  try {
    const response = await fetch(`${ATLAS_CORE}voice`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        text: text
      })
    });

    if (!response.ok) {
      throw new Error(`ATLAS Voice returned ${response.status}`);
    }

    const audioBlob = await response.blob();
    const audioUrl = URL.createObjectURL(audioBlob);
    const audio = new Audio(audioUrl);

    audio.addEventListener("ended", () => {
      URL.revokeObjectURL(audioUrl);
    });

    await audio.play();

  } catch (error) {
    console.error("ATLAS Voice error:", error);
  }
}

async function askAtlas(text) {
  statusEl.textContent = "THINKING";
  promptEl.textContent = "Processing…";

  try {
    const response = await fetch(ATLAS_CORE, {
      method: "POST",

      headers: {
        "Content-Type": "application/json"
      },

      body: JSON.stringify({
        message: text
      })
    });

    if (!response.ok) {
      throw new Error(`ATLAS Core returned ${response.status}`);
    }

    const data = await response.json();

    const reply =
      data.reply || "ATLAS Core did not return a response.";

    addMessage("ATLAS", reply);
    speak(reply);

    statusEl.textContent = "READY";
    promptEl.textContent = "Tap to speak";

  } catch (error) {
    console.error(error);

    const reply =
      "I couldn't establish a connection with ATLAS Core.";

    addMessage("ATLAS", reply);
    speak(reply);

    statusEl.textContent = "CONNECTION ERROR";
    promptEl.textContent = "Core unavailable";
  }
}

form.addEventListener("submit", (event) => {
  event.preventDefault();

  const text = input.value.trim();

  if (!text) return;

  addMessage("YOU", text);
  input.value = "";

  askAtlas(text);
});

const SpeechRecognition =
  window.SpeechRecognition ||
  window.webkitSpeechRecognition;

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

  recognition.onresult = (event) => {
    const text =
      event.results[0][0].transcript;

    addMessage("YOU", text);

    askAtlas(text);
  };

  recognition.onend = () => {
    orb.classList.remove("listening");

    if (statusEl.textContent === "LISTENING") {
      statusEl.textContent = "READY";
      promptEl.textContent = "Tap to speak";
    }
  };

  recognition.onerror = () => {
    orb.classList.remove("listening");

    statusEl.textContent = "VOICE ERROR";
    promptEl.textContent = "Use text or try again";
  };

} else {

  orb.addEventListener("click", () => {
    addMessage(
      "ATLAS",
      "Speech recognition isn't available in this browser. You can still type to me."
    );
  });
}

if ("serviceWorker" in navigator) {
  navigator.serviceWorker
    .register("./sw.js")
    .catch(console.error);
}
