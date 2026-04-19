'use strict';
/* ================================================================
   PICAZO — script.js  v4.0
   SVG vector avatars · Working timer · All bots guess · Full game
================================================================ */

/* ════════════════════════════════════════
   WORD BANK
════════════════════════════════════════ */
const WORD_BANK = [
  {w:'elephant',e:'🐘'},{w:'pizza',e:'🍕'},{w:'rainbow',e:'🌈'},
  {w:'submarine',e:'🚢'},{w:'telescope',e:'🔭'},{w:'butterfly',e:'🦋'},
  {w:'volcano',e:'🌋'},{w:'astronaut',e:'👨‍🚀'},{w:'octopus',e:'🐙'},
  {w:'lighthouse',e:'🏮'},{w:'dragon',e:'🐉'},{w:'waterfall',e:'💧'},
  {w:'pyramid',e:'🔺'},{w:'spaceship',e:'🚀'},{w:'treasure',e:'💎'},
  {w:'hurricane',e:'🌀'},{w:'keyboard',e:'⌨️'},{w:'guitar',e:'🎸'},
  {w:'sunflower',e:'🌻'},{w:'dinosaur',e:'🦕'},{w:'umbrella',e:'☂️'},
  {w:'ambulance',e:'🚑'},{w:'penguin',e:'🐧'},{w:'fireworks',e:'🎆'},
  {w:'basketball',e:'🏀'},{w:'helicopter',e:'🚁'},{w:'mushroom',e:'🍄'},
  {w:'cactus',e:'🌵'},{w:'pineapple',e:'🍍'},{w:'snowman',e:'☃️'},
  {w:'jellyfish',e:'🪼'},{w:'compass',e:'🧭'},{w:'hourglass',e:'⏳'},
  {w:'parachute',e:'🪂'},{w:'anchor',e:'⚓'},{w:'trophy',e:'🏆'},
  {w:'carousel',e:'🎠'},{w:'popcorn',e:'🍿'},{w:'flamingo',e:'🦩'},
  {w:'koala',e:'🐨'},{w:'caterpillar',e:'🐛'},{w:'calculator',e:'🧮'},
  {w:'hamster',e:'🐹'},{w:'croissant',e:'🥐'},{w:'sailboat',e:'⛵'},
  {w:'tornado',e:'🌪️'},{w:'scorpion',e:'🦂'},{w:'ferris wheel',e:'🎡'},
];

/* ════════════════════════════════════════
   SVG VECTOR AVATARS (16 characters)
   Each returns an SVG string at 108×108
════════════════════════════════════════ */
const AVATAR_DEFS = [
  /* 0 */ { name:'Alex',    gender:'m', bg:'#dbeafe', skin:'#fde68a', hair:'#1c1917', shirt:'#3b82f6', accent:'#2563eb' },
  /* 1 */ { name:'Jamie',   gender:'f', bg:'#fce7f3', skin:'#fde68a', hair:'#7c3aed', shirt:'#ec4899', accent:'#be185d' },
  /* 2 */ { name:'Morgan',  gender:'m', bg:'#dcfce7', skin:'#d97706', hair:'#451a03', shirt:'#16a34a', accent:'#15803d' },
  /* 3 */ { name:'Taylor',  gender:'f', bg:'#fef3c7', skin:'#fbbf24', hair:'#92400e', shirt:'#f59e0b', accent:'#b45309' },
  /* 4 */ { name:'Jordan',  gender:'m', bg:'#ede9fe', skin:'#f5d0a9', hair:'#1e1b4b', shirt:'#7c3aed', accent:'#5b21b6' },
  /* 5 */ { name:'Casey',   gender:'f', bg:'#ffe4e6', skin:'#fecaca', hair:'#be123c', shirt:'#f43f5e', accent:'#e11d48' },
  /* 6 */ { name:'Riley',   gender:'m', bg:'#cffafe', skin:'#fde68a', hair:'#7c2d12', shirt:'#0891b2', accent:'#0e7490' },
  /* 7 */ { name:'Quinn',   gender:'f', bg:'#d1fae5', skin:'#d97706', hair:'#064e3b', shirt:'#10b981', accent:'#059669' },
  /* 8 */ { name:'Sage',    gender:'m', bg:'#f0fdf4', skin:'#c8a97e', hair:'#0f172a', shirt:'#6366f1', accent:'#4338ca' },
  /* 9 */ { name:'Nova',    gender:'f', bg:'#e0f2fe', skin:'#fbbf24', hair:'#1d4ed8', shirt:'#38bdf8', accent:'#0284c7' },
  /* 10 */{ name:'Blake',   gender:'m', bg:'#fff7ed', skin:'#b45309', hair:'#1c1917', shirt:'#ea580c', accent:'#c2410c' },
  /* 11 */{ name:'Rowan',   gender:'f', bg:'#fdf4ff', skin:'#fde68a', hair:'#6b21a8', shirt:'#a855f7', accent:'#7e22ce' },
  /* 12 */{ name:'Avery',   gender:'f', bg:'#fff1f2', skin:'#fecaca', hair:'#9f1239', shirt:'#fb7185', accent:'#e11d48' },
  /* 13 */{ name:'Phoenix', gender:'m', bg:'#fef9c3', skin:'#d97706', hair:'#422006', shirt:'#ca8a04', accent:'#a16207' },
  /* 14 */{ name:'Ember',   gender:'f', bg:'#ffe4e6', skin:'#fde68a', hair:'#7f1d1d', shirt:'#ef4444', accent:'#dc2626' },
  /* 15 */{ name:'Storm',   gender:'m', bg:'#f1f5f9', skin:'#94a3b8', hair:'#1e293b', shirt:'#475569', accent:'#334155' },
];

