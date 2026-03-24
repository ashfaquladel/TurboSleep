const routine = document.querySelectorAll("#routine input");
const progressBar = document.getElementById("progressBar");
const message = document.getElementById("message");
const button = document.getElementById("enableNotifications");

const MEAL_REMINDER_HOUR = 20;
const SLEEP_REMINDER_HOUR = 0;

loadState();
updateProgress();
startReminderSystem();

routine.forEach((checkbox, index) => {
checkbox.addEventListener("change", () => {
saveState();
updateProgress();
});
});

function updateProgress() {
let completed = 0;

routine.forEach(cb => {
if (cb.checked) completed++;
});

const percent = (completed / routine.length) * 100;
progressBar.style.width = percent + "%";

if (percent === 100) {
message.innerText = "Routine completed. Sleep peacefully 🌙";
} else {
message.innerText = "Stay consistent. Small habits change life.";
}
}

function saveState() {
const state = [];
routine.forEach(cb => state.push(cb.checked));
localStorage.setItem("turboSleepRoutine", JSON.stringify(state));
}

function loadState() {
const state = JSON.parse(localStorage.getItem("turboSleepRoutine"));
if (!state) return;
routine.forEach((cb, i) => cb.checked = state[i]);
}

// Notification permission
button.onclick = async () => {
const permission = await Notification.requestPermission();
if (permission === "granted") {
alert("Reminders enabled 🌙");
}
};

function startReminderSystem() {
setInterval(checkTime, 15000);
}

function checkTime() {
const now = new Date();
const hour = now.getHours();
const minute = now.getMinutes();

const mealSent = localStorage.getItem("mealReminderSent");
const sleepSent = localStorage.getItem("sleepReminderSent");

if (hour === MEAL_REMINDER_HOUR && minute <= 2 && !mealSent) {
notify("Avoid heavy meals for better sleep.");
localStorage.setItem("mealReminderSent", "true");
}

if (hour === SLEEP_REMINDER_HOUR && minute <= 2 && !sleepSent) {
notify("Time for your TurboSleep routine 🌙");
localStorage.setItem("sleepReminderSent", "true");
}

// reset flags daily
if (hour === 1 && minute === 0) {
localStorage.removeItem("mealReminderSent");
localStorage.removeItem("sleepReminderSent");
}
}

function notify(text) {
if (Notification.permission === "granted") {
new Notification("TurboSleep 🌙", {
body: text,
icon: "icon.png"
});
}
}

if ("serviceWorker" in navigator) {
navigator.serviceWorker.register("service-worker.js");
}
