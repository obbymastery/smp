const copyIpBtn = document.getElementById('copyIpBtn');
const canvas = document.getElementById('embers');
const deadPixelCanvas = document.getElementById('deadPixels');
const necroStormCanvas = document.getElementById('necroStorm');
const starfieldCanvas = document.getElementById('starfield');
const hexgridCanvas = document.getElementById('hexgrid');
const lightningCanvas = document.getElementById('lightning');
const fogCanvas = document.getElementById('fog');
const seepCanvas = document.getElementById('seep');
const shockwaveCanvas = document.getElementById('shockwave');
const orbCanvas = document.getElementById('orbCanvas');
const vizCanvas = document.getElementById('vizCanvas');
const cursorTrailEl = document.getElementById('cursorTrail');

const hero = document.querySelector('.hero');
const heroStone = document.querySelector('.hero-stone');
const heroContent = document.querySelector('.hero-content');
const heroArt = document.querySelector('.hero-art');
const musicToggleBtn = document.getElementById('musicToggleBtn');
const musicNextBtn = document.getElementById('musicNextBtn');
const musicNowEl = document.getElementById('musicNow');
const audioDock = document.getElementById('audioDock');
const audioChannelIndicator = document.getElementById('audioChannelIndicator');
const aiFanToggleBtn = document.getElementById('aiFanToggleBtn');
const aiHoshinoPage = document.getElementById('aiHoshinoPage');
const aiThemeModeBtn = document.getElementById('aiThemeModeBtn');
const aiHeroBanner = document.querySelector('.ai-fan-hero-banner');
const aiTitleStar = document.querySelector('.ai-title-star');
const aiCinematicQuote = document.querySelector('.ai-cinematic-quote');
const aiFanRankDisplay = document.getElementById('aiFanRankDisplay');
const aiFanRankNote = document.getElementById('aiFanRankNote');
const heroTitle = document.getElementById('heroTitle');
const heroSub = document.getElementById('heroSub');
const metaDescriptionTag = document.querySelector('meta[name="description"]');
const defaultPageTitle = document.title;
const defaultMetaDescription = metaDescriptionTag ? metaDescriptionTag.getAttribute('content') || '' : '';
const aiGuestbookForm = document.getElementById('aiGuestbookForm');
const aiGuestbookList = document.getElementById('aiGuestbookList');
const aiGuestName = document.getElementById('aiGuestName');
const aiGuestMessage = document.getElementById('aiGuestMessage');
const aiNoSpoilerCheck = document.getElementById('aiNoSpoilerCheck');
const aiSubmissionForm = document.getElementById('aiSubmissionForm');
const aiSubmitName = document.getElementById('aiSubmitName');
const aiSubmitLink = document.getElementById('aiSubmitLink');
const aiSubmitText = document.getElementById('aiSubmitText');
const aiQuoteDisplay = document.getElementById('aiQuoteDisplay');
const aiQuoteShuffleBtn = document.getElementById('aiQuoteShuffleBtn');
const aiDailyVibe = document.getElementById('aiDailyVibe');
const aiVibeSpinBtn = document.getElementById('aiVibeSpinBtn');
const aiCheerFill = document.getElementById('aiCheerFill');
const aiCheerLabel = document.getElementById('aiCheerLabel');
const aiMilestoneList = document.getElementById('aiMilestoneList');
const aiPerfReadout = document.getElementById('aiPerfReadout');
const aiPollChoices = document.getElementById('aiPollChoices');
const aiPollResult = document.getElementById('aiPollResult');
const aiQuizButtons = document.getElementById('aiQuizButtons');
const aiQuizResult = document.getElementById('aiQuizResult');
const aiSparkleBtn = document.getElementById('aiSparkleBtn');
const aiSparkleCount = document.getElementById('aiSparkleCount');

const stateSection = document.getElementById('state');
const worldStabilityEl = document.getElementById('worldStability');
const undeadActivityEl = document.getElementById('undeadActivity');
const artifactEnergyEl = document.getElementById('artifactEnergy');
const stabilityBarEl = document.getElementById('stabilityBar');
const eventCountdownEl = document.getElementById('eventCountdown');
const stabilityRateEl = document.getElementById('stabilityRate');
const telemetryTextEl = document.getElementById('telemetryText');

const revealArtifactBtn = document.getElementById('revealArtifactBtn');
const artifactCard = document.getElementById('artifactCard');
const containmentPanel = document.getElementById('containmentPanel');
const errorOverlay = document.getElementById('errorOverlay');
const eventMoreInfoBtn = document.getElementById('eventMoreInfoBtn');
const zombieErrorPanel = document.getElementById('zombieErrorPanel');
const eventPanel = document.querySelector('.event-panel');
const necroSigil = document.getElementById('necroSigil');
const archiveCountEl = document.getElementById('archiveCount');
const loreFragments = document.querySelectorAll('.lore-fragment');
const overrunOverlay = document.getElementById('overrunOverlay');
const zombieBreachOverlay = document.getElementById('zombieBreachOverlay');
const zombieBreachLine = document.getElementById('zombieBreachLine');
const zombieBreachSwarm = document.getElementById('zombieBreachSwarm');

let necroModeUntil = 0;
let triggerLoreBurst = null;
let overrunModeUntil = 0;
let shockwaveTrigger = null;
let musicEnabled = false;
let musicPlayer = null;
let musicIndex = 0;
let aiFanMode = false;
let aiModeTransitionTimer = null;
let aiFanSnapshot = null;
const defaultMusicPlaylist = [
  { title: 'Infinite Amethyst', src: 'assets/music/infinite_amethyst.mp3' },
  { title: 'Otherside', src: 'assets/music/otherside.mp3' },
  { title: 'Pigstep', src: 'assets/music/pigstep.mp3' },
  { title: 'Mice On Venus', src: 'assets/music/mice_on_venus.mp3' },
  { title: 'Creator', src: 'assets/music/creator.mp3' }
];
const aiHoshinoMusicConfig = window.aiHoshinoMusicConfig || {};
const aiHoshinoMusicPlaylist = Array.isArray(aiHoshinoMusicConfig.playlist)
  ? aiHoshinoMusicConfig.playlist
    .map((track) => ({
      title: String(track && track.title ? track.title : '').trim(),
      src: String(track && track.src ? track.src : '').trim()
    }))
    .filter((track) => track.title && track.src)
  : [];
const aiHoshinoAutoplayOnMode = aiHoshinoMusicConfig.autoplayOnMode !== false;
const aiFanXpKey = 'ai_hoshino_fan_xp_v1';
const aiFanRankKey = 'ai_hoshino_fan_rank_v1';
const aiFanRankThresholds = [
  { minXp: 0, label: 'Casual Fan' },
  { minXp: 8, label: 'Dedicated Supporter' },
  { minXp: 18, label: 'Idol Devotee' },
  { minXp: 32, label: 'True Star Follower' }
];
let faviconLinkEl = document.querySelector('link[rel="icon"]');
if (!faviconLinkEl) {
  faviconLinkEl = document.createElement('link');
  faviconLinkEl.setAttribute('rel', 'icon');
  document.head.appendChild(faviconLinkEl);
}
const defaultFaviconHref = faviconLinkEl ? (faviconLinkEl.getAttribute('href') || '') : '';

function getActivePlaylist() {
  if (aiFanMode && aiHoshinoMusicPlaylist.length) return aiHoshinoMusicPlaylist;
  return defaultMusicPlaylist;
}

function setMusicStatus(text) {
  if (!musicNowEl) return;
  musicNowEl.textContent = text;
}