function buildAvatarSVG(def, size) {
  const s = size || 108;
  const cx = s / 2;
  // colours
  const bg     = def.bg;
  const skin   = def.skin;
  const hair   = def.hair;
  const shirt  = def.shirt;
  const acc    = def.accent;
  const isFem  = def.gender === 'f';

  // head proportions
  const headR  = s * 0.195;
  const headCY = s * 0.385;
  const neckH  = s * 0.08;
  const bodyY  = headCY + headR + neckH;
  const bodyW  = s * 0.52;
  const bodyH  = s * 0.28;

  // hair
  let hairSVG = '';
  if (isFem) {
    // long flowing hair behind head
    hairSVG = `
      <ellipse cx="${cx}" cy="${headCY + headR * 0.55}" rx="${headR * 1.25}" ry="${headR * 1.6}" fill="${hair}"/>
      <ellipse cx="${cx - headR * 0.9}" cy="${headCY + headR * 0.5}" rx="${headR * 0.38}" ry="${headR * 0.9}" fill="${hair}"/>
      <ellipse cx="${cx + headR * 0.9}" cy="${headCY + headR * 0.5}" rx="${headR * 0.38}" ry="${headR * 0.9}" fill="${hair}"/>
      <ellipse cx="${cx}" cy="${headCY - headR * 0.72}" rx="${headR * 1.08}" ry="${headR * 0.52}" fill="${hair}"/>
    `;
    if (Math.abs(def.name.charCodeAt(0) % 3) === 1) {
      // bun variant
      hairSVG += `<circle cx="${cx}" cy="${headCY - headR * 1.2}" r="${headR * 0.42}" fill="${hair}"/>`;
    }
  } else {
    // short male hair cap
    hairSVG = `
      <ellipse cx="${cx}" cy="${headCY - headR * 0.65}" rx="${headR * 1.1}" ry="${headR * 0.62}" fill="${hair}"/>
    `;
    // beard variant for some males
    if (def.name.charCodeAt(0) % 4 === 2) {
      hairSVG += `<ellipse cx="${cx}" cy="${headCY + headR * 0.62}" rx="${headR * 0.44}" ry="${headR * 0.3}" fill="${hair}" opacity="0.8"/>`;
    }
  }

  // glasses for certain characters
  const hasGlasses = def.name.charCodeAt(0) % 5 === 0;
  const glassesColor = '#334155';
  const eyeOffX = headR * 0.4;
  const eyeY    = headCY - headR * 0.1;
  let glassesSVG = '';
  if (hasGlasses) {
    glassesSVG = `
      <circle cx="${cx - eyeOffX}" cy="${eyeY}" r="${headR * 0.22}" fill="rgba(186,230,253,0.35)" stroke="${glassesColor}" stroke-width="${headR * 0.09}"/>
      <circle cx="${cx + eyeOffX}" cy="${eyeY}" r="${headR * 0.22}" fill="rgba(186,230,253,0.35)" stroke="${glassesColor}" stroke-width="${headR * 0.09}"/>
      <line x1="${cx - eyeOffX + headR * 0.22}" y1="${eyeY}" x2="${cx + eyeOffX - headR * 0.22}" y2="${eyeY}" stroke="${glassesColor}" stroke-width="${headR * 0.08}"/>
      <line x1="${cx - eyeOffX - headR * 0.22}" y1="${eyeY - 1}" x2="${cx - headR}" y2="${eyeY - 2}" stroke="${glassesColor}" stroke-width="${headR * 0.08}"/>
      <line x1="${cx + eyeOffX + headR * 0.22}" y1="${eyeY - 1}" x2="${cx + headR}" y2="${eyeY - 2}" stroke="${glassesColor}" stroke-width="${headR * 0.08}"/>
    `;
  }

  // hat variant for some
  const hasHat = def.name.charCodeAt(1) % 4 === 0;
  let hatSVG = '';
  if (hasHat) {
    hatSVG = `
      <rect x="${cx - headR * 0.75}" y="${headCY - headR * 1.42}" width="${headR * 1.5}" height="${headR * 0.85}" rx="${headR * 0.12}" fill="${acc}"/>
      <rect x="${cx - headR * 1.05}" y="${headCY - headR * 0.65}" width="${headR * 2.1}" height="${headR * 0.22}" rx="${headR * 0.1}" fill="${acc}"/>
    `;
  }

  // blush for females
  const blushSVG = isFem ? `
    <ellipse cx="${cx - eyeOffX * 1.1}" cy="${headCY + headR * 0.32}" rx="${headR * 0.28}" ry="${headR * 0.18}" fill="rgba(251,146,60,0.28)"/>
    <ellipse cx="${cx + eyeOffX * 1.1}" cy="${headCY + headR * 0.32}" rx="${headR * 0.28}" ry="${headR * 0.18}" fill="rgba(251,146,60,0.28)"/>
  ` : '';

  // ear studs for females
  const earSVG = isFem ? `
    <circle cx="${cx - headR - headR * 0.02}" cy="${headCY + headR * 0.08}" r="${headR * 0.1}" fill="${acc}"/>
    <circle cx="${cx + headR + headR * 0.02}" cy="${headCY + headR * 0.08}" r="${headR * 0.1}" fill="${acc}"/>
  ` : '';

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${s} ${s}" width="${s}" height="${s}">
  <!-- bg -->
  <rect width="${s}" height="${s}" rx="${s * 0.18}" fill="${bg}"/>
  <!-- subtle pattern -->
  <rect width="${s}" height="${s}" rx="${s * 0.18}" fill="url(#grad_${def.name})" opacity="0.3"/>
  <defs>
    <radialGradient id="grad_${def.name}" cx="50%" cy="30%" r="70%">
      <stop offset="0%" stop-color="#ffffff" stop-opacity="0.5"/>
      <stop offset="100%" stop-color="${acc}" stop-opacity="0.1"/>
    </radialGradient>
  </defs>

  <!-- hair back -->
  ${hairSVG}

  <!-- neck -->
  <rect x="${cx - s * 0.07}" y="${headCY + headR * 0.78}" width="${s * 0.14}" height="${neckH + 4}" fill="${skin}"/>

  <!-- shirt / body -->
  <rect x="${cx - bodyW / 2}" y="${bodyY}" width="${bodyW}" height="${bodyH}" rx="${s * 0.08}" fill="${shirt}"/>
  <!-- shirt collar -->
  <path d="M${cx - s * 0.1},${bodyY} L${cx},${bodyY + s * 0.04} L${cx + s * 0.1},${bodyY}" fill="white" opacity="0.4"/>

  <!-- head -->
  <ellipse cx="${cx}" cy="${headCY}" rx="${headR}" ry="${headR * 1.08}" fill="${skin}"/>

  <!-- ears -->
  <ellipse cx="${cx - headR - 1}" cy="${headCY + headR * 0.05}" rx="${headR * 0.18}" ry="${headR * 0.25}" fill="${skin}"/>
  <ellipse cx="${cx + headR + 1}" cy="${headCY + headR * 0.05}" rx="${headR * 0.18}" ry="${headR * 0.25}" fill="${skin}"/>
  ${earSVG}

  <!-- hat (above hair front) -->
  ${hatSVG}

  <!-- eyebrows -->
  <path d="M${cx - eyeOffX - headR * 0.18},${eyeY - headR * 0.35} Q${cx - eyeOffX},${eyeY - headR * 0.42} ${cx - eyeOffX + headR * 0.18},${eyeY - headR * 0.35}" fill="none" stroke="${hair}" stroke-width="${headR * 0.1}" stroke-linecap="round"/>
  <path d="M${cx + eyeOffX - headR * 0.18},${eyeY - headR * 0.35} Q${cx + eyeOffX},${eyeY - headR * 0.42} ${cx + eyeOffX + headR * 0.18},${eyeY - headR * 0.35}" fill="none" stroke="${hair}" stroke-width="${headR * 0.1}" stroke-linecap="round"/>

  <!-- eyes white -->
  <ellipse cx="${cx - eyeOffX}" cy="${eyeY}" rx="${headR * 0.2}" ry="${headR * 0.24}" fill="white"/>
  <ellipse cx="${cx + eyeOffX}" cy="${eyeY}" rx="${headR * 0.2}" ry="${headR * 0.24}" fill="white"/>
  <!-- iris -->
  <circle cx="${cx - eyeOffX}" cy="${eyeY + 1}" r="${headR * 0.13}" fill="${acc}"/>
  <circle cx="${cx + eyeOffX}" cy="${eyeY + 1}" r="${headR * 0.13}" fill="${acc}"/>
  <!-- pupil -->
  <circle cx="${cx - eyeOffX}" cy="${eyeY + 1}" r="${headR * 0.065}" fill="#0f172a"/>
  <circle cx="${cx + eyeOffX}" cy="${eyeY + 1}" r="${headR * 0.065}" fill="#0f172a"/>
  <!-- eye shine -->
  <circle cx="${cx - eyeOffX + headR * 0.07}" cy="${eyeY - headR * 0.06}" r="${headR * 0.045}" fill="white"/>
  <circle cx="${cx + eyeOffX + headR * 0.07}" cy="${eyeY - headR * 0.06}" r="${headR * 0.045}" fill="white"/>

  <!-- glasses (on top of eyes) -->
  ${glassesSVG}

  <!-- nose -->
  <path d="M${cx - headR * 0.06},${headCY + headR * 0.15} L${cx},${headCY + headR * 0.32} L${cx + headR * 0.06},${headCY + headR * 0.15}" fill="none" stroke="${skin === '#fde68a' ? '#d97706' : '#92400e'}" stroke-width="${headR * 0.07}" stroke-linecap="round"/>

  <!-- blush -->
  ${blushSVG}

  <!-- mouth -->
  <path d="M${cx - headR * 0.22},${headCY + headR * 0.52} Q${cx},${headCY + headR * ${isFem ? 0.68 : 0.65}} ${cx + headR * 0.22},${headCY + headR * 0.52}" fill="none" stroke="${isFem ? '#f43f5e' : '#b45309'}" stroke-width="${headR * 0.1}" stroke-linecap="round"/>

</svg>`;
}

/* ════════════════════════════════════════
   GAME STATE
════════════════════════════════════════ */
const PUBLIC_DEFAULTS = {
  totalRounds : 3,
  drawTime    : 90,
  botCount    : 8,   // 2–12 max
  hintsCount  : 1,   // slow = 1 hint
};

let S = {
  avatarIdx : 0,
  playerName: '',

  // public defaults (overridden by private room)
  totalRounds : PUBLIC_DEFAULTS.totalRounds,
  drawTime    : PUBLIC_DEFAULTS.drawTime,
  botCount    : PUBLIC_DEFAULTS.botCount,
  hintsCount  : PUBLIC_DEFAULTS.hintsCount,
  customWords : [],
  isPrivate   : false,

  players     : [],
  myId        : 'me',
  drawerIdx   : 0,
  round       : 1,
  currentWord : '',
  revealedIdx : [],
  guessedIds  : new Set(),
  hintsFired  : 0,

  timeLeft        : 90,
  timerInterval   : null,
  wsTimerInterval : null,

  isDrawing       : false,
  tool            : 'pencil',
  activeShapeTool : 'rect',   // rect | circle | triangle | line
  color           : '#1a1a2e',
  brushSize       : 3,
  strokes         : [],
  shapeStart      : null,
  snapBeforeShape : null,
  isDrawer        : false,

  isMuted   : false,
  ctxTarget : null,
  dpr       : window.devicePixelRatio || 1,
};

const CIRC = 2 * Math.PI * 25; // SVG timer circumference

/* ════════════════════════════════════════
   DOM REFS
════════════════════════════════════════ */
const $ = id => document.getElementById(id);

const screenLobby = $('screen-lobby');
const screenGame  = $('screen-game');

// lobby
const btnAvPrev = $('btn-av-prev');
const btnAvNext = $('btn-av-next');
const avDisplay = $('av-display');
const avNameBadge = $('av-name-badge');
const avFrame   = $('av-frame');
const avDots    = $('av-dots');
const inpName   = $('inp-name');
const btnPlay   = $('btn-play');
const btnPrivate= $('btn-private');

// header
const timerNum   = $('timer-num');
const tFg        = $('t-fg');
const roundBadge = $('round-badge');
const wordDisplay= $('word-display');
const wordMeta   = $('word-meta');
const btnMute    = $('btn-mute');
const muteIcon   = $('mute-icon');

// panels
const playerList   = $('player-list');
const chatMessages = $('chat-messages');
const chatInput    = $('chat-input');
const btnChatSend  = $('btn-chat-send');

// canvas
const gameCanvas = $('game-canvas');
const canvasWrap = $('canvas-wrap');
const ctx        = gameCanvas.getContext('2d', { willReadFrequently: true });

// overlays
const overlayWaiting    = $('overlay-waiting');
const overlayWordSelect = $('overlay-word-select');
const overlayRoundEnd   = $('overlay-round-end');
const wsClock           = $('ws-timer');
const wsTimerBar        = $('ws-timer-bar');
const wsCards           = $('ws-cards');
const btnCopyLink       = $('btn-copy-link');

const reEmoji     = $('re-emoji');
const reTitle     = $('re-title');
const reWordVal   = $('re-word-val');
const reScores    = $('re-scores');
const reCountdown = $('re-countdown');
const reNext      = $('re-next');

const contextMenu = $('context-menu');
const ctxName     = $('ctx-name');
const ctxPts      = $('ctx-pts');
const ctxAv       = $('ctx-av');
const voteBanner  = $('vote-banner');
const eventPopup  = $('event-popup');
const evIcon      = $('event-popup-icon');
const evMsg       = $('event-popup-msg');

/* ════════════════════════════════════════
   LOBBY — AVATAR
════════════════════════════════════════ */
function buildAvDots() {
  avDots.innerHTML = '';
  AVATAR_DEFS.forEach((_, i) => {
    const d = document.createElement('button');
    d.className = 'av-dot' + (i === S.avatarIdx ? ' active' : '');
    d.addEventListener('click', () => setAvatar(i));
    avDots.appendChild(d);
  });
}

function setAvatar(i) {
  S.avatarIdx = ((i % AVATAR_DEFS.length) + AVATAR_DEFS.length) % AVATAR_DEFS.length;
  const def = AVATAR_DEFS[S.avatarIdx];
  avDisplay.innerHTML = buildAvatarSVG(def, 108);
  avNameBadge.textContent = def.name;
  avDots.querySelectorAll('.av-dot').forEach((d, j) => d.classList.toggle('active', j === S.avatarIdx));
  avFrame.classList.add('glow');
  setTimeout(() => avFrame.classList.remove('glow'), 700);
}

buildAvDots();
setAvatar(0);

btnAvPrev.addEventListener('click', () => setAvatar(S.avatarIdx - 1));
btnAvNext.addEventListener('click', () => setAvatar(S.avatarIdx + 1));
window.addEventListener('keydown', e => {
  if (!screenLobby.classList.contains('active')) return;
  if (e.key === 'ArrowLeft')  setAvatar(S.avatarIdx - 1);
  if (e.key === 'ArrowRight') setAvatar(S.avatarIdx + 1);
});

/* ════════════════════════════════════════
   PLAY — PUBLIC (default settings)
════════════════════════════════════════ */
btnPlay.addEventListener('click', () => {
  const name = inpName.value.trim();
  if (!name) { shake(inpName); return; }
  S.playerName  = name;
  S.isPrivate   = false;
  S.totalRounds = PUBLIC_DEFAULTS.totalRounds;
  S.drawTime    = PUBLIC_DEFAULTS.drawTime;
  S.botCount    = PUBLIC_DEFAULTS.botCount;
  S.hintsCount  = PUBLIC_DEFAULTS.hintsCount;
  S.customWords = [];
  transitionToGame();
});
inpName.addEventListener('keydown', e => { if (e.key === 'Enter') btnPlay.click(); });

function shake(el) {
  el.classList.add('shake');
  setTimeout(() => el.classList.remove('shake'), 500);
  el.focus();
}

/* ════════════════════════════════════════
   PRIVATE ROOM MODAL
════════════════════════════════════════ */
const modalPrivate    = $('modal-private');
const btnStartPrivate = $('btn-start-private');
const btnCancelPrivate= $('btn-cancel-private');
const privInviteBox   = $('priv-invite-box');
const privLinkTxt     = $('priv-link-txt');
const btnCopyPriv     = $('btn-copy-priv');

btnPrivate.addEventListener('click', () => modalPrivate.classList.remove('hidden'));
btnCancelPrivate.addEventListener('click', () => { modalPrivate.classList.add('hidden'); privInviteBox.classList.add('hidden'); });
modalPrivate.addEventListener('click', e => { if (e.target === modalPrivate) { modalPrivate.classList.add('hidden'); privInviteBox.classList.add('hidden'); } });

btnStartPrivate.addEventListener('click', () => {
  const name = inpName.value.trim() || 'Host';
  S.playerName  = name;
  S.isPrivate   = true;
  S.totalRounds = +$('priv-rounds').value;
  S.drawTime    = +$('priv-time').value;
  S.botCount    = +$('priv-players').value;
  S.hintsCount  = +$('priv-hints').value;
  const raw = $('priv-words').value.trim();
  S.customWords = raw ? raw.split(',').map(w => w.trim()).filter(Boolean) : [];

  const code = Math.random().toString(36).substr(2, 6).toUpperCase();
  privLinkTxt.textContent = `https://picazo.game/r/${code}`;
  privInviteBox.classList.remove('hidden');
});

