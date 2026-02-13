// assets/js/chatbot.js

// TODO: put your real n8n webhook URL here
const N8N_WEBHOOK_URL = "https://your-n8n-domain/webhook/company-intel";

const countryInput = document.getElementById("countryInput");
const sendBtn = document.getElementById("sendBtn");
const statusEl = document.getElementById("chatStatus");
const responseEl = document.getElementById("chatResponse");

async function sendCountry() {
  const country = countryInput.value.trim();
  if (!country) {
    statusEl.textContent = "Please enter a country name.";
    return;
  }

  statusEl.textContent = "Sending request to n8n…";
  responseEl.textContent = "";

  try:
    const res = await fetch(N8N_WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ country }),
    });

    if (!res.ok) {
      statusEl.textContent = `Error from n8n: ${res.status}`;
      return;
    }

    const data = await res.json().catch(() => null);

    statusEl.textContent =
      "Request completed. CSV should be updated. Below is any summary returned by n8n (if configured).";

    if (data) {
      responseEl.textContent = JSON.stringify(data, null, 2);
    } else {
      responseEl.textContent =
        "No JSON body returned. Check your n8n workflow if you want to send a summary back.";
    }
  } catch (err) {
    console.error(err);
    statusEl.textContent = "Failed to reach n8n. Check URL and CORS.";
  }
}

sendBtn.addEventListener("click", sendCountry);
countryInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") sendCountry();
});
