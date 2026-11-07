function updateDateTime() {
  const now = new Date();
  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  const time = now.toLocaleTimeString();
  const date = now.toLocaleDateString('gu-IN', options);
  const el = document.getElementById('date-time');
  if (el) el.textContent = `${date} | ${time}`;
}

function initDateTimeBar() {
  updateDateTime();
  setInterval(updateDateTime, 1000);
}