btnCopyPriv.addEventListener('click', () => {
  navigator.clipboard.writeText(privLinkTxt.textContent).catch(() => {});
  btnCopyPriv.textContent = '✓ Copied!';
  setTimeout(() => {
    btnCopyPriv.textContent = 'Copy';
    modalPrivate.classList.add('hidden');
    privInviteBox.classList.add('hidden');
    transitionToGame();
  }, 1000);
});

btnCopyLink.addEventListener('click', () => {
  navigator.clipboard.writeText(window.location.href).catch(() => {});
  btnCopyLink.textContent = '✓ Copied';
  setTimeout(() => { btnCopyLink.textContent = 'Copy'; }, 2000);
});

/* ════════════════════════════════════════
   TRANSITION
════════════════════════════════════════ */
function transitionToGame() {
  screenLobby.style.transition = 'opacity .4s, transform .4s';
  screenLobby.style.opacity    = '0';
  screenLobby.style.transform  = 'scale(1.08)';
  setTimeout(() => {
    screenLobby.classList.remove('active');
    screenLobby.style.display = 'none';
    screenGame.classList.add('active');
    setupMobileLayout();
    initGame();
  }, 420);
}

/* ════════════════════════════════════════
   MOBILE LAYOUT
════════════════════════════════════════ */
function setupMobileLayout() {
  const isMob  = window.innerWidth < 768;
  const body   = document.querySelector('.game-body');
  const lb     = $('leaderboard-panel');
  const chat   = $('chat-panel');
  let bRow     = document.querySelector('.bottom-mobile-row');

  if (isMob) {
    if (!bRow) { bRow = document.createElement('div'); bRow.className = 'bottom-mobile-row'; }
    if (!bRow.contains(lb))   bRow.appendChild(lb);
    if (!bRow.contains(chat)) bRow.appendChild(chat);
    if (!body.contains(bRow)) body.appendChild(bRow);
  } else if (bRow) {
    body.insertBefore(lb, body.firstChild);
    body.appendChild(chat);
    bRow.remove();
  }
  setTimeout(resizeCanvas, 50);
}
window.addEventListener('resize', () => { setupMobileLayout(); resizeCanvas(); });

