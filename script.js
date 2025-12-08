// Dark / light theme toggle with localStorage
const root = document.documentElement;
const themeToggle = document.getElementById("theme-toggle");
const storedTheme = localStorage.getItem("theme");

if (storedTheme) {
  root.setAttribute("data-theme", storedTheme);
  updateToggleLabel(storedTheme);
}

themeToggle.addEventListener("click", () => {
  const current = root.getAttribute("data-theme") || "dark";
  const next = current === "dark" ? "light" : "dark";
  root.setAttribute("data-theme", next);
  localStorage.setItem("theme", next);
  updateToggleLabel(next);
});

function updateToggleLabel(theme) {
  if (!themeToggle) return;
  themeToggle.textContent = theme === "dark" ? "☾" : "☼";
}

// Footer year
const yearSpan = document.getElementById("year");
if (yearSpan) {
  yearSpan.textContent = new Date().getFullYear();
}

// Copy contact template
function copyContactTemplate() {
  const textarea = document.getElementById("contact-template");
  const status = document.getElementById("copy-status");
  if (!textarea) return;

  textarea.select();
  textarea.setSelectionRange(0, 99999); // mobile

  try {
    document.execCommand("copy");
    if (status) {
      status.textContent = "Template copied. Paste it into your email client.";
    }
  } catch (e) {
    if (status) {
      status.textContent = "Could not copy automatically. Please select and copy manually.";
      status.style.color = "var(--danger)";
    }
  }
}

window.copyContactTemplate = copyContactTemplate;
