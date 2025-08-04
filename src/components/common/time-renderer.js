const time = document.querySelector("time");

setInterval(updateClock, 60000);
updateClock();

function updateClock() {
  const now = new Date();
  const hour = String(now.getHours()).padStart(2, "0");
  const minute = String(now.getMinutes()).padStart(2, "0");
  let ampm = "AM";
  if (Number(hour) >= 12) ampm = "PM";
  const timeString = `${hour}:${minute}<span>${ampm}</span>`;

  time.innerHTML = timeString;
}