/* ════════════════════════════════════════
   GAME INIT
════════════════════════════════════════ */
function initGame() {
  buildPlayers();
  buildColorPalette();
  setupToolbar();
  setupChat();
  setupMuteBtn();
  setupContextMenu();
  setupVoteBanner();
  initCanvas();

  overlayWaiting.classList.add('hidden');
  addChat('system', '', '🎨 Welcome to Picazo! Game starting…');
  addChat('system', '', `You are playing as ${S.playerName}.`);

  S.round     = 1;
  S.drawerIdx = 0;
  S.isDrawer  = S.players[0].id === S.myId;
  updateRoundBadge();
  buildLeaderboard();

  showEventPopup('🎮', 'Game started! Get ready!');
  setTimeout(startWordSelection, 900);
}

/* ════════════════════════════════════════
   PLAYERS
════════════════════════════════════════ */
const BOT_NAMES = ['SketchBot','ArtGeek','DrawMaster','DoodleKing','PicassoJr',
                   'BrushWizard','InkMage','PixelPro','SplatKing','DoodleFox','QuickDraw','WildStrokes'];

function buildPlayers() {
  S.players = [{ id:S.myId, name:S.playerName, avIdx:S.avatarIdx, score:0, isSelf:true, guessed:false }];
  const names = shuffled(BOT_NAMES);
  const avIdxPool = shuffled([...Array(AVATAR_DEFS.length).keys()].filter(i => i !== S.avatarIdx));
  const count = Math.max(1, Math.min(S.botCount - 1, 11));
  for (let i = 0; i < count; i++) {
    S.players.push({ id:'bot_'+i, name:names[i % names.length], avIdx:avIdxPool[i % avIdxPool.length], score:0, isSelf:false, guessed:false });
  }
  S.drawerIdx = 0;

  // join popups
  S.players.slice(1, 4).forEach((p, i) => {
    setTimeout(() => showEventPopup('👤', `${p.name} joined!`), 500 + i * 500);
  });
}

function buildLeaderboard() {
  const sorted = [...S.players].sort((a, b) => b.score - a.score);
  playerList.innerHTML = '';
  sorted.forEach((p, rank) => {
    const li = document.createElement('li');
    const isDrawer = p.id === S.players[S.drawerIdx]?.id;
    li.className = 'player-item' + (isDrawer ? ' is-drawing' : '') + (p.guessed ? ' guessed' : '');
    li.style.animationDelay = (rank * 0.04) + 's';

    const sym = rank===0?'🥇':rank===1?'🥈':rank===2?'🥉':(rank+1);
    const cls = rank===0?'gold':rank===1?'silver':rank===2?'bronze':'';

    const avWrap = document.createElement('div');
    avWrap.className = 'pi-av';
    avWrap.innerHTML = buildAvatarSVG(AVATAR_DEFS[p.avIdx], 30);

    li.innerHTML = `<div class="pi-rank ${cls}">${sym}</div>`;
    li.appendChild(avWrap);
    li.insertAdjacentHTML('beforeend', `
      <div class="pi-info">
        <div class="pi-name">${p.isSelf ? '⭐ ' : ''}${escHtml(p.name)}</div>
        <div class="pi-score">${p.score} pts</div>
      </div>
    `);
    if (isDrawer)  li.insertAdjacentHTML('beforeend', `<span class="pi-badge">✏️</span>`);
    else if (p.guessed) li.insertAdjacentHTML('beforeend', `<span class="pi-badge">✅</span>`);

    if (!p.isSelf) { li.addEventListener('click', e => openContextMenu(e, p)); }
    playerList.appendChild(li);
  });
}

function updateRoundBadge() { roundBadge.textContent = `Round ${S.round}/${S.totalRounds}`; }

/* ════════════════════════════════════════
   WORD SELECTION
════════════════════════════════════════ */
function getWordPool() {
  return S.customWords.length >= 3
    ? S.customWords.map(w => ({ w, e: '✏️' }))
    : WORD_BANK;
}

