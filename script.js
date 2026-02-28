const copyIpBtn = document.getElementById('copyIpBtn');
const serverIp = document.getElementById('serverIp');
const canvas = document.getElementById('embers');
const deadPixelCanvas = document.getElementById('deadPixels');
const necroStormCanvas = document.getElementById('necroStorm');

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
const eventCountdownEl = document.getElementById('eventCountdown');

const revealArtifactBtn = document.getElementById('revealArtifactBtn');
const artifactCard = document.getElementById('artifactCard');
const containmentPanel = document.getElementById('containmentPanel');
const errorOverlay = document.getElementById('errorOverlay');
const eventMoreInfoBtn = document.getElementById('eventMoreInfoBtn');
const zombieErrorPanel = document.getElementById('zombieErrorPanel');
const eventPanel = document.querySelector('.event-panel');
const necroSigil = document.getElementById('necroSigil');
const loreFragments = document.querySelectorAll('.lore-fragment');

let necroModeUntil = 0;
let triggerLoreBurst = null;

function getInstabilityLevel() {
  const raw = getComputedStyle(document.documentElement).getPropertyValue('--instability').trim();
  const value = Number.parseFloat(raw);
  if (Number.isNaN(value)) return 0;
  return Math.max(0, Math.min(1, value));
}

function activateNecroMode(durationMs = 9000) {
  necroModeUntil = Math.max(necroModeUntil, Date.now() + durationMs);
  document.body.classList.add('necro-mode');

  if (necroSigil) {
    necroSigil.classList.remove('active');
    void necroSigil.offsetWidth;
    necroSigil.classList.add('active');
  }

  if (typeof triggerLoreBurst === 'function') {
    triggerLoreBurst(4);
  }

  setTimeout(() => {
    if (Date.now() >= necroModeUntil) {
      document.body.classList.remove('necro-mode');
      if (necroSigil) necroSigil.classList.remove('active');
    }
  }, durationMs + 120);
}
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
  const collapseDate = new Date('2026-03-01T18:00:00-06:00');
  const startedAt = Date.now();
  const runDuration = Math.max(1, collapseDate.getTime() - startedAt);

  function update() {
    const now = Date.now();
    const remaining = collapseDate.getTime() - now;

    let stability = 0;
    if (remaining > 0) {
      stability = (remaining / runDuration) * initialStability;
      stability = Math.max(0, Math.min(initialStability, stability));
    }

    const stabilityDisplay = `${stability.toFixed(2)}%`;
    worldStabilityEl.textContent = stabilityDisplay;
    stabilityBarEl.style.width = `${(stability / initialStability) * 100}%`;

    if (eventCountdownEl) {
      if (remaining <= 0) {
        eventCountdownEl.textContent = 'LIVE';
      } else {
        const totalSeconds = Math.floor(remaining / 1000);
        const days = Math.floor(totalSeconds / 86400);
        const hours = Math.floor((totalSeconds % 86400) / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;
        eventCountdownEl.textContent = `${days}d ${String(hours).padStart(2, '0')}h ${String(minutes).padStart(2, '0')}m ${String(seconds).padStart(2, '0')}s`;
      }
    }

    stateSection.classList.remove('world-warning', 'world-critical');
    document.body.classList.remove('distort-1', 'distort-2', 'distort-3', 'distort-4');

    const instability = 1 - stability / initialStability;
    document.documentElement.style.setProperty('--instability', String(Math.max(0, Math.min(1, instability))));

    if (instability >= 0.18) {
      document.body.classList.add('distort-1');
    }
    if (instability >= 0.42) {
      document.body.classList.add('distort-2');
      stateSection.classList.add('world-warning');
    }
    if (instability >= 0.62) {
      document.body.classList.add('distort-3');
      stateSection.classList.add('world-critical');
    }
    if (instability >= 0.82) {
      document.body.classList.add('distort-4');
      stateSection.classList.add('world-critical');
    }

    if (stability > 65) {
      undeadActivityEl.textContent = 'Low';
      artifactEnergyEl.textContent = 'Increasing';
    } else if (stability > 48) {
      undeadActivityEl.textContent = 'Guarded';
      artifactEnergyEl.textContent = 'Accelerating';
    } else if (stability > 32) {
      undeadActivityEl.textContent = 'Rising';
      artifactEnergyEl.textContent = 'Surging';
    } else if (stability > 16) {
      undeadActivityEl.textContent = 'High';
      artifactEnergyEl.textContent = 'Critical';
    } else if (stability > 0) {
      undeadActivityEl.textContent = 'Severe';
      artifactEnergyEl.textContent = 'Breach Imminent';
    } else {
      undeadActivityEl.textContent = 'Overrun';
      artifactEnergyEl.textContent = 'Unbound';
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

function triggerContainmentError() {
  if (!errorOverlay) return;
  errorOverlay.classList.remove('active');
  void errorOverlay.offsetWidth;
  errorOverlay.classList.add('active');
}

function setupArtifactReveal() {
  if (!revealArtifactBtn) return;

  let ambientInterval;

  revealArtifactBtn.addEventListener('click', () => {
    revealContainmentNotice();
    triggerContainmentError();

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

function spawnZombieSparks() {
  if (!zombieErrorPanel) return;

  const rect = zombieErrorPanel.getBoundingClientRect();
  const glyphs = ['X', '13', 'RIP', '//', 'NECRO', 'VOID'];

  for (let i = 0; i < 18; i += 1) {
    const glyph = document.createElement('span');
    glyph.className = 'zombie-glyph';
    glyph.textContent = glyphs[Math.floor(Math.random() * glyphs.length)];
    glyph.style.left = `${Math.random() * rect.width}px`;
    glyph.style.top = `${Math.random() * (rect.height * 0.25)}px`;
    glyph.style.animationDelay = `${Math.random() * 260}ms`;
    glyph.style.animationDuration = `${980 + Math.random() * 820}ms`;
    zombieErrorPanel.appendChild(glyph);

    setTimeout(() => {
      glyph.remove();
    }, 1900);
  }

  for (let i = 0; i < 14; i += 1) {
    const soul = document.createElement('span');
    soul.className = 'zombie-soul';
    soul.style.left = `${Math.random() * rect.width}px`;
    soul.style.top = `${Math.random() * rect.height}px`;
    soul.style.animationDelay = `${Math.random() * 220}ms`;
    soul.style.animationDuration = `${900 + Math.random() * 620}ms`;
    zombieErrorPanel.appendChild(soul);

    setTimeout(() => {
      soul.remove();
    }, 1800);
  }
}

function setupEventMoreInfo() {
  if (!eventMoreInfoBtn || !zombieErrorPanel) return;

  const statusLines = [
    'Ritual logs are corrupted.',
    'Night extends beyond cycle limits.',
    'Undead obedience spike detected.'
  ];
  let statusIndex = 0;

  eventMoreInfoBtn.addEventListener('click', () => {
    activateNecroMode(10500);

    zombieErrorPanel.hidden = false;
    zombieErrorPanel.classList.remove('active');
    void zombieErrorPanel.offsetWidth;
    zombieErrorPanel.classList.add('active');

    if (eventPanel) {
      eventPanel.classList.remove('necro-active');
      void eventPanel.offsetWidth;
      eventPanel.classList.add('necro-active');
      setTimeout(() => {
        eventPanel.classList.remove('necro-active');
      }, 1100);
    }

    const lines = zombieErrorPanel.querySelectorAll('p');
    if (lines.length >= 3) {
      lines[2].textContent = statusLines[statusIndex];
      statusIndex = (statusIndex + 1) % statusLines.length;
    }

    spawnZombieSparks();

    eventMoreInfoBtn.textContent = 'Access Denied';
    setTimeout(() => {
      eventMoreInfoBtn.textContent = 'More Info';
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

function runNecroStorm() {
  if (!necroStormCanvas) return;

  const ctx = necroStormCanvas.getContext('2d');
  if (!ctx) return;

  let width = 0;
  let height = 0;
  const runes = [];
  const souls = [];
  const runeChars = ['X', '13', 'RIP', 'VOID', 'NECRO', '//', '0', '1'];
  const runeCount = 58;
  const soulCount = 24;

  function resize() {
    width = window.innerWidth;
    height = window.innerHeight;
    necroStormCanvas.width = width;
    necroStormCanvas.height = height;
  }

  function resetRune(rune, randomY = false) {
    rune.x = Math.random() * width;
    rune.y = randomY ? Math.random() * height : -20 - Math.random() * 100;
    rune.speed = 0.8 + Math.random() * 2.1;
    rune.size = 9 + Math.random() * 8;
    rune.char = runeChars[Math.floor(Math.random() * runeChars.length)];
    rune.alpha = 0.2 + Math.random() * 0.45;
  }

  function resetSoul(soul) {
    soul.angle = Math.random() * Math.PI * 2;
    soul.radius = 30 + Math.random() * Math.min(width, height) * 0.35;
    soul.speed = 0.008 + Math.random() * 0.018;
    soul.alpha = 0.14 + Math.random() * 0.35;
    soul.size = 2 + Math.random() * 4;
  }

  function init() {
    runes.length = 0;
    souls.length = 0;

    for (let i = 0; i < runeCount; i += 1) {
      const rune = {};
      resetRune(rune, true);
      runes.push(rune);
    }

    for (let i = 0; i < soulCount; i += 1) {
      const soul = {};
      resetSoul(soul);
      souls.push(soul);
    }
  }

  function draw() {
    ctx.clearRect(0, 0, width, height);
    const active = Date.now() < necroModeUntil;

    if (active) {
      const instability = getInstabilityLevel();
      const intensity = 0.45 + instability * 0.55;
      const centerX = width * 0.68;
      const centerY = height * 0.46;

      ctx.fillStyle = `rgba(8, 18, 8, ${0.08 * intensity})`;
      ctx.fillRect(0, 0, width, height);

      for (const soul of souls) {
        soul.angle += soul.speed;
        soul.radius *= 0.9992;
        if (soul.radius < 14) {
          resetSoul(soul);
          soul.radius = Math.min(width, height) * 0.34;
        }

        const x = centerX + Math.cos(soul.angle) * soul.radius;
        const y = centerY + Math.sin(soul.angle) * soul.radius * 0.64;
        const alpha = soul.alpha * intensity;

        ctx.fillStyle = `rgba(178, 255, 162, ${alpha})`;
        ctx.beginPath();
        ctx.arc(x, y, soul.size, 0, Math.PI * 2);
        ctx.fill();
      }

      for (const rune of runes) {
        rune.y += rune.speed * intensity;
        if (rune.y > height + 20) {
          resetRune(rune);
        }

        ctx.fillStyle = `rgba(187, 255, 171, ${rune.alpha * intensity})`;
        ctx.font = `${rune.size}px "Courier New", monospace`;
        ctx.fillText(rune.char, rune.x, rune.y);
      }

      if (Math.random() < 0.03 * intensity) {
        const x = Math.random() * width;
        const w = 1 + Math.random() * 2;
        const h = 14 + Math.random() * 40;
        ctx.fillStyle = `rgba(184, 255, 163, ${0.2 + Math.random() * 0.3})`;
        ctx.fillRect(x, Math.random() * height, w, h);
      }
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

function runDeadPixels() {
  if (!deadPixelCanvas) return;

  const ctx = deadPixelCanvas.getContext('2d');
  if (!ctx) return;

  let width = 0;
  let height = 0;
  const pixels = [];
  const count = 320;

  function resize() {
    width = window.innerWidth;
    height = window.innerHeight;
    deadPixelCanvas.width = width;
    deadPixelCanvas.height = height;
  }

  function reset(pixel) {
    pixel.x = Math.floor(Math.random() * width);
    pixel.y = Math.floor(Math.random() * height);
    pixel.size = Math.random() < 0.14 ? 2 : 1;
    pixel.life = 2 + Math.floor(Math.random() * 10);
    pixel.maxLife = pixel.life;
    const roll = Math.random();
    if (roll < 0.6) {
      pixel.color = '40, 46, 58';
    } else if (roll < 0.82) {
      pixel.color = '58, 84, 136';
    } else if (roll < 0.94) {
      pixel.color = '98, 32, 32';
    } else {
      pixel.color = '166, 152, 114';
    }
  }

  function init() {
    pixels.length = 0;
    for (let i = 0; i < count; i += 1) {
      const pixel = {};
      reset(pixel);
      pixel.life = 0;
      pixels.push(pixel);
    }
  }

  function draw() {
    ctx.clearRect(0, 0, width, height);
    const instability = getInstabilityLevel();
    const spawnChance = 0.018 + instability * 0.09;

    for (const pixel of pixels) {
      if (pixel.life <= 0 && Math.random() < spawnChance) {
        reset(pixel);
      }

      if (pixel.life > 0) {
        const alpha = (pixel.life / pixel.maxLife) * (0.3 + instability * 0.7);
        ctx.fillStyle = `rgba(${pixel.color}, ${alpha})`;
        ctx.fillRect(pixel.x, pixel.y, pixel.size, pixel.size);
        pixel.life -= 1;
      }
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

function runHiddenLoreFragments() {
  if (!loreFragments.length) return;

  loreFragments.forEach((fragment) => {
    fragment.textContent = fragment.dataset.lore || '';
  });

  function scramble(text) {
    const symbols = '#$%?<>/';
    return text
      .split('')
      .map((ch) => (ch === ' ' || Math.random() > 0.22 ? ch : symbols[Math.floor(Math.random() * symbols.length)]))
      .join('');
  }

  function flash(fragment) {
    const original = fragment.dataset.lore || '';
    fragment.classList.add('show');

    const first = setTimeout(() => {
      fragment.textContent = scramble(original);
    }, 130);

    const second = setTimeout(() => {
      fragment.textContent = original;
    }, 320);

    const third = setTimeout(() => {
      fragment.classList.remove('show');
    }, 740);

    setTimeout(() => {
      clearTimeout(first);
      clearTimeout(second);
      clearTimeout(third);
    }, 800);
  }

  triggerLoreBurst = (count = 5) => {
    for (let i = 0; i < count; i += 1) {
      const fragment = loreFragments[Math.floor(Math.random() * loreFragments.length)];
      flash(fragment);
    }
  };

  setInterval(() => {
    const instability = getInstabilityLevel();
    const necroBoost = Date.now() < necroModeUntil ? 2 : 0;
    const flashes = (instability > 0.66 ? 3 : instability > 0.38 ? 2 : 1) + necroBoost;
    triggerLoreBurst(flashes);
  }, 1200);
}

runReveal();
setupCopyButton();
runWorldState();
setupArtifactReveal();
setupEventMoreInfo();
setupButtonRipples();
runTiltCards();
runHeroParallax();
runMouseAura();
runHeroSubCycle();
runTitleGlitch();
runEmbers();
runNecroStorm();
runDeadPixels();
runHiddenLoreFragments();