function setFaviconForMode(isAiMode) {
  if (!faviconLinkEl) return;
  if (!isAiMode) {
    faviconLinkEl.setAttribute('href', defaultFaviconHref || 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 64 64%22%3E%3Crect width=%2264%22 height=%2264%22 rx=%2212%22 fill=%22%23101923%22/%3E%3Cpath d=%22M14 46L50 18M20 16h28v8H20z%22 stroke=%22%235b8dff%22 stroke-width=%226%22 fill=%22none%22/%3E%3C/svg%3E');
    return;
  }
  faviconLinkEl.setAttribute('href', 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 64 64%22%3E%3Cdefs%3E%3ClinearGradient id=%22g%22 x1=%220%22 y1=%220%22 x2=%221%22 y2=%221%22%3E%3Cstop stop-color=%22%23ff5eaf%22/%3E%3Cstop offset=%221%22 stop-color=%22%236a2cff%22/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width=%2264%22 height=%2264%22 rx=%2212%22 fill=%22url(%23g)%22/%3E%3Cpath d=%22M32 9l5.3 12 13.2 1-10.1 8 3.2 12.8L32 35.5 20.4 42.8 23.6 30 13.5 22l13.2-1z%22 fill=%22%23ffe17a%22/%3E%3C/svg%3E');
}

function getAiFanXp() {
  const value = Number.parseInt(localStorage.getItem(aiFanXpKey) || '0', 10);
  if (Number.isNaN(value)) return 0;
  return Math.max(0, value);
}

function getAiFanRankByXp(xp) {
  let current = aiFanRankThresholds[0];
  aiFanRankThresholds.forEach((rank) => {
    if (xp >= rank.minXp) current = rank;
  });
  return current.label;
}

function renderAiFanRank(note = '') {
  const xp = getAiFanXp();
  const rank = getAiFanRankByXp(xp);
  localStorage.setItem(aiFanRankKey, rank);
  if (aiFanRankDisplay) aiFanRankDisplay.textContent = `Rank: ${rank} ✦`;
  if (aiFanRankNote) {
    aiFanRankNote.textContent = note || `Fan Points: ${xp}  //  Cheer, vote, and send messages to rank up.`;
  }
  renderAiCheerMeter();
  renderAiMilestones();
}

function awardAiFanXp(amount, context = 'support') {
  const current = getAiFanXp();
  const next = current + Math.max(1, amount);
  localStorage.setItem(aiFanXpKey, String(next));
  renderAiFanRank(`+${amount} Fan Points: ${context}. Total ${next}.`);
}

function renderAiCheerMeter() {
  const xp = getAiFanXp();
  const cap = 40;
  const percent = Math.max(0, Math.min(100, Math.round((xp / cap) * 100)));
  if (aiCheerFill) aiCheerFill.style.width = `${percent}%`;
  if (aiCheerLabel) aiCheerLabel.textContent = `Cheer Meter: ${percent}%`;
}

function renderAiMilestones() {
  if (!aiMilestoneList) return;
  const xp = getAiFanXp();
  const dedicated = xp >= 8;
  const devotee = xp >= 18;
  const follower = xp >= 32;
  aiMilestoneList.innerHTML = `
    <li>${dedicated ? '✓' : '○'} Dedicated Supporter (${Math.min(xp, 8)}/8)</li>
    <li>${devotee ? '✓' : '○'} Idol Devotee (${Math.min(xp, 18)}/18)</li>
    <li>${follower ? '✓' : '○'} True Star Follower (${Math.min(xp, 32)}/32)</li>
  `;
}

function setupAiDailyVibe() {
  if (!aiDailyVibe || !aiVibeSpinBtn) return;
  const vibes = [
    'Tonight\'s vibe: pink spotlight with soft chaos.',
    'Tonight\'s vibe: diamond smile, thunder applause.',
    'Tonight\'s vibe: star-eyes, glitter rain, center stage.',
    'Tonight\'s vibe: backstage whispers, bright encore.',
    'Tonight\'s vibe: idol poise with a tiny gremlin laugh.'
  ];

  const setRandomVibe = () => {
    const pick = vibes[Math.floor(Math.random() * vibes.length)];
    aiDailyVibe.textContent = pick;
  };

  setRandomVibe();
  aiVibeSpinBtn.addEventListener('click', () => {
    awardAiFanXp(1, 'daily vibe spin');
    setRandomVibe();
  });
}

function ensureMusicPlayer() {
  if (musicPlayer) return;
  musicPlayer = new Audio();
  musicPlayer.preload = 'none';
  musicPlayer.volume = 0.42;

  musicPlayer.addEventListener('ended', () => {
    if (!musicEnabled) return;
    const activePlaylist = getActivePlaylist();
    if (!activePlaylist.length) return;
    playMusicTrack((musicIndex + 1) % activePlaylist.length, true);
  });
}

function updateMusicUI() {
  if (!musicToggleBtn) return;
  const label = musicToggleBtn.querySelector('.btn-text');
  if (label) label.textContent = musicEnabled ? 'Music: On' : 'Music: Off';
  musicToggleBtn.classList.toggle('music-on', musicEnabled);
}

function updateBroadcastChannelUI() {
  const aiChannelActive = aiFanMode && aiHoshinoMusicPlaylist.length > 0;
  if (audioDock) audioDock.classList.toggle('ai-channel-active', aiChannelActive);
  if (!audioChannelIndicator) return;
  if (aiFanMode) {
    audioChannelIndicator.textContent = aiChannelActive ? 'AI CHANNEL OVERRIDE' : 'AI CHANNEL (NO TRACKS)';
  } else {
    audioChannelIndicator.textContent = 'FACTION CHANNEL';
  }
}

function stopMusic() {
  if (!musicPlayer) return;
  musicPlayer.pause();
}

function disableMusicWithMessage(msg) {
  musicEnabled = false;
  updateMusicUI();
  stopMusic();
  setMusicStatus(msg);
}

function playMusicTrack(index, autoplay = true, attempts = 0) {
  const activePlaylist = getActivePlaylist();
  if (!activePlaylist.length) {
    if (aiFanMode) {
      setMusicStatus('No Ai Hoshino tracks found. Edit ai-hoshino-music-config.js');
    } else {
      setMusicStatus('No tracks configured');
    }
    return;
  }
  ensureMusicPlayer();
  if (!musicPlayer) return;

  musicIndex = ((index % activePlaylist.length) + activePlaylist.length) % activePlaylist.length;
  const track = activePlaylist[musicIndex];
  setMusicStatus(`Loading: ${track.title}`);

  const onCanPlay = () => {
    if (!autoplay || !musicEnabled) {
      setMusicStatus(`Ready: ${track.title}`);
      return;
    }
    musicPlayer.play()
      .then(() => {
        setMusicStatus(`Now Playing: ${track.title}`);
      })
      .catch(() => {
        setMusicStatus(`Tap Music to play: ${track.title}`);
      });
  };

  const onError = () => {
    if (attempts + 1 >= activePlaylist.length) {
      if (aiFanMode) {
        setMusicStatus(`Track unavailable: ${track.title}. Check ai-hoshino-music-config.js`);
      } else {
        setMusicStatus(`Track unavailable: ${track.title}. Add files in assets/music/`);
      }
      return;
    }
    playMusicTrack((musicIndex + 1) % activePlaylist.length, autoplay && musicEnabled, attempts + 1);
  };

  musicPlayer.oncanplay = onCanPlay;
  musicPlayer.onerror = onError;
  musicPlayer.src = track.src;
  musicPlayer.load();
}

function setMusicEnabled(enabled) {
  musicEnabled = enabled;
  updateMusicUI();

  if (!musicEnabled) {
    stopMusic();
    setMusicStatus('Music paused');
    return;
  }

  ensureMusicPlayer();
  if (!musicPlayer) {
    disableMusicWithMessage('Music unsupported by this browser');
    return;
  }

  if (!musicPlayer.src) {
    playMusicTrack(musicIndex, true);
    return;
  }

  musicPlayer.play()
    .then(() => {
      const current = getActivePlaylist()[musicIndex];
      if (current) setMusicStatus(`Now Playing: ${current.title}`);
    })
    .catch(() => {
      playMusicTrack(musicIndex, true);
    });
}

function setupAudioSystem() {
  if (!musicToggleBtn && !musicNextBtn) return;

  updateMusicUI();
  if (musicToggleBtn) {
    musicToggleBtn.addEventListener('click', () => {
      setMusicEnabled(!musicEnabled);
    });
  }

  if (musicNextBtn) {
    musicNextBtn.addEventListener('click', () => {
      const activePlaylist = getActivePlaylist();
      if (!activePlaylist.length) {
        if (aiFanMode) setMusicStatus('Add Ai Hoshino tracks in ai-hoshino-music-config.js');
        return;
      }
      playMusicTrack((musicIndex + 1) % activePlaylist.length, musicEnabled);
    });
  }
}

function setButtonLabel(btn, label) {
  if (!btn) return;
  const textEl = btn.querySelector('.btn-text');
  if (textEl) textEl.textContent = label;
  else btn.textContent = label;
}

function readNode(selector, property = 'textContent') {
  const el = document.querySelector(selector);
  if (!el) return null;
  if (property === 'href') return el.getAttribute('href');
  if (property === 'content') return el.getAttribute('content');
  if (property === 'datasetLore') return el.dataset.lore || '';
  return el[property];
}

function writeNode(selector, value, property = 'textContent') {
  const el = document.querySelector(selector);
  if (!el || value === null || value === undefined) return;
  if (property === 'href') {
    el.setAttribute('href', value);
    return;
  }
  if (property === 'content') {
    el.setAttribute('content', value);
    return;
  }
  if (property === 'datasetLore') {
    el.dataset.lore = value;
    return;
  }
  el[property] = value;
}

function captureAiFanSnapshot() {
  if (aiFanSnapshot) return;

  const targets = [
    ['title', 'text'],
    ['meta[name="description"]', 'content'],
    ['.server-label', 'innerHTML'],
    ['#heroTitle', 'innerHTML'],
    ['#heroTitle', 'datasetText'],
    ['#heroSub', 'textContent'],
    ['.hero-actions .btn:nth-child(1) .btn-text', 'textContent'],
    ['.hero-actions .btn:nth-child(2) .btn-text', 'textContent'],
    ['.art-caption', 'textContent'],
    ['.art-mini:nth-child(1) p', 'textContent'],
    ['.art-mini:nth-child(2) p', 'textContent'],
    ['#world h2', 'innerHTML'],
    ['#world p', 'textContent'],
    ['#state h2', 'innerHTML'],
    ['.state-row--stability .state-key', 'innerHTML'],
    ['.state-row--undead .state-key', 'innerHTML'],
    ['.state-row--artifact .state-key', 'innerHTML'],
    ['#worldStability', 'textContent'],
    ['#undeadActivity', 'textContent'],
    ['#artifactEnergy', 'textContent'],
    ['#state .state-note:nth-of-type(1)', 'innerHTML'],
    ['#state .state-note:nth-of-type(2)', 'innerHTML'],
    ['#state .state-note:nth-of-type(3)', 'innerHTML'],
    ['#stabilityRate', 'textContent'],
    ['#eventCountdown', 'textContent'],
    ['.telemetry-label', 'textContent'],
    ['#telemetryText', 'textContent'],
    ['#artifact h2', 'innerHTML'],
    ['#artifact .excerpt', 'textContent'],
    ['#revealArtifactBtn .btn-text', 'textContent'],
    ['#containmentPanel h3', 'textContent'],
    ['#containmentPanel p:nth-of-type(1)', 'textContent'],
    ['#containmentPanel p:nth-of-type(2)', 'textContent'],
    ['#containmentPanel p:nth-of-type(3)', 'textContent'],
    ['#events h2', 'innerHTML'],
    ['#events .event-type', 'textContent'],
    ['#events .event-title', 'textContent'],
    ['#events .event-panel .line-item:nth-of-type(1)', 'textContent'],
    ['#events .event-panel .line-item:nth-of-type(2)', 'textContent'],
    ['#events .event-panel .line-item:nth-of-type(3)', 'textContent'],
    ['#eventMoreInfoBtn .btn-text', 'textContent'],
    ['#zombieErrorPanel .zombie-code', 'textContent'],
    ['#zombieErrorPanel h3', 'textContent'],
    ['#zombieErrorPanel p:nth-of-type(1)', 'textContent'],
    ['#zombieErrorPanel p:nth-of-type(2)', 'textContent'],
    ['#join h2', 'innerHTML'],
    ['#join .panel:nth-child(1) h3', 'textContent'],
    ['#join .panel:nth-child(1) .line-item:nth-of-type(1)', 'innerHTML'],
    ['#join .panel:nth-child(1) .line-item:nth-of-type(2)', 'textContent'],
    ['#copyIpBtn .btn-text', 'textContent'],
    ['#join .panel:nth-child(2) h3', 'textContent'],
    ['#join .panel:nth-child(2) p:nth-of-type(1) .text-link', 'textContent'],
    ['#join .panel:nth-child(2) p:nth-of-type(2) .text-link', 'textContent'],
    ['#join .panel:nth-child(2) p:nth-of-type(1) .text-link', 'href'],
    ['#join .panel:nth-child(2) p:nth-of-type(2) .text-link', 'href'],
    ['#join .panel:nth-child(3) h3', 'textContent'],
    ['#join .panel:nth-child(3) .line-item:nth-of-type(1)', 'textContent'],
    ['#join .panel:nth-child(3) .line-item:nth-of-type(2)', 'textContent'],
    ['#join .panel:nth-child(3) .line-item:nth-of-type(3)', 'textContent'],
    ['footer .footer-inner p', 'innerHTML']
  ];

  aiFanSnapshot = {
    targets: targets.map(([selector, property]) => {
      let value = null;
      if (selector === 'title') value = document.title;
      else if (property === 'datasetText') {
        value = heroTitle
          ? (heroTitle.dataset.text || heroTitle.textContent.replace(/\s+/g, ' ').trim())
          : '';
      }
      else value = readNode(selector, property);
      return { selector, property, value };
    }),
    loreFragments: Array.from(loreFragments).map((fragment) => ({
      lore: fragment.dataset.lore || '',
      text: fragment.textContent || ''
    }))
  };
}

function restoreAiFanSnapshot() {
  if (!aiFanSnapshot) return;
  aiFanSnapshot.targets.forEach(({ selector, property, value }) => {
    if (selector === 'title') {
      if (typeof value === 'string') document.title = value;
      return;
    }
    if (property === 'datasetText') {
      if (heroTitle) heroTitle.dataset.text = value || '';
      return;
    }
    writeNode(selector, value, property);
  });

  aiFanSnapshot.loreFragments.forEach((saved, i) => {
    const fragment = loreFragments[i];
    if (!fragment) return;
    fragment.dataset.lore = saved.lore;
    fragment.textContent = saved.text;
  });
}

function applyAiFanContent() {
  const metaDescription = document.querySelector('meta[name="description"]');
  if (metaDescription) metaDescription.setAttribute('content', 'Ai Hoshino Fan Page - cute idol sparkle mode.');
  document.title = 'Ai Hoshino Fan Page | Cute Sparkle Broadcast';

  writeNode('.server-label', '<span class="label-bracket" aria-hidden="true">//</span> AI HOSHINO <span class="label-bracket" aria-hidden="true">//</span>', 'innerHTML');
  writeNode('#heroTitle', '<span class="word-reveal">Ai</span> <span class="word-reveal">Hoshino</span> <span class="word-reveal">Cutie</span> <span class="word-reveal">Star.</span>', 'innerHTML');
  if (heroTitle) heroTitle.dataset.text = 'Ai Hoshino Cutie Star.';
  writeNode('#heroSub', 'Welcome to the cutest Ai Hoshino fan page: sparkles, songs, and endless idol love.');
  writeNode('.hero-actions .btn:nth-child(1) .btn-text', 'Enter Fan Hub');
  writeNode('.hero-actions .btn:nth-child(2) .btn-text', 'See Idol Moments');
  writeNode('.art-caption', 'B-Komachi Stage Feed // Idol visuals online');
  writeNode('.art-mini:nth-child(1) p', 'Glow Stage Cam');
  writeNode('.art-mini:nth-child(2) p', 'Star Idol Channel');

  writeNode('#world h2', '<span class="h2-rule" aria-hidden="true"></span>About Ai', 'innerHTML');
  writeNode('#world p', 'Ai Hoshino is pure idol magic: bright smile, big star energy, and unforgettable performances.');

  writeNode('#state h2', '<span class="h2-rule" aria-hidden="true"></span>Fan Status', 'innerHTML');
  writeNode('.state-row--stability .state-key', '<span class="state-dot" aria-hidden="true"></span>Fan Excitement', 'innerHTML');
  writeNode('.state-row--undead .state-key', '<span class="state-dot" aria-hidden="true"></span>Idol Energy', 'innerHTML');
  writeNode('.state-row--artifact .state-key', '<span class="state-dot" aria-hidden="true"></span>Stage Sparkle', 'innerHTML');
  writeNode('#worldStability', '100%');
  writeNode('#undeadActivity', 'Sparkling');
  writeNode('#artifactEnergy', 'MAX');
  writeNode('#eventCountdown', 'ALWAYS LIVE');
  writeNode('#state .state-note:nth-of-type(1)', 'Countdown to next cute encore: <strong>Tonight</strong>', 'innerHTML');
  writeNode('#state .state-note:nth-of-type(2)', 'Ai Hoshino Fan Page enabled. Hearts and sparkles are now online.', 'innerHTML');
  writeNode('#state .state-note:nth-of-type(3)', 'Kawaii Rate: <strong>Infinite</strong>', 'innerHTML');
  writeNode('#stabilityRate', '+MAX');
  writeNode('.telemetry-label', 'Live Fanlog');
  writeNode('#telemetryText', '[IDOL] Stage lights synced. Crowd hearts at full volume.');

  writeNode('#artifact h2', '<span class="h2-rule" aria-hidden="true"></span>Idol Archive', 'innerHTML');
  writeNode('#artifact .excerpt', 'A highlight vault dedicated to Ai Hoshino performances, visuals, and legendary fan moments.');
  writeNode('#revealArtifactBtn .btn-text', 'Open Gallery');
  writeNode('#containmentPanel h3', 'Favorite Moment');
  writeNode('#containmentPanel p:nth-of-type(1)', 'This archive is full of iconic performances.');
  writeNode('#containmentPanel p:nth-of-type(2)', 'Ai shines on every stage.');
  writeNode('#containmentPanel p:nth-of-type(3)', 'Fan hearts stay locked in forever.');

  writeNode('#events h2', '<span class="h2-rule" aria-hidden="true"></span>Top Moments', 'innerHTML');
  writeNode('#events .event-type', 'Ai Hoshino Spotlight');
  writeNode('#events .event-title', 'Ai');
  writeNode('#events .event-panel .line-item:nth-of-type(1)', 'Status: Center Stage');
  writeNode('#events .event-panel .line-item:nth-of-type(2)', 'Song: STAR T RAIN');
  writeNode('#events .event-panel .line-item:nth-of-type(3)', 'Fan Hearts: Unlimited');
  writeNode('#eventMoreInfoBtn .btn-text', 'More Lore');
  writeNode('#zombieErrorPanel .zombie-code', 'FAN ARCHIVE [AI]');
  writeNode('#zombieErrorPanel h3', 'Idol Lore Unlocked');
  writeNode('#zombieErrorPanel p:nth-of-type(1)', 'Every smile is iconic.');
  writeNode('#zombieErrorPanel p:nth-of-type(2)', 'Every performance is legendary.');

  writeNode('#join h2', '<span class="h2-rule" aria-hidden="true"></span>Fan Hub', 'innerHTML');
  writeNode('#join .panel:nth-child(1) h3', 'Profile');
  writeNode('#serverIp', 'Ai Hoshino');
  writeNode('#join .panel:nth-child(1) .line-item:nth-of-type(2)', 'Group: B-Komachi');
  writeNode('#copyIpBtn .btn-text', 'Copy Name');
  writeNode('#join .panel:nth-child(2) h3', 'Links');
  writeNode('#join .panel:nth-child(2) p:nth-of-type(1) .text-link', 'Wiki');
  writeNode('#join .panel:nth-child(2) p:nth-of-type(2) .text-link', 'Songs');
  writeNode('#join .panel:nth-child(2) p:nth-of-type(1) .text-link', 'https://oshi-no-ko.fandom.com/wiki/Ai_Hoshino', 'href');
  writeNode('#join .panel:nth-child(2) p:nth-of-type(2) .text-link', 'https://www.youtube.com/results?search_query=ai+hoshino+song', 'href');
  writeNode('#join .panel:nth-child(3) h3', 'Fan Rules');
  writeNode('#join .panel:nth-child(3) .line-item:nth-of-type(1)', 'Keep cheering.');
  writeNode('#join .panel:nth-child(3) .line-item:nth-of-type(2)', 'Share favorite moments.');
  writeNode('#join .panel:nth-child(3) .line-item:nth-of-type(3)', 'Protect the star.');

  writeNode('footer .footer-inner p', '<span class="footer-tag" aria-hidden="true">[KAWAII]</span> Ai Hoshino Fan Page <span class="footer-tag" aria-hidden="true">[END]</span>', 'innerHTML');

  const fanLoreLines = [
    'The brightest idol in the sky.',
    'A single smile can light the stage.',
    'Every song feels like a promise.',
    'The crowd never forgets her glow.',
    'Ai forever, always center stage.',
    'One voice, countless hearts moved.',
    'Idol aura remains unmatched.',
    'Fan hearts synchronized.'
  ];

  loreFragments.forEach((fragment, i) => {
    const line = fanLoreLines[i % fanLoreLines.length];
    fragment.dataset.lore = line;
    fragment.textContent = line;
  });

  document.body.classList.remove('necro-mode', 'overrun-mode', 'distort-1', 'distort-2', 'distort-3', 'distort-4');
  if (overrunOverlay) overrunOverlay.classList.remove('active');
  if (zombieBreachOverlay) zombieBreachOverlay.classList.remove('active');
  if (errorOverlay) errorOverlay.classList.remove('active');
}

function setAiFanMode(enabled) {
  aiFanMode = !!enabled;
  if (aiModeTransitionTimer) {
    clearTimeout(aiModeTransitionTimer);
    aiModeTransitionTimer = null;
  }

  document.body.classList.remove('ai-hijack-active', 'ai-hijack-transition', 'ai-hijack-enter', 'ai-hijack-exit');
  document.body.classList.toggle('ai-fan-mode', aiFanMode);
  if (aiHoshinoPage) aiHoshinoPage.hidden = !aiFanMode;
  if (aiFanMode) window.scrollTo(0, 0);

  setButtonLabel(aiFanToggleBtn, aiFanMode ? 'Back to SMP' : 'Ai Hoshino Fan Page');
  updateBroadcastChannelUI();

  if (aiFanMode) {
    document.title = 'Ai Hoshino Fan Page | Idol Stage vs Hidden Reality';
    if (metaDescriptionTag) metaDescriptionTag.setAttribute('content', 'Ai Hoshino fan experience focused on idol-stage duality.');
    setFaviconForMode(true);
    renderAiFanRank();
    if (musicEnabled) {
      if (aiHoshinoMusicPlaylist.length) {
        playMusicTrack(0, aiHoshinoAutoplayOnMode);
      } else {
        setMusicStatus('No Ai Hoshino tracks yet. Edit ai-hoshino-music-config.js');
      }
    } else if (aiHoshinoMusicPlaylist.length) {
      setMusicStatus(`Ai Hoshino playlist ready: ${aiHoshinoMusicPlaylist.map((x) => x.title).join(' / ')}`);
    } else {
      setMusicStatus('Add Ai Hoshino songs in ai-hoshino-music-config.js');
    }
  } else {
    document.title = defaultPageTitle;
    if (metaDescriptionTag) metaDescriptionTag.setAttribute('content', defaultMetaDescription);
    setFaviconForMode(false);
    if (musicEnabled) {
      playMusicTrack(0, true);
    } else {
      setMusicStatus('Music ready: Infinite Amethyst / Otherside / Pigstep / Mice On Venus / Creator');
    }
  }

}

function setupAiFanToggle() {
  if (!aiFanToggleBtn) return;
  if (aiHoshinoPage) aiHoshinoPage.hidden = true;
  setButtonLabel(aiFanToggleBtn, 'Ai Hoshino Fan Page');
  updateBroadcastChannelUI();
  renderAiFanRank();
  aiFanToggleBtn.addEventListener('click', () => {
    setAiFanMode(!aiFanMode);
  });
}

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function setupAiThemeMode() {
  if (!aiThemeModeBtn) return;
  const key = 'ai_hoshino_persona_mode_v2';

  const applyMode = (mode) => {
    const hiddenReality = mode === 'hidden-reality';
    document.body.classList.toggle('ai-after-hours', hiddenReality);
    document.body.classList.toggle('ai-hidden-reality', hiddenReality);
    document.body.classList.toggle('ai-idol-stage', !hiddenReality);
    aiThemeModeBtn.textContent = hiddenReality ? 'Mode: Hidden Reality' : 'Mode: Idol Stage';
    if (musicPlayer) musicPlayer.volume = hiddenReality ? 0.3 : 0.42;
    if (aiTitleStar) {
      aiTitleStar.classList.remove('mode-flash');
      void aiTitleStar.offsetWidth;
      aiTitleStar.classList.add('mode-flash');
      setTimeout(() => aiTitleStar.classList.remove('mode-flash'), 700);
    }
    window.dispatchEvent(new CustomEvent('ai-mode-change', { detail: { mode: hiddenReality ? 'hidden-reality' : 'idol-stage' } }));
  };

  const savedMode = localStorage.getItem(key);
  applyMode(savedMode === 'hidden-reality' ? 'hidden-reality' : 'idol-stage');

  aiThemeModeBtn.addEventListener('click', () => {
    const nextMode = document.body.classList.contains('ai-hidden-reality') ? 'idol-stage' : 'hidden-reality';
    localStorage.setItem(key, nextMode);
    awardAiFanXp(1, 'mode shift');
    applyMode(nextMode);
  });
}

function renderAiGuestbook() {
  if (!aiGuestbookList) return;
  const raw = localStorage.getItem('ai_hoshino_guestbook_v1');
  let entries = [];
  if (raw) {
    try {
      entries = JSON.parse(raw);
    } catch {
      entries = [];
    }
  }

  aiGuestbookList.innerHTML = '';
  entries.forEach((entry) => {
    const li = document.createElement('li');
    const name = escapeHtml(entry.name || 'Fan');
    const message = escapeHtml(entry.message || '');
    const ts = escapeHtml(entry.createdAt || '');
    li.innerHTML = `<strong>${name}</strong> <span>${ts}</span><p>${message}</p>`;
    aiGuestbookList.appendChild(li);
  });
}

function setupAiGuestbook() {
  if (!aiGuestbookForm || !aiGuestName || !aiGuestMessage || !aiNoSpoilerCheck) return;
  const spoilerPattern = /\b(dies|death|killed|murder|ending)\b/i;
  renderAiGuestbook();

  aiGuestbookForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const name = aiGuestName.value.trim().slice(0, 60);
    const message = aiGuestMessage.value.trim().slice(0, 300);
    if (!name || !message || !aiNoSpoilerCheck.checked) return;

    if (spoilerPattern.test(message)) {
      alert('Please keep guestbook comments spoiler-safe.');
      return;
    }

    const raw = localStorage.getItem('ai_hoshino_guestbook_v1');
    let entries = [];
    if (raw) {
      try {
        entries = JSON.parse(raw);
      } catch {
        entries = [];
      }
    }

    entries.unshift({
      name,
      message,
      createdAt: new Date().toLocaleDateString()
    });
    entries = entries.slice(0, 30);
    localStorage.setItem('ai_hoshino_guestbook_v1', JSON.stringify(entries));
    awardAiFanXp(3, 'love message sent');

    aiGuestbookForm.reset();
    renderAiGuestbook();
  });
}