function startWordSelection() {
  S.players.forEach(p => { p.guessed = false; });
  S.guessedIds.clear();
  S.hintsFired = 0;
  buildLeaderboard();

  overlayWordSelect.classList.remove('hidden');
  const choices = shuffled(getWordPool()).slice(0, 3);

  wsCards.innerHTML = '';
  choices.forEach(w => {
    const card = document.createElement('div');
    card.className = 'ws-card';
    card.innerHTML = `<span class="ws-emoji">${w.e}</span><div class="ws-word">${S.isDrawer ? w.w : '???'}</div><div class="ws-len">${w.w.length} letter${w.w.length!==1?'s':''}</div>`;
    if (S.isDrawer) card.addEventListener('click', () => chooseWord(w.w));
    wsCards.appendChild(card);
  });

  let t = 15;
  wsClock.textContent = t;
  wsTimerBar.style.transition = 'none';
  wsTimerBar.style.width = '100%';

  clearInterval(S.wsTimerInterval);
  S.wsTimerInterval = setInterval(() => {
    t--;
    wsClock.textContent = t;
    wsTimerBar.style.transition = 'width 1s linear';
    wsTimerBar.style.width = (t / 15 * 100) + '%';
    if (t <= 0) { clearInterval(S.wsTimerInterval); chooseWord(choices[0].w); }
  }, 1000);

  if (!S.isDrawer) {
    setTimeout(() => {
      if (!overlayWordSelect.classList.contains('hidden')) chooseWord(choices[Math.floor(Math.random()*3)].w);
    }, 3200);
  }
}

function chooseWord(word) {
  clearInterval(S.wsTimerInterval);
  overlayWordSelect.classList.add('hidden');
  S.currentWord = word;
  S.revealedIdx = [];
  renderWordBlanks();
  // clear canvas for new turn
  ctx.fillStyle = 'white';
  ctx.fillRect(0, 0, gameCanvas.width / S.dpr, gameCanvas.height / S.dpr);
  S.strokes = [];
  startRoundTimer();
  addChat('system', '', `${S.players[S.drawerIdx].name} is now drawing! 🖊️`);
  scheduleBotGuesses();
}

/* ════════════════════════════════════════
   WORD BLANKS
════════════════════════════════════════ */
function renderWordBlanks() {
  wordDisplay.innerHTML = '';
  if (!S.currentWord) { wordMeta.textContent = ''; return; }
  const word = S.currentWord;
  for (let i = 0; i < word.length; i++) {
    const ch = word[i];
    if (ch === ' ') { wordDisplay.insertAdjacentHTML('beforeend', `<div style="width:12px"></div>`); continue; }
    const grp = document.createElement('div');
    grp.className = 'wb-group';
    const revealed = S.revealedIdx.includes(i);
    const charEl = document.createElement('div');
    charEl.className = 'wb-char' + (revealed && !S.isDrawer ? ' reveal' : '');
    charEl.textContent = S.isDrawer || revealed ? ch.toUpperCase() : '';
    const lw = Math.max(18, Math.floor(96 / word.length));
    grp.appendChild(charEl);
    grp.insertAdjacentHTML('beforeend', `<div class="wb-line" style="width:${lw}px"></div>`);
    wordDisplay.appendChild(grp);
  }
  wordMeta.textContent = S.isDrawer ? `You're drawing — ${word.length} letters` : `${word.length} letters`;
}

function revealHintLetter() {
  if (S.hintsFired >= S.hintsCount) return;
  const pool = S.currentWord.split('').map((_,i) => i).filter(i => !S.revealedIdx.includes(i) && S.currentWord[i] !== ' ');
  if (pool.length <= 1) return;
  S.revealedIdx.push(pool[Math.floor(Math.random() * pool.length)]);
  S.hintsFired++;
  renderWordBlanks();
  showToast('💡 A hint letter was revealed!', 't-info');
  showEventPopup('💡', 'Hint revealed!');
}

/* ════════════════════════════════════════
   TIMER  ← FIXED, fully functional
════════════════════════════════════════ */
function startRoundTimer() {
  S.timeLeft = S.drawTime;
  clearInterval(S.timerInterval);
  updateTimerUI();

  const hintAt = [];
  if (S.hintsCount >= 1) hintAt.push(Math.floor(S.drawTime * 0.6));
  if (S.hintsCount >= 2) hintAt.push(Math.floor(S.drawTime * 0.3));
  if (S.hintsCount >= 3) hintAt.push(Math.floor(S.drawTime * 0.15));

  S.timerInterval = setInterval(() => {
    S.timeLeft--;
    if (hintAt.includes(S.timeLeft)) revealHintLetter();
    updateTimerUI();
    if (S.timeLeft <= 0) {
      clearInterval(S.timerInterval);
      endRound(false);
    }
  }, 1000);
}

function updateTimerUI() {
  timerNum.textContent = S.timeLeft;
  const progress = Math.max(0, S.timeLeft / S.drawTime);
  tFg.style.strokeDashoffset = String(CIRC * (1 - progress));
  const warn = S.timeLeft <= 30;
  timerNum.className = 'timer-num' + (warn ? ' warn' : '');
  tFg.className      = 't-fg'      + (warn ? ' warn' : '');
}

/* ════════════════════════════════════════
   ROUND END / NEXT / GAME OVER
════════════════════════════════════════ */
function endRound(allGuessed) {
  clearInterval(S.timerInterval);
  clearInterval(S.wsTimerInterval);
  addChat('system', '', `⏰ Round over! The word was: "${S.currentWord}"`);
  showEventPopup('⏰', `Word was: ${S.currentWord}`);

  if (S.guessedIds.size > 0) {
    const bonus = Math.min(S.guessedIds.size * 30, 150);
    const dr = S.players[S.drawerIdx];
    if (dr) dr.score += bonus;
  }

  const sorted = [...S.players].sort((a, b) => b.score - a.score);
  reEmoji.textContent = allGuessed ? '🎉' : '⏰';
  reTitle.textContent = allGuessed ? 'Everyone guessed it!' : 'Round Over!';
  reWordVal.textContent = S.currentWord;
  reScores.innerHTML = sorted.map((p, i) =>
    `<div class="re-score-row" style="animation-delay:${i*.07}s">
       <span class="re-score-name">${i===0?'🥇':i===1?'🥈':i===2?'🥉':''} ${escHtml(p.name)}</span>
       <span class="re-score-pts">${p.score} pts</span>
     </div>`
  ).join('');
  overlayRoundEnd.classList.remove('hidden');

  let cd = 5;
  reCountdown.textContent = cd;
  reNext.style.display = '';
  const cdInt = setInterval(() => {
    cd--; reCountdown.textContent = cd;
    if (cd <= 0) { clearInterval(cdInt); overlayRoundEnd.classList.add('hidden'); nextRound(); }
  }, 1000);
}

function nextRound() {
  S.round++;
  if (S.round > S.totalRounds) { endGame(); return; }
  S.drawerIdx = (S.drawerIdx + 1) % S.players.length;
  S.isDrawer  = S.players[S.drawerIdx].id === S.myId;
  updateRoundBadge();
  S.currentWord = ''; S.revealedIdx = [];
  renderWordBlanks(); buildLeaderboard();
  addChat('system', '', `🔄 Round ${S.round} — ${S.players[S.drawerIdx].name} draws!`);
  showEventPopup('🎨', `${S.players[S.drawerIdx].name} is drawing!`);
  startWordSelection();
}

