const copyIpBtn = document.getElementById('copyIpBtn');
const serverIp = document.getElementById('serverIp');
const canvas = document.getElementById('embers');

const hero = document.querySelector('.hero');
const heroStone = document.querySelector('.hero-stone');
const heroContent = document.querySelector('.hero-content');
const heroTitle = document.getElementById('heroTitle');
const heroSub = document.getElementById('heroSub');

const stateSection = document.getElementById('state');
const worldStabilityEl = document.getElementById('worldStability');
const undeadActivityEl = document.getElementById('undeadActivity');
const artifactEnergyEl = document.getElementById('artifactEnergy');
const stabilityBarEl = document.getElementById('stabilityBar');

const revealArtifactBtn = document.getElementById('revealArtifactBtn');
const artifactCard = document.getElementById('artifactCard');
const containmentPanel = document.getElementById('containmentPanel');

function runReveal() {
  const items = document.querySelectorAll('.reveal');

  if (!('IntersectionObserver' in window)) {
    items.forEach((item) => item.classList.add('visible'));
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

  items.forEach((item) => observer.observe(item));
}

async function copyIp() {
  if (!copyIpBtn || !serverIp) return;

  const ip = serverIp.textContent.trim();

  try {
    await navigator.clipboard.writeText(ip);
    copyIpBtn.textContent = 'Copied';
  } catch (error) {
    copyIpBtn.textContent = ip;
  }

  setTimeout(() => {
    copyIpBtn.textContent = 'Copy IP';
  }, 1200);
}

function setupCopyButton() {
  if (!copyIpBtn) return;
  copyIpBtn.addEventListener('click', copyIp);
}

function runWorldState() {
  if (!worldStabilityEl || !undeadActivityEl || !artifactEnergyEl || !stabilityBarEl || !stateSection) return;

  const initialStability = 81;
  const collapseDate = new Date('2026-03-01T00:00:00');
  const startedAt = Date.now();
  const runDuration = Math.max(1, collapseDate.getTime() - startedAt);

  function update() {
    const now = Date.now();
    const remaining = collapseDate.getTime() - now;

    let stability = 0;
    if (remaining > 0) {
      stability = Math.ceil((remaining / runDuration) * initialStability);
      stability = Math.max(0, Math.min(initialStability, stability));
    }

    worldStabilityEl.textContent = `${stability}%`;
    stabilityBarEl.style.width = `${(stability / initialStability) * 100}%`;

    stateSection.classList.remove('world-warning', 'world-critical');

    if (stability > 55) {
      undeadActivityEl.textContent = 'Low';
      artifactEnergyEl.textContent = 'Increasing';
    } else if (stability > 30) {
      undeadActivityEl.textContent = 'Moderate';
      artifactEnergyEl.textContent = 'Surging';
      stateSection.classList.add('world-warning');
    } else if (stability > 0) {
      undeadActivityEl.textContent = 'High';
      artifactEnergyEl.textContent = 'Critical';
      stateSection.classList.add('world-critical');
    } else {
      undeadActivityEl.textContent = 'Severe';
      artifactEnergyEl.textContent = 'Unbound';
      stateSection.classList.add('world-critical');
    }
  }

  update();
  setInterval(update, 1000);
}

function spawnSoulSparks(targetEl = containmentPanel, count = 20, spread = 1) {
  if (!targetEl) return;

  const rect = targetEl.getBoundingClientRect();

  for (let i = 0; i < count; i += 1) {
    const spark = document.createElement('span');
    spark.className = 'soul-spark';
    spark.style.left = `${Math.random() * rect.width}px`;
    spark.style.top = `${Math.random() * rect.height * spread}px`;
    spark.style.animationDelay = `${Math.random() * 220}ms`;
    spark.style.animationDuration = `${700 + Math.random() * 500}ms`;
    targetEl.appendChild(spark);

    setTimeout(() => {
      spark.remove();
    }, 1400);
  }
}

function revealContainmentNotice() {
  if (!containmentPanel) return;

  containmentPanel.hidden = false;
  containmentPanel.classList.remove('glitch-in');
  void containmentPanel.offsetWidth;
  containmentPanel.classList.add('glitch-in');

  if (artifactCard) {
    artifactCard.classList.remove('reveal-active');
    void artifactCard.offsetWidth;
    artifactCard.classList.add('reveal-active');
  }

  spawnSoulSparks(containmentPanel, 42, 1);
}

function setupArtifactReveal() {
  if (!revealArtifactBtn) return;

  let ambientInterval;

  revealArtifactBtn.addEventListener('click', () => {
    revealContainmentNotice();

    if (ambientInterval) {
      clearInterval(ambientInterval);
    }

    ambientInterval = setInterval(() => {
      if (containmentPanel && !containmentPanel.hidden) {
        spawnSoulSparks(containmentPanel, 6, 0.9);
      }
    }, 520);

    revealArtifactBtn.textContent = 'Signal Intercepted';
    setTimeout(() => {
      revealArtifactBtn.textContent = 'Press to Reveal';
    }, 1200);
  });
}

function setupButtonRipples() {
  const buttons = document.querySelectorAll('.btn');

  buttons.forEach((button) => {
    button.addEventListener('click', (event) => {
      const rect = button.getBoundingClientRect();
      const ripple = document.createElement('span');
      ripple.className = 'ripple';
      const size = Math.max(rect.width, rect.height);
      ripple.style.width = `${size}px`;
      ripple.style.height = `${size}px`;
      ripple.style.left = `${event.clientX - rect.left - size / 2}px`;
      ripple.style.top = `${event.clientY - rect.top - size / 2}px`;
      button.appendChild(ripple);

      setTimeout(() => {
        ripple.remove();
      }, 660);
    });
  });
}

function runTiltCards() {
  const cards = document.querySelectorAll('.tilt');

  cards.forEach((card) => {
    card.addEventListener('mousemove', (event) => {
      const rect = card.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;

      const rotateX = y * -5;
      const rotateY = x * 6;

      card.style.transform = `perspective(850px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-2px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(850px) rotateX(0deg) rotateY(0deg) translateY(0)';
    });
  });
}

function runHeroParallax() {
  if (!hero || !heroStone || !heroContent) return;

  hero.addEventListener('mousemove', (event) => {
    const rect = hero.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;

    heroStone.style.transform = `translate(${x * -16}px, ${y * -12}px) scale(1.03)`;
    heroContent.style.transform = `translate(${x * 9}px, ${y * 7}px)`;
  });

  hero.addEventListener('mouseleave', () => {
    heroStone.style.transform = 'translate(0, 0) scale(1)';
    heroContent.style.transform = 'translate(0, 0)';
  });
}

function runMouseAura() {
  window.addEventListener('mousemove', (event) => {
    const mx = (event.clientX / window.innerWidth) * 100;
    const my = (event.clientY / window.innerHeight) * 100;

    document.documentElement.style.setProperty('--mx', `${mx}%`);
    document.documentElement.style.setProperty('--my', `${my}%`);
  });
}

function runHeroSubCycle() {
  if (!heroSub) return;

  const lines = [
    'A survival world where control is taken, tested, and remembered.',
    'Major conflict leaves marks that do not reset.',
    'Every alliance matters when stability collapses.'
  ];

  let lineIndex = 0;
  let charIndex = 0;
  let deleting = false;

  function tick() {
    const line = lines[lineIndex];

    if (!deleting) {
      charIndex += 1;
      heroSub.textContent = line.slice(0, charIndex);

      if (charIndex >= line.length) {
        deleting = true;
        setTimeout(tick, 1500);
        return;
      }
    } else {
      charIndex -= 1;
      heroSub.textContent = line.slice(0, Math.max(0, charIndex));

      if (charIndex <= 0) {
        deleting = false;
        lineIndex = (lineIndex + 1) % lines.length;
      }
    }

    setTimeout(tick, deleting ? 26 : 36);
  }

  setTimeout(tick, 900);
}

function runTitleGlitch() {
  if (!heroTitle) return;

  const original = heroTitle.textContent;
  const chars = '!@#$%&*+-/?';

  setInterval(() => {
    let frame = 0;

    const glitchTimer = setInterval(() => {
      const scrambled = original
        .split('')
        .map((ch) => {
          if (ch === ' ') return ' ';
          return Math.random() < 0.35 ? chars[Math.floor(Math.random() * chars.length)] : ch;
        })
        .join('');

      heroTitle.textContent = scrambled;
      frame += 1;

      if (frame > 4) {
        clearInterval(glitchTimer);
        heroTitle.textContent = original;
      }
    }, 50);
  }, 5600);
}

function runEmbers() {
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  let width = 0;
  let height = 0;
  const particles = [];
  const wisps = [];
  const emberCount = 110;
  const wispCount = 14;

  function resize() {
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;
  }

  function reset(particle, randomY = false) {
    particle.x = Math.random() * width;
    particle.y = randomY ? Math.random() * height : height + Math.random() * 90;
    particle.size = 0.6 + Math.random() * 2.4;
    particle.speedY = 0.14 + Math.random() * 0.58;
    particle.speedX = (Math.random() - 0.5) * 0.26;
    particle.alpha = 0.2 + Math.random() * 0.55;

    const variant = Math.random();
    if (variant < 0.5) {
      particle.color = '122, 31, 31';
    } else if (variant < 0.85) {
      particle.color = '46, 108, 255';
    } else {
      particle.color = '169, 150, 106';
    }
  }

  function resetWisp(wisp, randomY = false) {
    wisp.x = Math.random() * width;
    wisp.y = randomY ? Math.random() * height : height + Math.random() * 140;
    wisp.radius = 14 + Math.random() * 24;
    wisp.speedY = 0.05 + Math.random() * 0.12;
    wisp.alpha = 0.035 + Math.random() * 0.05;
  }

  function init() {
    particles.length = 0;
    wisps.length = 0;

    for (let i = 0; i < emberCount; i += 1) {
      const particle = {};
      reset(particle, true);
      particles.push(particle);
    }

    for (let i = 0; i < wispCount; i += 1) {
      const wisp = {};
      resetWisp(wisp, true);
      wisps.push(wisp);
    }
  }

  function draw() {
    ctx.clearRect(0, 0, width, height);

    for (const wisp of wisps) {
      wisp.y -= wisp.speedY;
      if (wisp.y < -120) {
        resetWisp(wisp);
      }

      const gradient = ctx.createRadialGradient(wisp.x, wisp.y, 0, wisp.x, wisp.y, wisp.radius);
      gradient.addColorStop(0, `rgba(46, 108, 255, ${wisp.alpha})`);
      gradient.addColorStop(1, 'rgba(46, 108, 255, 0)');
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(wisp.x, wisp.y, wisp.radius, 0, Math.PI * 2);
      ctx.fill();
    }

    for (const particle of particles) {
      particle.y -= particle.speedY;
      particle.x += particle.speedX;

      if (particle.y < -30 || particle.x < -20 || particle.x > width + 20) {
        reset(particle);
      }

      ctx.fillStyle = `rgba(${particle.color}, ${particle.alpha})`;
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      ctx.fill();
    }

    requestAnimationFrame(draw);
  }

  resize();
  init();
  draw();

  window.addEventListener('resize', () => {
    resize();
    init();
  });
}

runReveal();
setupCopyButton();
runWorldState();
setupArtifactReveal();
setupButtonRipples();
runTiltCards();
runHeroParallax();
runMouseAura();
runHeroSubCycle();
runTitleGlitch();
runEmbers();