function setupAiSubmissionDraft() {
  if (!aiSubmissionForm || !aiSubmitName || !aiSubmitLink || !aiSubmitText) return;
  const key = 'ai_hoshino_submission_draft_v1';

  try {
    const saved = JSON.parse(localStorage.getItem(key) || '{}');
    aiSubmitName.value = saved.name || '';
    aiSubmitLink.value = saved.link || '';
    aiSubmitText.value = saved.text || '';
  } catch {
    // ignore malformed local storage data
  }

  aiSubmissionForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const draft = {
      name: aiSubmitName.value.trim().slice(0, 80),
      link: aiSubmitLink.value.trim().slice(0, 240),
      text: aiSubmitText.value.trim().slice(0, 700)
    };
    if (!draft.name && !draft.link && !draft.text) return;
    localStorage.setItem(key, JSON.stringify(draft));
    awardAiFanXp(3, 'submission draft saved');
  });
}

function setupAiQuoteMachine() {
  if (!aiQuoteDisplay || !aiQuoteShuffleBtn) return;
  const idolQuotes = [
    { line: 'A perfect idol smile can hide a thousand thoughts.', tag: 'Idol Mode' },
    { line: 'Ai turns every entrance into a full event.', tag: 'Stage Energy' },
    { line: 'The spotlight bends toward her every time.', tag: 'Center Aura' },
    { line: 'Cute first. Precise second. Legendary always.', tag: 'Ai Being Ai' }
  ];
  const hiddenQuotes = [
    { line: 'The duality is the point: sparkle and shadow together.', tag: 'Character Core' },
    { line: 'Her glow feels warm even when the scene hurts.', tag: 'Heartbreaking' },
    { line: 'Performance is loud. Truth is quiet.', tag: 'Hidden Reality' },
    { line: 'What she never says matters most.', tag: 'Backstage Tone' }
  ];

  const getPool = () => (
    document.body.classList.contains('ai-hidden-reality') ? hiddenQuotes : idolQuotes
  );

  const renderQuote = () => {
    const pool = getPool();
    const pick = pool[Math.floor(Math.random() * pool.length)];
    aiQuoteDisplay.classList.remove('quote-fade-in');
    void aiQuoteDisplay.offsetWidth;
    aiQuoteDisplay.textContent = `"${pick.line}" - ${pick.tag}`;
    aiQuoteDisplay.dataset.mode = document.body.classList.contains('ai-hidden-reality') ? 'hidden' : 'idol';
    aiQuoteDisplay.classList.add('quote-fade-in');
  };

  renderQuote();
  aiQuoteShuffleBtn.addEventListener('click', () => {
    awardAiFanXp(1, 'quote cheer');
    renderQuote();
  });
  window.addEventListener('ai-mode-change', renderQuote);
}

