const musicElement = document.getElementById('musicElement');
const musicToggleBtn = document.getElementById('musicToggleBtn');
const musicNextBtn = document.getElementById('musicNextBtn');
const musicStatus = document.getElementById('musicStatus');
const toolbarClock = document.getElementById('toolbarClock');
const copyIpHeroBtn = document.getElementById('copyIpHeroBtn');
const copyIpJoinBtn = document.getElementById('copyIpJoinBtn');
const serverIp = document.getElementById('serverIp');
const heroVersionBadge = document.getElementById('heroVersionBadge');
const heroPlayerCount = document.getElementById('heroPlayerCount');
const overviewVersion = document.getElementById('overviewVersion');
const overviewPlayers = document.getElementById('overviewPlayers');
const statusPingLabel = document.getElementById('statusPingLabel');
const livePlayerCount = document.getElementById('livePlayerCount');
const liveVersion = document.getElementById('liveVersion');
const liveDescription = document.getElementById('liveDescription');
const liveMaxPlayers = document.getElementById('liveMaxPlayers');
const lastRefresh = document.getElementById('lastRefresh');
const rosterCountLabel = document.getElementById('rosterCountLabel');
const playerRoster = document.getElementById('playerRoster');

const playlist = [
  { title: 'Infinite Amethyst', src: 'assets/music/infinite_amethyst.mp3' },
  { title: 'Otherside', src: 'assets/music/otherside.mp3' },
  { title: 'Pigstep', src: 'assets/music/pigstep.mp3' },
  { title: 'Mice On Venus', src: 'assets/music/mice_on_venus.mp3' },
  { title: 'Creator', src: 'assets/music/creator.mp3' }
];

let musicEnabled = false;
let currentTrackIndex = 0;

function setMusicStatus(text) {
  if (musicStatus) musicStatus.textContent = text;
}

function setMusicLabel() {
  if (musicToggleBtn) {
    musicToggleBtn.textContent = musicEnabled ? 'MUSIC ON' : 'MUSIC OFF';
  }
}

function loadTrack(index) {
  if (!musicElement) return;
  currentTrackIndex = (index + playlist.length) % playlist.length;
  musicElement.src = playlist[currentTrackIndex].src;
  musicElement.volume = 1;
  setMusicStatus(`READY: ${playlist[currentTrackIndex].title.toUpperCase()}`);
}

async function playCurrentTrack() {
  if (!musicElement) return;
  loadTrack(currentTrackIndex);

  try {
    await musicElement.play();
    musicEnabled = true;
    setMusicLabel();
    setMusicStatus(`NOW PLAYING: ${playlist[currentTrackIndex].title.toUpperCase()}`);
  } catch (error) {
    musicEnabled = false;
    setMusicLabel();
    setMusicStatus(`PLAYBACK BLOCKED: ${(error && error.message ? error.message : 'UNKNOWN').toUpperCase()}`);
  }
}

async function toggleMusic() {
  if (!musicElement) return;

  if (musicEnabled && !musicElement.paused) {
    musicElement.pause();
    musicEnabled = false;
    setMusicLabel();
    setMusicStatus('PLAYER STOPPED');
    return;
  }

  await playCurrentTrack();
}

async function nextTrack() {
  currentTrackIndex = (currentTrackIndex + 1) % playlist.length;

  if (musicEnabled) {
    await playCurrentTrack();
    return;
  }

  loadTrack(currentTrackIndex);
}

function updateClock() {
  if (!toolbarClock) return;

  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/Chicago',
    hour: 'numeric',
    minute: '2-digit',
    second: '2-digit',
    hour12: true
  });

  toolbarClock.textContent = `${formatter.format(new Date())} CST`;
}

function copyIp(button) {
  if (!button || !serverIp) return;

  const value = serverIp.textContent.trim();
  const defaultLabel = button.textContent;

  const setTemporaryLabel = (label) => {
    button.textContent = label;
    window.setTimeout(() => {
      button.textContent = defaultLabel;
    }, 1200);
  };

  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(value).then(() => {
      setTemporaryLabel('COPIED');
    }).catch(() => {
      setTemporaryLabel('COPY FAILED');
    });
    return;
  }

  const helper = document.createElement('textarea');
  helper.value = value;
  helper.setAttribute('readonly', 'true');
  helper.style.position = 'absolute';
  helper.style.left = '-9999px';
  document.body.appendChild(helper);
  helper.select();

  try {
    document.execCommand('copy');
    setTemporaryLabel('COPIED');
  } catch {
    setTemporaryLabel('COPY FAILED');
  } finally {
    helper.remove();
  }
}

