const countdownEl = document.querySelector('.countdown');
const statusPill = document.getElementById('statusPill');

function pad(value) {
  return String(value).padStart(2, '0');
}

function setCountdownValues(days, hours, minutes, seconds) {
  document.getElementById('days').textContent = pad(days);
  document.getElementById('hours').textContent = pad(hours);
  document.getElementById('minutes').textContent = pad(minutes);
  document.getElementById('seconds').textContent = pad(seconds);
}

function runCountdown() {
  if (!countdownEl) return;

  const targetDateValue = countdownEl.dataset.targetDate;
  const targetDate = new Date(targetDateValue);

  if (Number.isNaN(targetDate.getTime())) {
    setCountdownValues(0, 0, 0, 0);
    return;
  }

  function update() {
    const now = new Date();
    const diff = targetDate.getTime() - now.getTime();

    if (diff <= 0) {
      setCountdownValues(0, 0, 0, 0);
      statusPill.textContent = 'EVENT STATUS: LIVE NOW';
      return;
    }

    const totalSeconds = Math.floor(diff / 1000);
    const days = Math.floor(totalSeconds / 86400);
    const hours = Math.floor((totalSeconds % 86400) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    setCountdownValues(days, hours, minutes, seconds);
  }

  update();
  setInterval(update, 1000);
}

function runRevealAnimations() {
  const revealItems = document.querySelectorAll('.reveal');
  if (!('IntersectionObserver' in window)) {
    revealItems.forEach((item) => item.classList.add('visible'));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.14 }
  );

  revealItems.forEach((item) => observer.observe(item));
}

function runStatusTicker() {
  if (!statusPill) return;

  const messages = [
    'SEAL INTEGRITY: UNSTABLE',
    'DEEP SCAN: ORB SIGNAL FOUND',
    'OVERWORLD ENERGY SPIKE: +12%',
    'UNDERGROUND CHAMBER: PARTIALLY OPEN',
    'WARDENED ZONE: BREACH RISK HIGH'
  ];

  let index = 0;
  setInterval(() => {
    index = (index + 1) % messages.length;
    statusPill.textContent = messages[index];
  }, 3200);
}

runCountdown();
runRevealAnimations();
runStatusTicker();