function setupAiPerformancePins() {
  const buttons = document.querySelectorAll('.ai-time-btn');
  if (!buttons.length || !aiPerfReadout) return;
  const key = 'ai_hoshino_performance_pin_v1';

  const apply = (seconds) => {
    if (!seconds) {
      aiPerfReadout.textContent = 'Support a stage moment to pin your favorite.';
      return;
    }
    const sec = Number.parseInt(seconds, 10);
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    aiPerfReadout.textContent = `Pinned favorite highlight at ${m}:${String(s).padStart(2, '0')}.`;
  };

  apply(localStorage.getItem(key));
  buttons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const time = btn.dataset.time || '';
      localStorage.setItem(key, time);
      awardAiFanXp(2, 'performance support');
      apply(time);
    });
  });
}

function setupAiPoll() {
  if (!aiPollChoices || !aiPollResult) return;
  const key = 'ai_hoshino_poll_choice_v1';
  const labels = {
    stage: 'Stage Queen',
    soft: 'Soft Smile',
    chaotic: 'Chaotic Gremlin',
    mystery: 'Mystery Aura'
  };

  const apply = (choice) => {
    const label = labels[choice];
    aiPollResult.textContent = label
      ? `Support registered: ${label}.`
      : 'Support Ai ✦ to save your favorite mode.';
  };

  apply(localStorage.getItem(key) || '');
  aiPollChoices.querySelectorAll('button').forEach((btn) => {
    btn.addEventListener('click', () => {
      const choice = btn.dataset.choice || '';
      localStorage.setItem(key, choice);
      awardAiFanXp(2, 'fan poll support');
      apply(choice);
    });
  });
}