function setRoster(names) {
  if (!playerRoster) return;

  if (!names.length) {
    playerRoster.innerHTML = '<li>No sampled players returned right now.</li>';
    return;
  }

  playerRoster.innerHTML = names.map((name) => `<li>${name}</li>`).join('');
}

function formatRefreshTime(date) {
  return new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/Chicago',
    hour: 'numeric',
    minute: '2-digit',
    second: '2-digit',
    hour12: true
  }).format(date);
}

function applyServerStatus(status) {
  const online = status && status.players ? status.players.online : null;
  const max = status && status.players ? status.players.max : null;
  const versionName = status && status.version ? status.version.name : 'UNKNOWN';
  const description = status && status.description ? status.description : 'SERVER ONLINE';
  const names = status && status.players && Array.isArray(status.players.sample)
    ? status.players.sample.map((entry) => entry.name).filter(Boolean)
    : [];
  const playerCountText = online !== null && max !== null ? `${online} / ${max}` : 'OFFLINE';
  const onlineLabel = online !== null && max !== null ? `${online} ONLINE` : 'OFFLINE';
  const refreshText = formatRefreshTime(new Date());

  if (heroPlayerCount) heroPlayerCount.textContent = playerCountText;
  if (overviewVersion) overviewVersion.textContent = versionName.toUpperCase();
  if (overviewPlayers) overviewPlayers.textContent = playerCountText;
  if (heroVersionBadge) heroVersionBadge.textContent = versionName.toUpperCase();
  if (statusPingLabel) statusPingLabel.textContent = online !== null ? 'ONLINE' : 'OFFLINE';
  if (livePlayerCount) livePlayerCount.textContent = playerCountText;
  if (liveVersion) liveVersion.textContent = versionName.toUpperCase();
  if (liveDescription) liveDescription.textContent = String(description).toUpperCase();
  if (liveMaxPlayers) liveMaxPlayers.textContent = max !== null ? String(max) : '--';
  if (lastRefresh) lastRefresh.textContent = refreshText;
  if (rosterCountLabel) rosterCountLabel.textContent = onlineLabel;

  setRoster(names);
}

function applyOfflineState() {
  if (heroPlayerCount) heroPlayerCount.textContent = 'OFFLINE';
  if (overviewVersion) overviewVersion.textContent = 'UNREACHABLE';
  if (overviewPlayers) overviewPlayers.textContent = 'OFFLINE';
  if (heroVersionBadge) heroVersionBadge.textContent = 'SERVER CHECK FAILED';
  if (statusPingLabel) statusPingLabel.textContent = 'OFFLINE';
  if (livePlayerCount) livePlayerCount.textContent = 'OFFLINE';
  if (liveVersion) liveVersion.textContent = 'UNREACHABLE';
  if (liveDescription) liveDescription.textContent = 'SERVER STATUS COULD NOT BE READ';
  if (liveMaxPlayers) liveMaxPlayers.textContent = '--';
  if (lastRefresh) lastRefresh.textContent = formatRefreshTime(new Date());
  if (rosterCountLabel) rosterCountLabel.textContent = 'OFFLINE';
  setRoster([]);
}

async function refreshServerStatus() {
  try {
    const response = await fetch('/api/server-status', { cache: 'no-store' });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const payload = await response.json();
    if (!payload || !payload.ok || !payload.status) throw new Error('Missing status payload');
    applyServerStatus(payload.status);
  } catch {
    applyOfflineState();
  }
}

if (musicElement) {
  musicElement.addEventListener('ended', () => {
    currentTrackIndex = (currentTrackIndex + 1) % playlist.length;
    if (musicEnabled) playCurrentTrack();
  });

  musicElement.addEventListener('error', () => {
    setMusicStatus(`TRACK ERROR: ${playlist[currentTrackIndex].title.toUpperCase()}`);
  });
}

if (musicToggleBtn) {
  musicToggleBtn.addEventListener('click', () => {
    toggleMusic();
  });
}

if (musicNextBtn) {
  musicNextBtn.addEventListener('click', () => {
    nextTrack();
  });
}

if (copyIpHeroBtn) {
  copyIpHeroBtn.addEventListener('click', () => {
    copyIp(copyIpHeroBtn);
  });
}

if (copyIpJoinBtn) {
  copyIpJoinBtn.addEventListener('click', () => {
    copyIp(copyIpJoinBtn);
  });
}

loadTrack(currentTrackIndex);
setMusicLabel();
updateClock();
refreshServerStatus();

window.setInterval(updateClock, 1000);
window.setInterval(refreshServerStatus, 30000);
