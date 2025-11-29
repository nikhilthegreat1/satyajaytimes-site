// ---- CONFIG ----
const LAT = 28.4089;  // Faridabad latitude
const LON = 77.3178;  // Faridabad longitude

// For now leave blank, later you will add keys
const OPENWEATHER_API_KEY = "YOUR_OPENWEATHER_KEY_HERE";
const AQI_API_TOKEN = "YOUR_AQICN_TOKEN_HERE";

// ---- DATE & TIME ----
function updateDateTime() {
  const now = new Date();

  const dateOptions = { day: "2-digit", month: "long", year: "numeric" };
  const timeOptions = { hour: "2-digit", minute: "2-digit", hour12: false };

  const dateEl = document.getElementById("date-now");
  const timeEl = document.getElementById("time-now");

  if (dateEl) dateEl.textContent = now.toLocaleDateString("hi-IN", dateOptions);
  if (timeEl) timeEl.textContent = now.toLocaleTimeString("hi-IN", timeOptions);
}

// ---- WEATHER TEMP ----
async function fetchTemperature() {
  const tempEl = document.getElementById("temp-value");
  if (!tempEl || !OPENWEATHER_API_KEY || OPENWEATHER_API_KEY.includes("YOUR_OPENWEATHER")) {
    tempEl.textContent = "--°C";
    return;
  }

  try {
    const url =
      `https://api.openweathermap.org/data/2.5/weather?lat=${LAT}&lon=${LON}` +
      `&units=metric&lang=hi&appid=${OPENWEATHER_API_KEY}`;

    const res = await fetch(url);
    if (!res.ok) throw new Error("Weather API error");
    const data = await res.json();
    const temp = Math.round(data.main.temp);
    tempEl.textContent = `${temp}°C`;
  } catch (err) {
    console.error(err);
    tempEl.textContent = "--°C";
  }
}

// ---- AQI ----
async function fetchAQI() {
  const aqiEl = document.getElementById("aqi-value");
  if (!aqiEl || !AQI_API_TOKEN || AQI_API_TOKEN.includes("YOUR_AQICN")) {
    aqiEl.textContent = "--";
    return;
  }

  try {
    const url = `https://api.waqi.info/feed/geo:${LAT};${LON}/?token=${AQI_API_TOKEN}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error("AQI API error");
    const data = await res.json();

    if (data.status !== "ok") throw new Error("AQI status not ok");

    const aqi = data.data.aqi;
    let label = "";

    if (aqi <= 50) label = " (अच्छा)";
    else if (aqi <= 100) label = " (मध्यम)";
    else if (aqi <= 200) label = " (खराब)";
    else label = " (बहुत खराब)";

    aqiEl.textContent = `${aqi}${label}`;
  } catch (err) {
    console.error(err);
    aqiEl.textContent = "--";
  }
}

// ---- POPUP ----
function setupPopup() {
  const popup = document.getElementById("today-popup");
  const closeX = document.getElementById("popup-close-x");
  const closeBtn = document.getElementById("close-popup");

  if (!popup) return;

  window.addEventListener("load", () => {
    popup.classList.add("show");
  });

  function closePopup() {
    popup.classList.remove("show");
  }

  if (closeX) closeX.addEventListener("click", closePopup);
  if (closeBtn) closeBtn.addEventListener("click", closePopup);
}

// ---- NAV ACTIVE ----
function setupNavActive() {
  const links = document.querySelectorAll(".nav-item a");
  links.forEach((link) => {
    link.addEventListener("click", (e) => {
      links.forEach((l) => l.classList.remove("active"));
      e.target.classList.add("active");
    });
  });
}

// ---- INIT ----
document.addEventListener("DOMContentLoaded", () => {
  updateDateTime();
  setInterval(updateDateTime, 60 * 1000);

  fetchTemperature();
  fetchAQI();

  const yearEl = document.getElementById("year-now");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  setupPopup();
  setupNavActive();
});