function endGame() {
  clearInterval(S.timerInterval);
  const winner = [...S.players].sort((a, b) => b.score - a.score)[0];
  addChat('system', '', `🏆 Game Over! ${winner.name} wins with ${winner.score} pts!`);
  showToast(`🏆 ${winner.name} wins! GG!`, 't-gold');
  showEventPopup('🏆', `${winner.name} wins the game!`);
  reEmoji.textContent = '🏆';
  reTitle.textContent = 'Game Over!';
  $('re-word').innerHTML = `Winner: <strong>${escHtml(winner.name)}</strong>`;
  reWordVal.textContent = '';
  reNext.style.display = 'none';
  reScores.innerHTML = [...S.players].sort((a,b)=>b.score-a.score).map((p,i)=>
    `<div class="re-score-row"><span class="re-score-name">${i===0?'🥇':i===1?'🥈':i===2?'🥉':''} ${escHtml(p.name)}</span><span class="re-score-pts">${p.score} pts</span></div>`
  ).join('');
  overlayRoundEnd.classList.remove('hidden');
}

/* ════════════════════════════════════════
   BOT GUESSES — ALL bots will guess correctly
════════════════════════════════════════ */
const FAKE_GUESSES = ['is it a bird?','maybe a house?','cat!','hmm...','car?','tree!','airplane?','looks like a dog','flower?','mountain!','ship?','I think I know!','animal?','food?','sports?'];

function scheduleBotGuesses() {
  // All non-drawer bots will eventually guess correctly
  const bots = S.players.filter(p => !p.isSelf && p.id !== S.players[S.drawerIdx]?.id);

  bots.forEach((bot, idx) => {
    const fakeDelay   = 3000 + idx * 1800 + Math.random() * 2000;
    const correctDelay= 8000 + idx * 3500 + Math.random() * 3000;

    // Fake guess first
    setTimeout(() => {
      if (!S.currentWord || bot.guessed) return;
      addChat('normal', bot.name, FAKE_GUESSES[Math.floor(Math.random() * FAKE_GUESSES.length)]);
    }, fakeDelay);

    // Then always guess correctly (guaranteed)
    setTimeout(() => {
      if (!S.currentWord || bot.guessed) return;
      botGuessCorrect(bot);
    }, correctDelay);
  });
}

function botGuessCorrect(bot) {
  if (bot.guessed) return;
  const pts = Math.max(10, Math.round(S.timeLeft / S.drawTime * 100));
  bot.score += pts;
  bot.guessed = true;
  S.guessedIds.add(bot.id);
  addChat('correct', bot.name, `🎉 Guessed the word! (+${pts} pts)`);
  showToast(`✅ ${bot.name} guessed it!`, 't-correct');
  showEventPopup('✅', `${bot.name} guessed correctly!`);
  buildLeaderboard();
  floatPoints(`+${pts}`, window.innerWidth * 0.5, window.innerHeight * 0.45);

  // Check if all non-drawers guessed
  const nonDrawers = S.players.filter(p => p.id !== S.players[S.drawerIdx]?.id);
  if (nonDrawers.every(p => p.guessed)) {
    clearInterval(S.timerInterval);
    setTimeout(() => endRound(true), 900);
  }
}

/* ════════════════════════════════════════
   CANVAS
════════════════════════════════════════ */
function initCanvas() {
  resizeCanvas();
  gameCanvas.addEventListener('pointerdown',   onDown);
  gameCanvas.addEventListener('pointermove',   onMove);
  gameCanvas.addEventListener('pointerup',     onUp);
  gameCanvas.addEventListener('pointercancel', onUp);
}

function resizeCanvas() {
  const rect = canvasWrap.getBoundingClientRect();
  const W = Math.floor(rect.width), H = Math.floor(rect.height);
  if (!W || !H) return;
  S.dpr = window.devicePixelRatio || 1;
  let snap = null;
  if (gameCanvas.width > 0 && gameCanvas.height > 0) {
    try { snap = ctx.getImageData(0, 0, gameCanvas.width, gameCanvas.height); } catch(e) {}
  }
  gameCanvas.width  = W * S.dpr;
  gameCanvas.height = H * S.dpr;
  gameCanvas.style.width  = W + 'px';
  gameCanvas.style.height = H + 'px';
  ctx.scale(S.dpr, S.dpr);
  ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  ctx.fillStyle = 'white'; ctx.fillRect(0, 0, W, H);
  if (snap) {
    const tmp = document.createElement('canvas');
    tmp.width = snap.width; tmp.height = snap.height;
    tmp.getContext('2d').putImageData(snap, 0, 0);
    ctx.drawImage(tmp, 0, 0, W, H);
  }
}

function xy(e) {
  const r = gameCanvas.getBoundingClientRect();
  return { x: e.clientX - r.left, y: e.clientY - r.top };
}

function onDown(e) {
  if (!S.isDrawer) return;
  gameCanvas.setPointerCapture(e.pointerId);
  S.isDrawing = true;
  const p = xy(e);

  if (S.tool === 'fill') { floodFill(p.x, p.y, S.color); S.isDrawing = false; return; }
  if (['rect','circle','triangle','line'].includes(S.tool)) {
    S.shapeStart = p;
    S.snapBeforeShape = ctx.getImageData(0, 0, gameCanvas.width, gameCanvas.height);
    return;
  }
  ctx.beginPath(); ctx.moveTo(p.x, p.y);
  applyBrush();
}

function onMove(e) {
  if (!S.isDrawer || !S.isDrawing) return;
  const p = xy(e);
  if (['rect','circle','triangle','line'].includes(S.tool) && S.snapBeforeShape) {
    ctx.putImageData(S.snapBeforeShape, 0, 0);
    applyBrush();
    drawShape(S.tool, S.shapeStart, p);
    return;
  }
  ctx.lineTo(p.x, p.y); ctx.stroke();
}

function onUp(e) {
  if (!S.isDrawer) return;
  gameCanvas.releasePointerCapture(e.pointerId);
  if (!S.isDrawing) return;
  S.isDrawing = false;
  if (['rect','circle','triangle','line'].includes(S.tool) && S.shapeStart) {
    const p = xy(e);
    ctx.putImageData(S.snapBeforeShape, 0, 0);
    applyBrush();
    drawShape(S.tool, S.shapeStart, p);
    S.shapeStart = null;
  } else {
    ctx.closePath();
  }
  saveStroke();
}

function drawShape(tool, a, b) {
  const w = b.x - a.x, h = b.y - a.y;
  ctx.beginPath();
  if (tool === 'rect') {
    ctx.strokeRect(a.x, a.y, w, h);
    ctx.fillStyle = S.color + '18'; ctx.fillRect(a.x, a.y, w, h);
  } else if (tool === 'circle') {
    const rx = Math.abs(w)/2, ry = Math.abs(h)/2;
    ctx.ellipse(a.x + w/2, a.y + h/2, rx, ry, 0, 0, Math.PI*2);
    ctx.stroke();
    ctx.fillStyle = S.color + '18'; ctx.fill();
  } else if (tool === 'triangle') {
    ctx.moveTo(a.x + w/2, a.y);
    ctx.lineTo(a.x + w, a.y + h);
    ctx.lineTo(a.x, a.y + h);
    ctx.closePath(); ctx.stroke();
    ctx.fillStyle = S.color + '18'; ctx.fill();
  } else if (tool === 'line') {
    ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
  }
}