function setupAiQuizSparkle() {
  const sparkleKey = 'ai_hoshino_sparkle_count_v1';

  if (aiQuizButtons && aiQuizResult) {
    aiQuizButtons.querySelectorAll('button').forEach((btn) => {
      btn.addEventListener('click', () => {
        const right = btn.dataset.ans === 'right';
        aiQuizResult.textContent = right
          ? 'Correct. Strawberry Productions is the right answer.'
          : 'Not quite. Try again.';
      });
    });
  }

  if (aiSparkleBtn && aiSparkleCount) {
    let count = Number.parseInt(localStorage.getItem(sparkleKey) || '0', 10);
    if (Number.isNaN(count)) count = 0;
    aiSparkleCount.textContent = `Sparkles: ${count}`;
    aiSparkleBtn.addEventListener('click', () => {
      count += 1;
      localStorage.setItem(sparkleKey, String(count));
      aiSparkleCount.textContent = `Sparkles: ${count}`;
    });
  }
}

function setupAiStageParallax() {
  if (!aiHeroBanner) return;
  let ticking = false;

  const update = () => {
    if (!aiFanMode) {
      aiHeroBanner.style.setProperty('--stageShift', '0px');
      ticking = false;
      return;
    }
    const y = window.scrollY || 0;
    const factor = document.body.classList.contains('ai-hidden-reality') ? -0.016 : -0.03;
    const shift = Math.max(-18, Math.min(18, y * factor));
    aiHeroBanner.style.setProperty('--stageShift', `${shift.toFixed(2)}px`);
    ticking = false;
  };

  window.addEventListener('scroll', () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(update);
  }, { passive: true });
}

function setupAiCinematicReveal() {
  if (!aiCinematicQuote) return;
  if (!('IntersectionObserver' in window)) {
    aiCinematicQuote.classList.add('ai-inview');
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        aiCinematicQuote.classList.add('ai-inview');
        observer.disconnect();
      }
    });
  }, { threshold: 0.22 });

  observer.observe(aiCinematicQuote);
}

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

function getArchiveCount() {
  const saved = Number.parseInt(localStorage.getItem('paradox_archive_count') || '0', 10);
  if (Number.isNaN(saved)) return 0;
  return Math.max(0, Math.min(5, saved));
}

function setArchiveCount(next) {
  const clamped = Math.max(0, Math.min(5, next));
  localStorage.setItem('paradox_archive_count', String(clamped));
  if (archiveCountEl) archiveCountEl.textContent = String(clamped);
}

function activateOverrun(durationMs = 7000) {
  overrunModeUntil = Math.max(overrunModeUntil, Date.now() + durationMs);
  document.body.classList.add('overrun-mode');
  if (overrunOverlay) {
    overrunOverlay.classList.add('active');
    setTimeout(() => overrunOverlay.classList.remove('active'), 1900);
  }
  activateNecroMode(Math.max(durationMs, 9500));
  setTimeout(() => {
    if (Date.now() >= overrunModeUntil) {
      document.body.classList.remove('overrun-mode');
    }
  }, durationMs + 200);
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
  const serverIpEl = document.getElementById('serverIp');
  if (!copyIpBtn || !serverIpEl) return;

  const ip = serverIpEl.textContent.trim();
  const btnTextEl = copyIpBtn.querySelector('.btn-text');

  function setBtnLabel(label) {
    if (btnTextEl) btnTextEl.textContent = label;
    else copyIpBtn.textContent = label;
  }

  try {
    await navigator.clipboard.writeText(ip);
    setBtnLabel('Copied');
  } catch (error) {
    setBtnLabel(ip);
  }

  setTimeout(() => {
    setBtnLabel(aiFanMode ? 'Copy Name' : 'Copy IP');
  }, 1200);
}

function setupCopyButton() {
  if (!copyIpBtn) return;
  copyIpBtn.addEventListener('click', copyIp);
}

