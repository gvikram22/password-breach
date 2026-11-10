const form = document.getElementById("check-form");
const passwordInput = document.getElementById("password");
const toggle = document.getElementById("toggle");
const submit = document.getElementById("submit");
const result = document.getElementById("result");

toggle.addEventListener("click", () => {
  const showing = passwordInput.type === "text";
  passwordInput.type = showing ? "password" : "text";
  toggle.textContent = showing ? "Show" : "Hide";
});

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  const password = passwordInput.value;
  if (!password) return;
  result.innerHTML = "";
  submit.disabled = true;
  submit.textContent = "Checking…";
  try {
    const response = await fetch("/api/password/check", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password })
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || "Check failed");
    const card = document.createElement("div");
    card.className = `result-card ${data.exposed ? "danger" : ""}`;
    const heading = document.createElement("h2");
    heading.textContent = data.exposed ? "⚠️ Oh no — exposed!" : "✓ Good news — no match found";
    const count = document.createElement("div");
    count.className = "count";
    count.textContent = data.exposed ? `${data.count.toLocaleString()} times` : "0 times";
    const detail = document.createElement("p");
    detail.textContent = data.message;
    const recommendation = document.createElement("p");
    recommendation.textContent = data.recommendation;
    card.append(heading, count, detail, recommendation);
    result.append(card);
  } catch (error) {
    const p = document.createElement("p");
    p.textContent = error.message || "Could not check password. Try again.";
    p.style.color = "#ffb7bd";
    result.append(p);
  } finally {
    submit.disabled = false;
    submit.innerHTML = 'Check password <span>→</span>';
    passwordInput.value = "";
    passwordInput.type = "password";
    toggle.textContent = "Show";
  }
});