function applyBrush() {
  const isE = S.tool === 'eraser';
  ctx.strokeStyle = isE ? '#ffffff' : S.color;
  ctx.fillStyle   = S.color + '18';
  ctx.lineWidth   = isE ? S.brushSize * 3 : S.brushSize;
  ctx.globalCompositeOperation = isE ? 'destination-out' : 'source-over';
}

function saveStroke() {
  try {
    S.strokes.push(ctx.getImageData(0, 0, gameCanvas.width, gameCanvas.height));
    if (S.strokes.length > 30) S.strokes.shift();
  } catch(e) {}
  ctx.globalCompositeOperation = 'source-over';
}

function floodFill(sx, sy, hex) {
  const W = gameCanvas.width, H = gameCanvas.height;
  const id = ctx.getImageData(0, 0, W, H), d = id.data;
  const xi = Math.round(sx * S.dpr), yi = Math.round(sy * S.dpr);
  if (xi < 0 || xi >= W || yi < 0 || yi >= H) return;
  const idx0 = (yi * W + xi) * 4;
  const tr = d[idx0], tg = d[idx0+1], tb = d[idx0+2], ta = d[idx0+3];
  const m  = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!m) return;
  const fc = { r:parseInt(m[1],16), g:parseInt(m[2],16), b:parseInt(m[3],16) };
  if (tr===fc.r && tg===fc.g && tb===fc.b && ta===255) return;
  function match(i) { return Math.abs(d[i]-tr)<30&&Math.abs(d[i+1]-tg)<30&&Math.abs(d[i+2]-tb)<30&&Math.abs(d[i+3]-ta)<30; }
  const stack = [xi + yi * W], seen = new Uint8Array(W * H);
  while (stack.length) {
    const p = stack.pop(); if (seen[p]) continue;
    const x = p % W, y = Math.floor(p/W);
    if (x<0||x>=W||y<0||y>=H) continue;
    const i = p*4; if (!match(i)) continue;
    seen[p]=1; d[i]=fc.r; d[i+1]=fc.g; d[i+2]=fc.b; d[i+3]=255;
    if (x+1<W) stack.push(p+1); if (x-1>=0) stack.push(p-1);
    if (y+1<H) stack.push(p+W); if (y-1>=0) stack.push(p-W);
  }
  ctx.putImageData(id, 0, 0);
  saveStroke();
}

/* ════════════════════════════════════════
   TOOLBAR — glassmorphism popup
════════════════════════════════════════ */
function setupToolbar() {
  // Pen
  $('tool-pencil').addEventListener('click', () => { selectTool('pencil'); closeAllPopups(); });

  // Eraser
  $('tool-eraser').addEventListener('click', () => { selectTool('eraser'); closeAllPopups(); });

  // Fill
  $('tool-fill').addEventListener('click', () => { selectTool('fill'); closeAllPopups(); });

  // Undo
  $('tool-undo').addEventListener('click', () => {
    if (S.strokes.length > 1) {
      S.strokes.pop();
      ctx.putImageData(S.strokes[S.strokes.length-1], 0, 0);
    } else {
      ctx.fillStyle = 'white'; ctx.fillRect(0, 0, gameCanvas.width/S.dpr, gameCanvas.height/S.dpr);
      S.strokes = [];
    }
  });

  // Clear
  $('tool-clear').addEventListener('click', () => {
    ctx.fillStyle = 'white'; ctx.fillRect(0, 0, gameCanvas.width/S.dpr, gameCanvas.height/S.dpr);
    S.strokes = []; showToast('🗑️ Canvas cleared', 't-info');
  });

  // Size popup
  const pSize = $('popup-size');
  $('btn-size-popup').addEventListener('click', e => {
    e.stopPropagation();
    const wasHidden = pSize.classList.contains('hidden');
    closeAllPopups();
    if (wasHidden) pSize.classList.remove('hidden');
  });
  $('size-slider').addEventListener('input', e => {
    S.brushSize = +e.target.value;
    $('size-val-txt').textContent = S.brushSize;
    const sp = $('size-preview');
    const sz = Math.min(S.brushSize, 36);
    sp.style.width = sz + 'px'; sp.style.height = sz + 'px';
  });

  // Color popup
  const pColor = $('popup-color');
  $('btn-color-popup').addEventListener('click', e => {
    e.stopPropagation();
    const wasHidden = pColor.classList.contains('hidden');
    closeAllPopups();
    if (wasHidden) pColor.classList.remove('hidden');
  });
  $('color-picker').addEventListener('input', e => pickColor(e.target.value));

  // Shape popup
  const pShape = $('popup-shape');
  $('btn-shape-popup').addEventListener('click', e => {
    e.stopPropagation();
    const wasHidden = pShape.classList.contains('hidden');
    closeAllPopups();
    if (wasHidden) pShape.classList.remove('hidden');
  });
  ['rect','circle','triangle','line'].forEach(t => {
    const btn = $(` tool-${t}`);
    // use querySelector since ids have no space
    const el = document.getElementById('tool-' + t);
    if (!el) return;
    el.addEventListener('click', () => {
      S.activeShapeTool = t;
      selectTool(t);
      document.querySelectorAll('.shape-btn').forEach(b => b.classList.toggle('active', b.id === 'tool-' + t));
      // show active shape icon on shape popup button
      $('btn-shape-popup').querySelector('svg').style.opacity = '1';
      setTimeout(() => pShape.classList.add('hidden'), 300);
    });
  });

  // Close popups on outside click
  document.addEventListener('click', () => closeAllPopups());
  // prevent canvas from closing popups
  gameCanvas.addEventListener('click', e => e.stopPropagation());
}

function closeAllPopups() {
  ['popup-size','popup-color','popup-shape'].forEach(id => {
    const el = $(id); if (el) el.classList.add('hidden');
  });
}

function buildColorPalette() {
  const COLORS = [
    '#1a1a2e','#ffffff','#c0c0c0','#808080',
    '#ef4444','#f97316','#eab308','#84cc16',
    '#22c55e','#14b8a6','#3b82f6','#6366f1',
    '#8b5cf6','#ec4899','#f43f5e','#78350f',
    '#064e3b','#1e3a5f','#4a044e','#0c0a09',
  ];
  $('color-palette').innerHTML = COLORS.map(hex =>
    `<div class="c-swatch ${hex===S.color?'active':''}" style="background:${hex}" onclick="pickColor('${hex}')"></div>`
  ).join('');
}

function pickColor(hex) {
  S.color = hex;
  $('color-indicator').style.background = hex;
  $('color-picker').value = hex;
  document.querySelectorAll('.c-swatch').forEach(s => s.classList.toggle('active', s.style.background === hex));
  if (S.tool === 'eraser') selectTool('pencil');
}

function selectTool(tool) {
  S.tool = tool;
  document.querySelectorAll('.tool-btn[data-tool]').forEach(b =>
    b.classList.toggle('active', b.id === 'tool-' + tool)
  );
  // shape selector btn stays lit when any shape is active
  const shapeBtn = $('btn-shape-popup');
  const isShape  = ['rect','circle','triangle','line'].includes(tool);
  if (shapeBtn) shapeBtn.classList.toggle('active', isShape);
  gameCanvas.className = tool === 'eraser' ? 'eraser' : '';
}