function runWorldState() {
  if (!worldStabilityEl || !undeadActivityEl || !artifactEnergyEl || !stabilityBarEl || !stateSection) return;

  const initialStability = 81;
  // March 1, 2026 6:00 PM America/Chicago = March 2, 2026 00:00:00 UTC
  const collapseDate = new Date(Date.UTC(2026, 2, 2, 0, 0, 0));
  const startedAt = Date.now();
  const runDuration = Math.max(1, collapseDate.getTime() - startedAt);
  const perMinuteDrain = collapseDate.getTime() > startedAt
    ? initialStability / ((collapseDate.getTime() - startedAt) / 60000)
    : 0;
  let liveTriggered = false;

  function update() {
    if (aiFanMode) {
      stateSection.classList.remove('world-warning', 'world-critical');
      document.body.classList.remove('distort-1', 'distort-2', 'distort-3', 'distort-4');
      document.documentElement.style.setProperty('--instability', '0.12');
      return;
    }

    const now = Date.now();
    const remaining = collapseDate.getTime() - now;

    let stability = 0;
    if (remaining > 0) {
      stability = (remaining / runDuration) * initialStability;
      stability = Math.max(0, Math.min(initialStability, stability));
    }

    const stabilityDisplay = `${stability.toFixed(3)}%`;
    worldStabilityEl.textContent = stabilityDisplay;
    stabilityBarEl.style.width = `${(stability / initialStability) * 100}%`;
    if (stabilityRateEl) {
      stabilityRateEl.textContent = `-${perMinuteDrain.toFixed(3)}%/min`;
    }

    if (eventCountdownEl) {
      if (remaining <= 0) {
        eventCountdownEl.textContent = 'LIVE';
        if (!liveTriggered) {
          liveTriggered = true;
          activateOverrun(12000);
        }
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
    if (typeof shockwaveTrigger === 'function') {
      const rect = revealArtifactBtn.getBoundingClientRect();
      shockwaveTrigger(rect.left + rect.width / 2, rect.top + rect.height / 2, '46,108,255', 1.1);
    }

    if (ambientInterval) {
      clearInterval(ambientInterval);
    }

    ambientInterval = setInterval(() => {
      if (containmentPanel && !containmentPanel.hidden) {
        spawnSoulSparks(containmentPanel, 6, 0.9);
      }
    }, 520);

    const artBtnText = revealArtifactBtn.querySelector('.btn-text');
    if (artBtnText) artBtnText.textContent = 'Signal Intercepted';
    else revealArtifactBtn.textContent = 'Signal Intercepted';
    setTimeout(() => {
      if (artBtnText) artBtnText.textContent = 'Press to Reveal';
      else revealArtifactBtn.textContent = 'Press to Reveal';
    }, 1200);
  });
}

function spawnZombieSparks() {
  if (!zombieErrorPanel) return;

  const rect = zombieErrorPanel.getBoundingClientRect();
  const glyphs = ['X', '13', 'RIP', '//', 'NECRO', 'VOID', 'SOUL', 'BONE'];

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

function spawnZombieCrawls() {
  if (!zombieErrorPanel) return;
  const rect = zombieErrorPanel.getBoundingClientRect();

  for (let i = 0; i < 16; i += 1) {
    const crawl = document.createElement('span');
    crawl.className = 'zombie-crawl';
    crawl.style.left = `${Math.random() * rect.width}px`;
    crawl.style.top = `${Math.random() * rect.height}px`;
    crawl.style.transform = `rotate(${(Math.random() - 0.5) * 22}deg)`;
    crawl.style.animationDelay = `${Math.random() * 240}ms`;
    crawl.style.animationDuration = `${560 + Math.random() * 620}ms`;
    zombieErrorPanel.appendChild(crawl);
    setTimeout(() => {
      crawl.remove();
    }, 1400);
  }
}

function triggerZombieBreach() {
  const lines = [
    'Undead pathing is now synced to artifact resonance.',
    'Soul-pressure exceeded containment threshold.',
    'Event feed compromised by necrotic signatures.',
    'Grave-channel activity has entered the event feed.',
    'Dormant entities are responding to conflict density.'
  ];

  if (zombieBreachLine) {
    zombieBreachLine.textContent = lines[Math.floor(Math.random() * lines.length)];
  }

  if (zombieBreachOverlay) {
    zombieBreachOverlay.classList.remove('active');
    void zombieBreachOverlay.offsetWidth;
    zombieBreachOverlay.classList.add('active');
  }

  if (zombieBreachSwarm) {
    const width = window.innerWidth;
    const height = window.innerHeight;

    for (let i = 0; i < 26; i += 1) {
      const ash = document.createElement('span');
      ash.className = 'zombie-ash';
      ash.style.left = `${Math.random() * width}px`;
      ash.style.top = `${height - Math.random() * 90}px`;
      ash.style.animationDelay = `${Math.random() * 220}ms`;
      ash.style.animationDuration = `${900 + Math.random() * 1200}ms`;
      zombieBreachSwarm.appendChild(ash);
      setTimeout(() => ash.remove(), 2200);
    }

    for (let i = 0; i < 6; i += 1) {
      const hand = document.createElement('span');
      hand.className = 'zombie-hand';
      hand.style.left = `${6 + Math.random() * 88}%`;
      hand.style.top = `${75 + Math.random() * 18}%`;
      hand.style.transform = `rotate(${(Math.random() - 0.5) * 20}deg)`;
      hand.style.animationDelay = `${Math.random() * 360}ms`;
      hand.style.animationDuration = `${780 + Math.random() * 620}ms`;
      zombieBreachSwarm.appendChild(hand);
      setTimeout(() => hand.remove(), 1900);
    }
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
    triggerZombieBreach();
    if (typeof shockwaveTrigger === 'function') {
      const rect = eventMoreInfoBtn.getBoundingClientRect();
      shockwaveTrigger(rect.left + rect.width / 2, rect.top + rect.height / 2, '109,196,91', 1.35);
    }

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
    spawnZombieCrawls();
    setArchiveCount(getArchiveCount() + 1);

    const evtBtnText = eventMoreInfoBtn.querySelector('.btn-text');
    if (evtBtnText) evtBtnText.textContent = 'Access Denied';
    else eventMoreInfoBtn.textContent = 'Access Denied';
    setTimeout(() => {
      if (evtBtnText) evtBtnText.textContent = 'More Info';
      else eventMoreInfoBtn.textContent = 'More Info';
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
    if (heroArt) {
      heroArt.style.transform = `translate(${x * -8}px, ${y * -5}px)`;
    }
  });

  hero.addEventListener('mouseleave', () => {
    heroStone.style.transform = 'translate(0, 0) scale(1)';
    heroContent.style.transform = 'translate(0, 0)';
    if (heroArt) heroArt.style.transform = 'translate(0, 0)';
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
    if (aiFanMode) {
      setTimeout(tick, 600);
      return;
    }

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

function initTitleChroma() {
  if (!heroTitle) return;
  heroTitle.dataset.text = heroTitle.textContent.replace(/\s+/g, ' ').trim();
}

function runTitleGlitch() {
  if (!heroTitle) return;

  const chars = '!@#$%&*+-/?';

  function scrambleText(text) {
    return text.split('').map((ch) => {
      if (ch === ' ') return ' ';
      return Math.random() < 0.35 ? chars[Math.floor(Math.random() * chars.length)] : ch;
    }).join('');
  }

  setInterval(() => {
    if (aiFanMode) return;
    const wordSpans = heroTitle.querySelectorAll('.word-reveal');
    if (!wordSpans.length) return;
    const originals = Array.from(wordSpans).map(s => s.textContent);
    let frame = 0;

    const glitchTimer = setInterval(() => {
      const scrambledFull = originals.map(scrambleText).join(' ');
      wordSpans.forEach((span, i) => { span.textContent = scrambleText(originals[i]); });
      heroTitle.dataset.text = scrambledFull;
      frame++;

      if (frame > 4) {
        clearInterval(glitchTimer);
        wordSpans.forEach((span, i) => { span.textContent = originals[i]; });
        heroTitle.dataset.text = originals.join(' ');
      }
    }, 50);
  }, 5600);
}

function runStarfield() {
  if (!starfieldCanvas) return;

  const ctx = starfieldCanvas.getContext('2d');
  if (!ctx) return;

  let width = 0;
  let height = 0;
  const stars = [];
  const STAR_COUNT = 200;

  function resize() {
    width = window.innerWidth;
    height = window.innerHeight;
    starfieldCanvas.width = width;
    starfieldCanvas.height = height;
  }

  function resetStar(star, randomY = false) {
    star.x = Math.random() * width;
    star.y = randomY ? Math.random() * height : Math.random() * height;
    star.size = 0.3 + Math.random() * 1.1;
    star.alpha = 0.08 + Math.random() * 0.45;
    star.baseAlpha = star.alpha;
    star.twinkleSpeed = 0.004 + Math.random() * 0.012;
    star.twinkleOffset = Math.random() * Math.PI * 2;
    star.drift = (Math.random() - 0.5) * 0.04;
    const roll = Math.random();
    if (roll < 0.55) {
      star.color = '200, 214, 255';
    } else if (roll < 0.78) {
      star.color = '180, 200, 255';
    } else if (roll < 0.92) {
      star.color = '255, 240, 210';
    } else {
      star.color = '169, 150, 106';
    }
  }

  function init() {
    stars.length = 0;
    for (let i = 0; i < STAR_COUNT; i++) {
      const star = {};
      resetStar(star, true);
      stars.push(star);
    }
  }

  let frame = 0;
  function draw() {
    ctx.clearRect(0, 0, width, height);
    frame++;

    for (const star of stars) {
      star.x += star.drift;
      if (star.x < -2 || star.x > width + 2) star.drift *= -1;

      const twinkle = Math.sin(frame * star.twinkleSpeed + star.twinkleOffset);
      const alpha = Math.max(0, star.baseAlpha + twinkle * 0.12);

      ctx.fillStyle = `rgba(${star.color}, ${alpha})`;
      ctx.beginPath();
      ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
      ctx.fill();

      if (star.size > 0.9 && alpha > 0.3) {
        ctx.fillStyle = `rgba(${star.color}, ${alpha * 0.18})`;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size * 2.8, 0, Math.PI * 2);
        ctx.fill();
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

function runEmbers() {
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  let width = 0;
  let height = 0;
  const particles = [];
  const wisps = [];
  const emberCount = 130;
  const wispCount = 20;
  const ARC_THRESHOLD = 80;
  const ARC_PROB = 0.0008;

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
    particle.trail = [];
    particle.trailMax = Math.floor(3 + Math.random() * 5);

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
    wisp.radius = 18 + Math.random() * 38;
    wisp.speedY = 0.04 + Math.random() * 0.1;
    wisp.alpha = 0.04 + Math.random() * 0.065;
    wisp.wobble = Math.random() * Math.PI * 2;
    wisp.wobbleSpeed = 0.006 + Math.random() * 0.01;
    const wroll = Math.random();
    wisp.color = wroll < 0.7 ? '46, 108, 255' : wroll < 0.9 ? '122, 31, 31' : '169, 150, 106';
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

  function drawArc(x1, y1, x2, y2, color) {
    const midX = (x1 + x2) / 2 + (Math.random() - 0.5) * 12;
    const midY = (y1 + y2) / 2 + (Math.random() - 0.5) * 12;
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.quadraticCurveTo(midX, midY, x2, y2);
    ctx.strokeStyle = `rgba(${color}, 0.18)`;
    ctx.lineWidth = 0.6;
    ctx.stroke();
  }

  let drawFrame = 0;
  function draw() {
    ctx.clearRect(0, 0, width, height);
    drawFrame++;

    for (const wisp of wisps) {
      wisp.y -= wisp.speedY;
      wisp.wobble += wisp.wobbleSpeed;
      wisp.x += Math.sin(wisp.wobble) * 0.18;
      if (wisp.y < -120) {
        resetWisp(wisp);
      }

      const gradient = ctx.createRadialGradient(wisp.x, wisp.y, 0, wisp.x, wisp.y, wisp.radius);
      gradient.addColorStop(0, `rgba(${wisp.color}, ${wisp.alpha})`);
      gradient.addColorStop(0.5, `rgba(${wisp.color}, ${wisp.alpha * 0.4})`);
      gradient.addColorStop(1, `rgba(${wisp.color}, 0)`);
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(wisp.x, wisp.y, wisp.radius, 0, Math.PI * 2);
      ctx.fill();
    }

    for (let i = 0; i < particles.length; i++) {
      const particle = particles[i];

      particle.trail.push({ x: particle.x, y: particle.y });
      if (particle.trail.length > particle.trailMax) {
        particle.trail.shift();
      }

      particle.y -= particle.speedY;
      particle.x += particle.speedX;

      if (particle.y < -30 || particle.x < -20 || particle.x > width + 20) {
        reset(particle);
        continue;
      }

      if (particle.trail.length > 1) {
        for (let t = 1; t < particle.trail.length; t++) {
          const trailAlpha = (t / particle.trail.length) * particle.alpha * 0.45;
          const trailSize = particle.size * (t / particle.trail.length) * 0.7;
          ctx.fillStyle = `rgba(${particle.color}, ${trailAlpha})`;
          ctx.beginPath();
          ctx.arc(particle.trail[t].x, particle.trail[t].y, trailSize, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      ctx.fillStyle = `rgba(${particle.color}, ${particle.alpha})`;
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      ctx.fill();

      if (particle.size > 1.4 && Math.random() < ARC_PROB) {
        for (let j = i + 1; j < particles.length; j++) {
          const other = particles[j];
          const dx = other.x - particle.x;
          const dy = other.y - particle.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < ARC_THRESHOLD && other.size > 1.0) {
            drawArc(particle.x, particle.y, other.x, other.y, particle.color);
            break;
          }
        }
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

function runFog() {
  if (!fogCanvas) return;
  const ctx = fogCanvas.getContext('2d');
  if (!ctx) return;

  let width = 0;
  let height = 0;
  const blobs = [];
  const blobCount = 18;

  function resize() {
    width = window.innerWidth;
    height = window.innerHeight;
    fogCanvas.width = width;
    fogCanvas.height = height;
  }

  function reset(blob, randomY = false) {
    blob.x = Math.random() * width;
    blob.y = randomY ? Math.random() * height : height + Math.random() * 220;
    blob.r = 90 + Math.random() * 180;
    blob.speedY = 0.04 + Math.random() * 0.12;
    blob.speedX = (Math.random() - 0.5) * 0.12;
    blob.alpha = 0.02 + Math.random() * 0.06;
    const roll = Math.random();
    if (roll < 0.55) blob.color = '46, 108, 255';
    else if (roll < 0.82) blob.color = '122, 31, 31';
    else blob.color = '169, 150, 106';
  }

  function init() {
    blobs.length = 0;
    for (let i = 0; i < blobCount; i += 1) {
      const b = {};
      reset(b, true);
      blobs.push(b);
    }
  }

  function draw() {
    ctx.clearRect(0, 0, width, height);
    const instability = getInstabilityLevel();
    const intensity = 0.45 + instability * 0.95;

    for (const blob of blobs) {
      blob.y -= blob.speedY * intensity;
      blob.x += blob.speedX * intensity;
      if (blob.y < -blob.r * 1.5 || blob.x < -blob.r || blob.x > width + blob.r) {
        reset(blob);
      }

      const grad = ctx.createRadialGradient(blob.x, blob.y, 0, blob.x, blob.y, blob.r);
      grad.addColorStop(0, `rgba(${blob.color}, ${blob.alpha * intensity})`);
      grad.addColorStop(1, `rgba(${blob.color}, 0)`);
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(blob.x, blob.y, blob.r, 0, Math.PI * 2);
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

function runSeep() {
  if (!seepCanvas) return;
  const ctx = seepCanvas.getContext('2d');
  if (!ctx) return;

  let width = 0;
  let height = 0;
  const drips = [];

  function resize() {
    width = window.innerWidth;
    height = window.innerHeight;
    seepCanvas.width = width;
    seepCanvas.height = height;
  }

  function spawn() {
    drips.push({
      x: Math.random() < 0.5 ? 0 : width,
      y: Math.random() * height,
      len: 16 + Math.random() * 70,
      width: 1 + Math.random() * 3,
      life: 35 + Math.random() * 55,
      maxLife: 65 + Math.random() * 55,
      dir: Math.random() < 0.5 ? 1 : -1
    });
  }

  function draw() {
    ctx.clearRect(0, 0, width, height);
    const instability = getInstabilityLevel();
    const spawnRate = instability * 0.25 + (Date.now() < necroModeUntil ? 0.2 : 0);
    if (Math.random() < spawnRate) spawn();

    for (let i = drips.length - 1; i >= 0; i -= 1) {
      const d = drips[i];
      d.life -= 1.2;
      if (d.life <= 0) {
        drips.splice(i, 1);
        continue;
      }
      const a = (d.life / d.maxLife) * (0.15 + instability * 0.45);
      ctx.strokeStyle = `rgba(109, 196, 91, ${a})`;
      ctx.lineWidth = d.width;
      ctx.beginPath();
      ctx.moveTo(d.x, d.y);
      ctx.lineTo(d.x + d.dir * d.len, d.y + (Math.random() - 0.5) * 12);
      ctx.stroke();
    }

    requestAnimationFrame(draw);
  }

  resize();
  draw();
  window.addEventListener('resize', resize);
}

function runShockwaves() {
  if (!shockwaveCanvas) return { trigger: () => {} };
  const ctx = shockwaveCanvas.getContext('2d');
  if (!ctx) return { trigger: () => {} };

  let width = 0;
  let height = 0;
  const waves = [];

  function resize() {
    width = window.innerWidth;
    height = window.innerHeight;
    shockwaveCanvas.width = width;
    shockwaveCanvas.height = height;
  }

  function trigger(x, y, color = '46,108,255', strength = 1) {
    waves.push({
      x,
      y,
      r: 2,
      max: 120 + strength * 180,
      speed: 5 + strength * 3,
      color,
      alpha: 0.45 + strength * 0.2
    });
  }

  function draw() {
    ctx.clearRect(0, 0, width, height);
    for (let i = waves.length - 1; i >= 0; i -= 1) {
      const w = waves[i];
      w.r += w.speed;
      if (w.r > w.max) {
        waves.splice(i, 1);
        continue;
      }
      const life = 1 - w.r / w.max;
      ctx.strokeStyle = `rgba(${w.color}, ${life * w.alpha})`;
      ctx.lineWidth = 1 + life * 4;
      ctx.beginPath();
      ctx.arc(w.x, w.y, w.r, 0, Math.PI * 2);
      ctx.stroke();
    }
    requestAnimationFrame(draw);
  }

  resize();
  draw();
  window.addEventListener('resize', resize);
  return { trigger };
}

function runViz() {
  if (!vizCanvas) return;
  const ctx = vizCanvas.getContext('2d');
  if (!ctx) return;

  let width = 0;
  let height = 0;
  const bars = 52;

  function resize() {
    width = window.innerWidth;
    height = window.innerHeight;
    vizCanvas.width = width;
    vizCanvas.height = height;
  }

  function draw() {
    ctx.clearRect(0, 0, width, height);
    const instability = getInstabilityLevel();
    const necroBoost = Date.now() < necroModeUntil ? 0.45 : 0;
    const intensity = Math.min(1, instability + necroBoost);

    for (let i = 0; i < bars; i += 1) {
      const t = i / (bars - 1);
      const xLeft = 12 + i * 3.2;
      const xRight = width - 12 - i * 3.2;
      const h = 8 + Math.sin(Date.now() * 0.004 + i * 0.5) * 6 + intensity * 40 * Math.random();
      const alpha = 0.04 + intensity * 0.28;
      ctx.fillStyle = `rgba(46, 108, 255, ${alpha})`;
      ctx.fillRect(xLeft, height - 30 - h, 2, h);
      ctx.fillStyle = `rgba(109, 196, 91, ${alpha * 0.9})`;
      ctx.fillRect(xRight, height - 30 - h, 2, h);

      if (Date.now() < necroModeUntil && Math.random() < 0.03) {
        ctx.fillStyle = `rgba(187, 255, 171, 0.45)`;
        ctx.fillRect(xLeft, 20 + t * 90, 2, 8);
      }
    }

    requestAnimationFrame(draw);
  }

  resize();
  draw();
  window.addEventListener('resize', resize);
}

function runTelemetry() {
  if (!telemetryTextEl) return;

  const lines = [
    'Orb harmonics unstable in lower vault channels.',
    'Respawn anomaly index trending above baseline.',
    'Undead pathing seeks source resonance.',
    'Sky-darkening duration is no longer consistent.',
    'Faction conflict density feeding artifact charge.',
    'Signal relay intercepted from sealed chamber.',
    'Nether echo signatures leaking into Overworld.',
    'Containment runes failing at the outer ring.'
  ];

  let idx = 0;
  setInterval(() => {
    if (aiFanMode) return;
    const instability = getInstabilityLevel();
    const prefix = instability > 0.75 ? '[CRITICAL]' : instability > 0.45 ? '[WARN]' : '[INFO]';
    telemetryTextEl.textContent = `${prefix} ${lines[idx]}`;
    idx = (idx + 1) % lines.length;
  }, 2500);
}

function runSignalWarp() {
  function tick() {
    const instability = getInstabilityLevel();
    const necroBoost = Date.now() < necroModeUntil ? 0.28 : 0;
    const overrunBoost = Date.now() < overrunModeUntil ? 0.45 : 0;
    const chaos = Math.min(1.45, instability + necroBoost + overrunBoost);

    const warpX = (Math.random() - 0.5) * chaos * 2.8;
    const warpY = (Math.random() - 0.5) * chaos * 2.2;
    const warpR = (Math.random() - 0.5) * chaos * 0.32;
    const noiseBoost = Math.min(1, chaos * 0.7);

    document.documentElement.style.setProperty('--warpX', `${warpX.toFixed(2)}px`);
    document.documentElement.style.setProperty('--warpY', `${warpY.toFixed(2)}px`);
    document.documentElement.style.setProperty('--warpR', `${warpR.toFixed(2)}deg`);
    document.documentElement.style.setProperty('--noiseBoost', noiseBoost.toFixed(3));
    requestAnimationFrame(tick);
  }

  tick();
}

function setupSecretProtocols(shockwaveTrigger) {
  const konami = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
  let buffer = [];

  window.addEventListener('keydown', (event) => {
    const key = event.key.length === 1 ? event.key.toLowerCase() : event.key;
    buffer.push(key);
    if (buffer.length > konami.length) buffer.shift();

    const matched = konami.every((k, i) => buffer[i] === k);
    if (matched) {
      activateOverrun(9000);
      if (typeof shockwaveTrigger === 'function') {
        shockwaveTrigger(window.innerWidth * 0.5, window.innerHeight * 0.5, '109,196,91', 1.7);
      }
    }

    if (key === 'n') {
      activateNecroMode(8500);
      if (typeof shockwaveTrigger === 'function') {
        shockwaveTrigger(window.innerWidth * 0.68, window.innerHeight * 0.5, '109,196,91', 1.3);
      }
    }
  });
}

// ─── Hex Grid ────────────────────────────────────────────────────────────────
function runHexGrid() {
  if (!hexgridCanvas) return;
  const ctx = hexgridCanvas.getContext('2d');
  if (!ctx) return;

  let width = 0, height = 0, frame = 0;
  const HEX_SIZE = 38;

  function resize() {
    width = window.innerWidth;
    height = window.innerHeight;
    hexgridCanvas.width = width;
    hexgridCanvas.height = height;
  }

  function drawHex(cx, cy, size, alpha) {
    ctx.beginPath();
    for (let i = 0; i < 6; i++) {
      const angle = (Math.PI / 180) * (60 * i - 30);
      const x = cx + size * Math.cos(angle);
      const y = cy + size * Math.sin(angle);
      if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.strokeStyle = `rgba(46, 108, 255, ${alpha})`;
    ctx.lineWidth = 0.5;
    ctx.stroke();
  }

  function draw() {
    ctx.clearRect(0, 0, width, height);
    frame++;
    const instability = getInstabilityLevel();
    const baseAlpha = 0.04 + instability * 0.12;

    const cols = Math.ceil(width / (HEX_SIZE * 1.73)) + 2;
    const rows = Math.ceil(height / (HEX_SIZE * 1.5)) + 2;
    const w = HEX_SIZE * Math.sqrt(3);
    const h = HEX_SIZE * 2;

    for (let row = -1; row < rows; row++) {
      for (let col = -1; col < cols; col++) {
        const cx = col * w + (row % 2 === 0 ? 0 : w / 2);
        const cy = row * h * 0.75;

        // per-hex pulse wave emanating from center
        const dx = cx - width / 2;
        const dy = cy - height / 2;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const wave = Math.sin(dist * 0.012 - frame * 0.022) * 0.5 + 0.5;
        const alpha = baseAlpha * (0.3 + wave * 0.7);

        drawHex(cx, cy, HEX_SIZE - 1, alpha);

        // occasionally light up a hex with a bright flash
        if (Math.random() < 0.00015 + instability * 0.0008) {
          ctx.fillStyle = `rgba(46, 108, 255, ${0.08 + instability * 0.1})`;
          ctx.fill();
        }
      }
    }

    requestAnimationFrame(draw);
  }

  resize();
  draw();
  window.addEventListener('resize', resize);
}

// ─── Lightning ───────────────────────────────────────────────────────────────
function runLightning() {
  if (!lightningCanvas) return;
  const ctx = lightningCanvas.getContext('2d');
  if (!ctx) return;

  let width = 0, height = 0;
  let bolts = [];

  function resize() {
    width = window.innerWidth;
    height = window.innerHeight;
    lightningCanvas.width = width;
    lightningCanvas.height = height;
  }

  function buildBolt(x1, y1, x2, y2, depth) {
    const segs = [];
    function split(ax, ay, bx, by, d) {
      if (d <= 0) { segs.push([ax, ay, bx, by]); return; }
      const mx = (ax + bx) / 2 + (Math.random() - 0.5) * (80 / d);
      const my = (ay + by) / 2 + (Math.random() - 0.5) * (80 / d);
      split(ax, ay, mx, my, d - 1);
      split(mx, my, bx, by, d - 1);
      // small chance to fork
      if (Math.random() < 0.3 && d === 2) {
        const fx = bx + (Math.random() - 0.5) * 120;
        const fy = by + Math.random() * 80;
        split(mx, my, fx, fy, 1);
      }
    }
    split(x1, y1, x2, y2, depth);
    return segs;
  }

  function spawnBolt() {
    const instability = getInstabilityLevel();
    const x1 = Math.random() * width;
    const x2 = x1 + (Math.random() - 0.5) * 300;
    const y2 = Math.random() * height * 0.7;
    const segs = buildBolt(x1, 0, x2, y2, 4);
    bolts.push({
      segs,
      life: 1.0,
      decay: 0.04 + Math.random() * 0.06,
      color: Math.random() < 0.7 ? '100, 160, 255' : '200, 100, 100',
    });
  }

  function draw() {
    ctx.clearRect(0, 0, width, height);
    const instability = getInstabilityLevel();

    // spawn chance scales with instability
    if (Math.random() < 0.004 + instability * 0.018) spawnBolt();

    for (let i = bolts.length - 1; i >= 0; i--) {
      const bolt = bolts[i];
      bolt.life -= bolt.decay;
      if (bolt.life <= 0) { bolts.splice(i, 1); continue; }

      for (const [ax, ay, bx, by] of bolt.segs) {
        ctx.beginPath();
        ctx.moveTo(ax, ay);
        ctx.lineTo(bx, by);
        ctx.strokeStyle = `rgba(${bolt.color}, ${bolt.life * 0.9})`;
        ctx.lineWidth = bolt.life * 1.4;
        ctx.shadowColor = `rgba(${bolt.color}, ${bolt.life * 0.6})`;
        ctx.shadowBlur = 8;
        ctx.stroke();
        ctx.shadowBlur = 0;

        // thin inner bright core
        ctx.beginPath();
        ctx.moveTo(ax, ay);
        ctx.lineTo(bx, by);
        ctx.strokeStyle = `rgba(220, 240, 255, ${bolt.life * 0.7})`;
        ctx.lineWidth = bolt.life * 0.4;
        ctx.stroke();
      }
    }

    requestAnimationFrame(draw);
  }

  resize();
  draw();
  window.addEventListener('resize', resize);
}

// ─── Cursor Trail ─────────────────────────────────────────────────────────────
function runCursorTrail() {
  if (!cursorTrailEl) return;
  let lastX = -999, lastY = -999;
  const MIN_DIST = 8;

  window.addEventListener('mousemove', (e) => {
    const dx = e.clientX - lastX;
    const dy = e.clientY - lastY;
    if (Math.sqrt(dx * dx + dy * dy) < MIN_DIST) return;
    lastX = e.clientX;
    lastY = e.clientY;

    const instability = getInstabilityLevel();
    const necro = Date.now() < necroModeUntil;

    // main dot
    const dot = document.createElement('div');
    dot.className = 'trail-dot';
    const size = 5 + Math.random() * 4;
    const color = necro
      ? `rgba(150, 255, 130, 0.75)`
      : `rgba(${46 + Math.random() * 30 | 0}, ${108 + Math.random() * 20 | 0}, 255, ${0.55 + instability * 0.3})`;
    dot.style.cssText = `
      left:${e.clientX}px;
      top:${e.clientY}px;
      width:${size}px;
      height:${size}px;
      background: radial-gradient(circle, ${color}, transparent 70%);
      box-shadow: 0 0 ${size * 2}px ${color};
      animation-duration: ${300 + Math.random() * 250}ms;
    `;
    cursorTrailEl.appendChild(dot);
    setTimeout(() => dot.remove(), 600);

    // occasional sparkle burst on fast movement
    const speed = Math.sqrt(dx * dx + dy * dy);
    if (speed > 22 && Math.random() < 0.35) {
      for (let i = 0; i < 3; i++) {
        const spark = document.createElement('div');
        spark.className = 'trail-dot';
        const ss = 2 + Math.random() * 3;
        spark.style.cssText = `
          left:${e.clientX + (Math.random() - 0.5) * 20}px;
          top:${e.clientY + (Math.random() - 0.5) * 20}px;
          width:${ss}px;
          height:${ss}px;
          background: rgba(180, 210, 255, 0.9);
          box-shadow: 0 0 4px rgba(100, 150, 255, 0.8);
          animation-duration: ${180 + Math.random() * 150}ms;
        `;
        cursorTrailEl.appendChild(spark);
        setTimeout(() => spark.remove(), 350);
      }
    }
  });
}

// ─── Energy Orb ──────────────────────────────────────────────────────────────
function runEnergyOrb() {
  if (!orbCanvas) return;
  const ctx = orbCanvas.getContext('2d');
  if (!ctx) return;

  let width = 0, height = 0, frame = 0;

  function resize() {
    width = window.innerWidth;
    height = window.innerHeight;
    orbCanvas.width = width;
    orbCanvas.height = height;
  }

  // Lissajous path params
  const A = 0.0018, B = 0.0029, delta = Math.PI / 2.6;
  // radius of the orbit around hero center
  const RX = 0.3, RY = 0.18;

  function draw() {
    ctx.clearRect(0, 0, width, height);
    frame++;

    const instability = getInstabilityLevel();
    const necro = Date.now() < necroModeUntil;

    // center anchor = hero section center
    const heroEl = document.querySelector('.hero');
    const rect = heroEl ? heroEl.getBoundingClientRect() : { left: 0, top: 0, width, height: height * 0.7 };
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const rx = rect.width * RX;
    const ry = rect.height * RY;

    // Lissajous position
    const ox = cx + Math.sin(frame * A) * rx;
    const oy = cy + Math.sin(frame * B + delta) * ry;

    const orbR = 5 + instability * 4;
    const haloR = orbR * (6 + instability * 5);
    const baseColor = necro ? '120, 255, 100' : '80, 140, 255';
    const coreColor = necro ? '210, 255, 190' : '200, 220, 255';

    // outer halo
    const halo = ctx.createRadialGradient(ox, oy, 0, ox, oy, haloR);
    halo.addColorStop(0, `rgba(${baseColor}, ${0.12 + instability * 0.08})`);
    halo.addColorStop(0.4, `rgba(${baseColor}, ${0.06 + instability * 0.04})`);
    halo.addColorStop(1, `rgba(${baseColor}, 0)`);
    ctx.fillStyle = halo;
    ctx.beginPath();
    ctx.arc(ox, oy, haloR, 0, Math.PI * 2);
    ctx.fill();

    // mid glow ring
    const mid = ctx.createRadialGradient(ox, oy, 0, ox, oy, orbR * 2.5);
    mid.addColorStop(0, `rgba(${baseColor}, ${0.5 + instability * 0.3})`);
    mid.addColorStop(1, `rgba(${baseColor}, 0)`);
    ctx.fillStyle = mid;
    ctx.beginPath();
    ctx.arc(ox, oy, orbR * 2.5, 0, Math.PI * 2);
    ctx.fill();

    // bright core
    const core = ctx.createRadialGradient(ox, oy, 0, ox, oy, orbR);
    core.addColorStop(0, `rgba(${coreColor}, 0.95)`);
    core.addColorStop(0.5, `rgba(${baseColor}, 0.7)`);
    core.addColorStop(1, `rgba(${baseColor}, 0)`);
    ctx.fillStyle = core;
    ctx.beginPath();
    ctx.arc(ox, oy, orbR, 0, Math.PI * 2);
    ctx.fill();

    // draw the Lissajous trail (last N positions)
    if (!draw._trail) draw._trail = [];
    draw._trail.push({ x: ox, y: oy });
    if (draw._trail.length > 80) draw._trail.shift();

    for (let i = 1; i < draw._trail.length; i++) {
      const t = i / draw._trail.length;
      const prev = draw._trail[i - 1];
      const curr = draw._trail[i];
      ctx.beginPath();
      ctx.moveTo(prev.x, prev.y);
      ctx.lineTo(curr.x, curr.y);
      ctx.strokeStyle = `rgba(${baseColor}, ${t * 0.18 * (0.5 + instability)})`;
      ctx.lineWidth = t * 1.2;
      ctx.stroke();
    }

    requestAnimationFrame(draw);
  }

  resize();
  draw();
  window.addEventListener('resize', resize);
}

runReveal();
setupAudioSystem();
setupAiFanToggle();
setFaviconForMode(false);
setupAiThemeMode();
setupAiGuestbook();
setupAiSubmissionDraft();
setupAiQuoteMachine();
setupAiDailyVibe();
setupAiPerformancePins();
setupAiPoll();
setupAiStageParallax();
setupAiCinematicReveal();
setupCopyButton();
setArchiveCount(getArchiveCount());
runWorldState();
setupArtifactReveal();
setupEventMoreInfo();
setupButtonRipples();
shockwaveTrigger = runShockwaves().trigger;
setupSecretProtocols(shockwaveTrigger);
runTelemetry();
runSignalWarp();
runTiltCards();
runHeroParallax();
runMouseAura();
runHeroSubCycle();
initTitleChroma();
runTitleGlitch();
runStarfield();
runHexGrid();
runFog();
runSeep();
runViz();
runEmbers();
runLightning();
runNecroStorm();
runDeadPixels();
runHiddenLoreFragments();
runCursorTrail();
runEnergyOrb();