/* ════════════════════════════════════════
   CHAT
════════════════════════════════════════ */
function setupChat() {
  btnChatSend.addEventListener('click', sendGuess);
  chatInput.addEventListener('keydown', e => { if (e.key === 'Enter') { e.preventDefault(); sendGuess(); } });
  chatInput.addEventListener('focus', () => {
    setTimeout(() => chatInput.scrollIntoView({ behavior:'smooth', block:'nearest' }), 300);
  });
}

function sendGuess() {
  const val = chatInput.value.trim();
  if (!val) return;
  chatInput.value = '';

  if (S.isDrawer || S.guessedIds.has(S.myId)) { addChat('normal', S.playerName, val); return; }

  const guess = val.toLowerCase().trim();
  const word  = (S.currentWord||'').toLowerCase();

  if (word && guess === word) {
    const pts = Math.max(10, Math.round(S.timeLeft / S.drawTime * 100));
    const me  = S.players.find(p => p.isSelf);
    if (me) { me.score += pts; me.guessed = true; }
    S.guessedIds.add(S.myId);
    addChat('correct', S.playerName, `🎉 Guessed it! (+${pts} pts)`);
    showToast(`✅ You guessed it! +${pts} pts`, 't-correct');
    showEventPopup('🎉', `${S.playerName} guessed it! +${pts}`);
    buildLeaderboard();
    floatPoints(`+${pts}`, window.innerWidth * 0.5, window.innerHeight * 0.4);
    const nonD = S.players.filter(p => p.id !== S.players[S.drawerIdx]?.id);
    if (nonD.every(p => p.guessed)) { clearInterval(S.timerInterval); setTimeout(() => endRound(true), 800); }
  } else if (word && levenshtein(guess, word) <= 1) {
    addChat('close', S.playerName, val + ' ← so close!');
    showToast('🔥 So close!', 't-info');
  } else {
    addChat('normal', S.playerName, val);
  }
}

function addChat(type, name, text) {
  const div = document.createElement('div');
  div.className = 'chat-msg ' + (type==='correct'?'correct':type==='system'?'system':type==='close'?'close':'normal');
  div.innerHTML = type === 'system'
    ? `<span class="msg-text">${escHtml(text)}</span>`
    : `<span class="msg-name">${escHtml(name)}:</span> <span class="msg-text">${escHtml(text)}</span>`;
  chatMessages.appendChild(div);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

/* ════════════════════════════════════════
   MUTE
════════════════════════════════════════ */
function setupMuteBtn() {
  btnMute.addEventListener('click', () => {
    S.isMuted = !S.isMuted;
    muteIcon.innerHTML = S.isMuted
      ? `<polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><line x1="23" y1="9" x2="17" y2="15"/><line x1="17" y1="9" x2="23" y2="15"/>`
      : `<polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"/>`;
    btnMute.style.color = S.isMuted ? '#f0525e' : '';
    showToast(S.isMuted ? '🔇 Muted' : '🔊 Sound on', 't-info');
  });
}

/* ════════════════════════════════════════
   CONTEXT MENU
════════════════════════════════════════ */
function setupContextMenu() {
  document.addEventListener('click', e => { if (!contextMenu.contains(e.target)) contextMenu.classList.add('hidden'); });
  $('ctx-kick').addEventListener('click', () => { contextMenu.classList.add('hidden'); if (S.ctxTarget) initiateVoteKick(S.ctxTarget); });
  $('ctx-report').addEventListener('click', () => {
    contextMenu.classList.add('hidden');
    if (S.ctxTarget) { showToast(`🚩 ${S.ctxTarget.name} reported`, 't-warn'); showEventPopup('🚩', `${S.ctxTarget.name} reported!`); }
  });
  $('ctx-mute').addEventListener('click', () => {
    if (S.ctxTarget) showToast(`🔇 ${S.ctxTarget.name} muted locally`, 't-info');
    contextMenu.classList.add('hidden');
  });
  $('ctx-close').addEventListener('click', () => contextMenu.classList.add('hidden'));
}

function openContextMenu(e, player) {
  e.stopPropagation();
  S.ctxTarget = player;
  ctxName.textContent = player.name;
  ctxPts.textContent  = player.score + ' pts';
  ctxAv.innerHTML = buildAvatarSVG(AVATAR_DEFS[player.avIdx], 36);
  contextMenu.classList.remove('hidden');
  contextMenu.style.left = Math.min(e.clientX, window.innerWidth  - 200) + 'px';
  contextMenu.style.top  = Math.min(e.clientY, window.innerHeight - 250) + 'px';
}

function setupVoteBanner() {
  $('btn-vote-yes').addEventListener('click', () => {
    voteBanner.classList.add('hidden');
    if (S.ctxTarget) {
      const name = S.ctxTarget.name;
      S.players = S.players.filter(p => p.id !== S.ctxTarget.id);
      buildLeaderboard();
      addChat('system', '', `🚪 ${name} was kicked by vote.`);
      showToast(`🚪 ${name} was kicked`, 't-warn');
      showEventPopup('🚪', `${name} was kicked!`);
    }
  });
  $('btn-vote-no').addEventListener('click', () => { voteBanner.classList.add('hidden'); showToast('✅ Vote cancelled', 't-info'); });
}

function initiateVoteKick(player) {
  $('vote-title').textContent = `Vote to kick ${player.name}?`;
  $('vote-sub').textContent   = `${Math.ceil(S.players.length * 0.7)} of ${S.players.length} votes needed`;
  voteBanner.classList.remove('hidden');
  showEventPopup('🗳️', `Vote to kick ${player.name}?`);
  setTimeout(() => voteBanner.classList.add('hidden'), 12000);
}

/* ════════════════════════════════════════
   EVENT POPUP
════════════════════════════════════════ */
let _epT = null;
function showEventPopup(icon, msg) {
  evIcon.textContent = icon; evMsg.textContent = msg;
  eventPopup.classList.remove('hidden');
  clearTimeout(_epT);
  _epT = setTimeout(() => eventPopup.classList.add('hidden'), 2800);
}

/* ════════════════════════════════════════
   TOAST
════════════════════════════════════════ */
function showToast(msg, type = 't-info') {
  const tc = $('toast-container');
  const t  = document.createElement('div');
  t.className = 'toast ' + type; t.textContent = msg;
  tc.prepend(t);
  setTimeout(() => { t.classList.add('fade-out'); setTimeout(() => t.remove(), 380); }, 3800);
}

/* ════════════════════════════════════════
   FLOATING POINTS
════════════════════════════════════════ */
function floatPoints(text, x, y) {
  const el = document.createElement('div');
  el.className = 'float-pts'; el.textContent = text;
  el.style.left = x + 'px'; el.style.top = y + 'px';
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 1300);
}

/* ════════════════════════════════════════
   UTILS
════════════════════════════════════════ */
function shuffled(arr) { return [...arr].sort(() => Math.random() - 0.5); }
function escHtml(str) { return String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }
function levenshtein(a, b) {
  const m=a.length, n=b.length;
  const dp=Array.from({length:m+1},(_,i)=>Array.from({length:n+1},(_,j)=>i===0?j:j===0?i:0));
  for(let i=1;i<=m;i++) for(let j=1;j<=n;j++) dp[i][j]=a[i-1]===b[j-1]?dp[i-1][j-1]:1+Math.min(dp[i-1][j],dp[i][j-1],dp[i-1][j-1]);
  return dp[m][n];
}
