/* ================================================================
   PICAZO — script.js  |  Final Definitive Version
   Complete Skribbl.io-style game: drawing, guessing, scoring,
   near-miss detection, confetti podium, bot players, reactions
================================================================ */
'use strict';

/* ================================================================
   DATA
================================================================ */
const COLORS = [
  '#000000','#ffffff','#c0c0c0','#808080',
  '#ff0000','#ff6600','#ffcc00','#ffff00',
  '#00cc00','#00ffcc','#0088ff','#0000ff',
  '#8800ff','#ff00ff','#ff6699','#ff99cc',
  '#663300','#996600','#003366','#006633',
  '#ff4444','#44ff44','#4444ff','#ff8800',
];

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
  {w:'cactus',e:'🌵'},{w:'scorpion',e:'🦂'},{w:'pineapple',e:'🍍'},
  {w:'snowman',e:'☃️'},{w:'tornado',e:'🌪️'},{w:'jellyfish',e:'🪼'},
  {w:'compass',e:'🧭'},{w:'hourglass',e:'⏳'},{w:'microscope',e:'🔬'},
  {w:'parachute',e:'🪂'},{w:'anchor',e:'⚓'},{w:'trophy',e:'🏆'},
  {w:'popcorn',e:'🍿'},{w:'ladder',e:'🪜'},{w:'magnet',e:'🧲'},
  {w:'lantern',e:'🏮'},{w:'binoculars',e:'🔭'},{w:'windmill',e:'🌬️'},
];

const AVATAR_DEFS = [
  {name:'Alex',   skin:'#fdd09a',hair:'#3a2010',hCol:'#222',   style:'m-short', accent:'#4a8fe8'},
  {name:'Jamie',  skin:'#f9c49a',hair:'#1a0a0a',hCol:'#111',   style:'f-long',  accent:'#9c5cf8'},
  {name:'Morgan', skin:'#e8a87c',hair:'#6a3010',hCol:'#4a1a0a',style:'m-beard', accent:'#e87c4a'},
  {name:'Taylor', skin:'#fdd8b0',hair:'#8b4513',hCol:'#5a2a0a',style:'f-bun',   accent:'#4acf8a'},
  {name:'Jordan', skin:'#c8884a',hair:'#2a1808',hCol:'#1a0a00',style:'m-spec',  accent:'#f4b942'},
  {name:'Casey',  skin:'#fce0c8',hair:'#d4406a',hCol:'#a82050',style:'f-long',  accent:'#f0527a'},
  {name:'Riley',  skin:'#f0c090',hair:'#4a3020',hCol:'#2a1808',style:'m-short', accent:'#4a7ad8'},
  {name:'Quinn',  skin:'#fdd0a8',hair:'#508860',hCol:'#306040',style:'f-bun',   accent:'#50b8a8'},
  {name:'Sage',   skin:'#e8b890',hair:'#222222',hCol:'#111',   style:'m-spec',  accent:'#8060f0'},
  {name:'Nova',   skin:'#fcc0a0',hair:'#2050a0',hCol:'#102060',style:'f-long',  accent:'#2090f0'},
];

const BOT_NAMES  = ['SketchBot','ArtGeek','DrawMaster','DoodleKing','PicassoJr','BrushWizard','InkMage','PixelPro'];
const BOT_CHATS  = ['is it a bird?','house?','cat!','car?','tree!','fish?','airplane?','dog!','flower?','mountain!','rocket?','I have no idea','looks like a phone!','some kind of animal?','ooh I know this one!'];
const CIRC       = 157.08; // 2π × 25

/* ================================================================
   AVATAR RENDERER — Pure Canvas, no external images
================================================================ */
function drawAvatar(canvas, def, size = 96) {
  const c = canvas.getContext('2d');
  c.clearRect(0, 0, size, size);
  const W = size, H = size, cx = W/2, headR = W*0.22, headY = H*0.40;

  // Background
  const bg = c.createLinearGradient(0,0,W,H);
  bg.addColorStop(0, def.accent+'33'); bg.addColorStop(1, def.accent+'18');
  c.fillStyle = bg;
  _rRect(c,0,0,W,H,W*0.2); c.fill();

  // Body/shirt
  c.fillStyle = def.accent;
  c.beginPath(); c.ellipse(cx,H*0.88,W*0.28,H*0.22,0,0,Math.PI*2); c.fill();

  // Neck
  c.fillStyle = def.skin;
  c.fillRect(cx-W*0.065, headY+headR*0.8, W*0.13, H*0.1);

  // Hair back
  _hairBack(c, def.style, def.hCol, cx, headY, headR, W, H);

  // Head
  c.fillStyle = def.skin;
  c.beginPath(); c.ellipse(cx,headY,headR,headR*1.1,0,0,Math.PI*2); c.fill();

  // Ears
  [-1,1].forEach(s => {
    c.fillStyle = def.skin;
    c.beginPath(); c.ellipse(cx+s*headR*0.92, headY+headR*0.05, headR*0.2, headR*0.25,0,0,Math.PI*2); c.fill();
  });

  // Hair front
  _hairFront(c, def.style, def.hCol, cx, headY, headR, W, H);

  // Eyes
  const eyeY = headY - headR*0.08, eox = headR*0.42;
  [-1,1].forEach(s => {
    c.fillStyle='#fff'; c.beginPath(); c.ellipse(cx+s*eox,eyeY,headR*0.2,headR*0.24,0,0,Math.PI*2); c.fill();
    c.fillStyle=def.hCol; c.beginPath(); c.arc(cx+s*eox,eyeY+1,headR*0.13,0,Math.PI*2); c.fill();
    c.fillStyle='#000'; c.beginPath(); c.arc(cx+s*eox,eyeY+1,headR*0.065,0,Math.PI*2); c.fill();
    c.fillStyle='rgba(255,255,255,0.7)'; c.beginPath(); c.arc(cx+s*eox+2,eyeY-2,headR*0.04,0,Math.PI*2); c.fill();
  });

  // Eyebrows
  c.strokeStyle=def.hCol; c.lineWidth=headR*0.09; c.lineCap='round';
  [-1,1].forEach(s => {
    c.beginPath(); c.moveTo(cx+s*(eox-headR*0.16),eyeY-headR*0.3); c.lineTo(cx+s*(eox+headR*0.16),eyeY-headR*0.28); c.stroke();
  });

  // Nose
  c.strokeStyle=_shade(def.skin,-20); c.lineWidth=headR*0.07;
  c.beginPath(); c.moveTo(cx-headR*0.08,headY+headR*0.12); c.lineTo(cx,headY+headR*0.28); c.lineTo(cx+headR*0.08,headY+headR*0.12); c.stroke();

  // Mouth
  const isFemale = def.style.startsWith('f-');
  c.strokeStyle=isFemale?'#d07070':'#a06060'; c.lineWidth=headR*0.09;
  c.beginPath(); c.arc(cx,headY+headR*0.5,headR*0.22,0.15,Math.PI-0.15); c.stroke();

  // Blush
  if (isFemale) {
    [-1,1].forEach(s => {
      const g=c.createRadialGradient(cx+s*eox*1.1,headY+headR*0.35,0,cx+s*eox*1.1,headY+headR*0.35,headR*0.28);
      g.addColorStop(0,'rgba(255,160,160,0.45)'); g.addColorStop(1,'rgba(255,160,160,0)');
      c.fillStyle=g; c.beginPath(); c.ellipse(cx+s*eox*1.1,headY+headR*0.35,headR*0.28,headR*0.18,0,0,Math.PI*2); c.fill();
    });
  }

  // Beard
  if (def.style==='m-beard') {
    c.fillStyle=def.hCol+'cc';
    c.beginPath(); c.ellipse(cx,headY+headR*0.65,headR*0.4,headR*0.28,0,0,Math.PI); c.fill();
    [-0.28,0.28].forEach(dx => { c.beginPath(); c.arc(cx+headR*dx,headY+headR*0.52,headR*0.18,0,Math.PI*2); c.fill(); });
  }

  // Glasses
  if (def.style==='m-spec'||def.style==='f-spec') {
    c.strokeStyle='#445'; c.lineWidth=headR*0.1; c.fillStyle='rgba(180,220,255,0.25)';
    const gox=eox*0.95, gr=headR*0.22, gy=eyeY+1;
    [-1,1].forEach(s => { c.beginPath(); c.arc(cx+s*gox,gy,gr,0,Math.PI*2); c.fill(); c.stroke(); });
    c.beginPath(); c.moveTo(cx-gox+gr,gy); c.lineTo(cx+gox-gr,gy); c.stroke();
    c.beginPath(); c.moveTo(cx-gox-gr,gy); c.lineTo(cx-headR,gy-2); c.stroke();
    c.beginPath(); c.moveTo(cx+gox+gr,gy); c.lineTo(cx+headR,gy-2); c.stroke();
  }
}

function _hairBack(c,style,hCol,cx,headY,headR,W,H) {
  c.fillStyle=hCol;
  if (style==='f-long') { c.beginPath(); c.ellipse(cx,headY+headR*0.6,headR*1.15,headR*1.5,0,0,Math.PI*2); c.fill(); }
  else if (style==='f-bun') {
    c.beginPath(); c.ellipse(cx,headY+headR*0.5,headR*1.05,headR*1.2,0,0,Math.PI*2); c.fill();
    c.beginPath(); c.arc(cx,headY-headR*1.05,headR*0.4,0,Math.PI*2); c.fill();
  }
}
function _hairFront(c,style,hCol,cx,headY,headR,W,H) {
  c.fillStyle=hCol;
  if (style==='m-short') { c.beginPath(); c.ellipse(cx,headY-headR*0.65,headR,headR*0.55,0,Math.PI,Math.PI*2); c.fill(); }
  else if (style==='m-beard'||style==='m-spec') { c.beginPath(); c.ellipse(cx,headY-headR*0.7,headR*0.95,headR*0.48,0,Math.PI,Math.PI*2); c.fill(); }
  else if (style==='f-long') {
    c.beginPath(); c.ellipse(cx-headR*0.85,headY+headR*0.2,headR*0.32,headR*0.9,-0.2,0,Math.PI*2); c.fill();
    c.beginPath(); c.ellipse(cx+headR*0.85,headY+headR*0.2,headR*0.32,headR*0.9,0.2,0,Math.PI*2); c.fill();
    c.beginPath(); c.ellipse(cx,headY-headR*0.7,headR*0.95,headR*0.45,0,Math.PI,Math.PI*2); c.fill();
  } else if (style==='f-bun') {
    c.beginPath(); c.ellipse(cx,headY-headR*0.72,headR*0.92,headR*0.44,0,Math.PI,Math.PI*2); c.fill();
    c.beginPath(); c.ellipse(cx-headR*0.8,headY+headR*0.1,headR*0.28,headR*0.7,-0.15,0,Math.PI*2); c.fill();
    c.beginPath(); c.ellipse(cx+headR*0.8,headY+headR*0.1,headR*0.28,headR*0.7,0.15,0,Math.PI*2); c.fill();
  }
}

function _rRect(c,x,y,w,h,r) {
  if(c.roundRect){c.beginPath();c.roundRect(x,y,w,h,r);return;}
  c.beginPath();c.moveTo(x+r,y);c.lineTo(x+w-r,y);c.arcTo(x+w,y,x+w,y+r,r);
  c.lineTo(x+w,y+h-r);c.arcTo(x+w,y+h,x+w-r,y+h,r);c.lineTo(x+r,y+h);
  c.arcTo(x,y+h,x,y+h-r,r);c.lineTo(x,y+r);c.arcTo(x,y,x+r,y,r);c.closePath();
}
function _shade(hex,a) {
  const n=parseInt(hex.slice(1),16);
  const r=Math.min(255,Math.max(0,(n>>16)+a)), g=Math.min(255,Math.max(0,((n>>8)&0xff)+a)), b=Math.min(255,Math.max(0,(n&0xff)+a));
  return '#'+((1<<24)+(r<<16)+(g<<8)+b).toString(16).slice(1);
}

/* ================================================================
   LEVENSHTEIN — near-miss detection
================================================================ */
function levenshtein(a, b) {
  a = a.toLowerCase(); b = b.toLowerCase();
  const m = a.length, n = b.length;
  const dp = Array.from({length:m+1},(_,i)=>Array.from({length:n+1},(_,j)=>i===0?j:j===0?i:0));
  for(let i=1;i<=m;i++) for(let j=1;j<=n;j++) {
    dp[i][j] = a[i-1]===b[j-1] ? dp[i-1][j-1] : 1+Math.min(dp[i-1][j],dp[i][j-1],dp[i-1][j-1]);
  }
  return dp[m][n];
}

/* ================================================================
   GAME STATE
================================================================ */
let S = {
  avatarIdx: 0, playerName: '', totalRounds: 5, drawTime: 80, botCount: 8,
  players: [], myId: 'me', drawerIdx: 0, round: 1,
  currentWord: '', revealedIdx: [], guessedIds: new Set(),
  timeLeft: 80, timerInterval: null, wsTimerInterval: null,
  isDrawing: false, tool: 'pencil', color: '#000000', brushSize: 3,
  strokes: [], shapeStart: null, snapBeforeShape: null, isDrawer: false,
  isMuted: false, ctxTarget: null,
  dpr: window.devicePixelRatio || 1,
};

/* ================================================================
   DOM REFS
================================================================ */
const $ = id => document.getElementById(id);
const screenLobby = $('screen-lobby'), screenGame = $('screen-game');
const btnAvPrev=$('btn-av-prev'), btnAvNext=$('btn-av-next');
const avCanvas=$('av-canvas'), avFrame=$('av-frame'), avDots=$('av-dots'), avName=$('av-name');
const inpName=$('inp-name'), selRounds=$('sel-rounds'), selTime=$('sel-time'), selBots=$('sel-bots'), btnPlay=$('btn-play');
const timerNum=$('timer-num'), tFg=$('t-fg'), roundBadge=$('round-badge');
const wordDisplay=$('word-display'), wordMeta=$('word-meta');
const btnMute=$('btn-mute'), muteIcon=$('mute-icon');
const playerList=$('player-list');
const chatMessages=$('chat-messages');
const chatInput=$('chat-input'), btnChatSend=$('btn-chat-send');
const gameCanvas=$('game-canvas'), canvasWrap=$('canvas-wrap');
const ctx=gameCanvas.getContext('2d',{willReadFrequently:true});
const overlayWaiting=$('overlay-waiting'), overlayWordSelect=$('overlay-word-select');
const overlayRoundEnd=$('overlay-round-end'), overlayGameover=$('overlay-gameover');
const wsTimer=$('ws-timer'), wsBar=$('ws-bar'), wsCards=$('ws-cards');
const btnCopyLink=$('btn-copy-link');
const reEmoji=$('re-emoji'), reTitle=$('re-title'), reWordVal=$('re-word-val');
const reScores=$('re-scores'), reCountdown=$('re-countdown'), reNext=$('re-next');
const contextMenu=$('context-menu'), ctxName=$('ctx-name'), ctxPts=$('ctx-pts'), ctxAv=$('ctx-av');
const voteBanner=$('vote-banner');
const podium=$('podium');
const confettiCanvas=$('confetti-canvas');
const btnPlayAgain=$('btn-play-again');

/* ================================================================
   LOBBY
================================================================ */
function buildAvDots() {
  avDots.innerHTML='';
  AVATAR_DEFS.forEach((_,i)=>{
    const d=document.createElement('button');
    d.className='av-dot'+(i===S.avatarIdx?' active':'');
    d.addEventListener('click',()=>setAvatar(i));
    avDots.appendChild(d);
  });
}
function setAvatar(i) {
  S.avatarIdx=((i%AVATAR_DEFS.length)+AVATAR_DEFS.length)%AVATAR_DEFS.length;
  const def=AVATAR_DEFS[S.avatarIdx];
  drawAvatar(avCanvas,def,96);
  avName.textContent=def.name;
  avDots.querySelectorAll('.av-dot').forEach((d,j)=>d.classList.toggle('active',j===S.avatarIdx));
  avFrame.classList.add('glow'); setTimeout(()=>avFrame.classList.remove('glow'),700);
}

btnAvPrev.addEventListener('click',()=>setAvatar(S.avatarIdx-1));
btnAvNext.addEventListener('click',()=>setAvatar(S.avatarIdx+1));
window.addEventListener('keydown',e=>{
  if(!screenLobby.classList.contains('active'))return;
  if(e.key==='ArrowLeft')setAvatar(S.avatarIdx-1);
  if(e.key==='ArrowRight')setAvatar(S.avatarIdx+1);
});
selRounds.addEventListener('change',e=>{S.totalRounds=+e.target.value;});
selTime.addEventListener('change',e=>{S.drawTime=+e.target.value;});
selBots.addEventListener('change',e=>{S.botCount=+e.target.value;});
btnPlay.addEventListener('click',()=>{
  const name=inpName.value.trim();
  if(!name){inpName.classList.add('shake');setTimeout(()=>inpName.classList.remove('shake'),500);inpName.focus();return;}
  S.playerName=name; S.totalRounds=+selRounds.value; S.drawTime=+selTime.value; S.botCount=+selBots.value;
  transitionToGame();
});
inpName.addEventListener('keydown',e=>{if(e.key==='Enter')btnPlay.click();});
btnCopyLink.addEventListener('click',()=>{
  navigator.clipboard.writeText(window.location.href).catch(()=>{});
  btnCopyLink.textContent='Copied!'; setTimeout(()=>{btnCopyLink.textContent='Copy';},2000);
});
btnPlayAgain.addEventListener('click',()=>{
  location.reload();
});

/* ================================================================
   TRANSITION
================================================================ */
function transitionToGame() {
  screenLobby.style.transition='opacity 0.4s,transform 0.4s';
  screenLobby.style.opacity='0'; screenLobby.style.transform='scale(1.08)';
  setTimeout(()=>{
    screenLobby.classList.remove('active'); screenLobby.style.display='none';
    screenGame.classList.add('active');
    initGame();
  },420);
}

/* ================================================================
   MOBILE LAYOUT: wrap panels in side-by-side row
================================================================ */
function setupMobileLayout() {
  const isMobile = window.innerWidth < 768;
  const gb = $('game-body');
  const lb = $('leaderboard-panel');
  const cp = $('chat-panel');
  let mRow = document.querySelector('.panels-row-mobile');

  if (isMobile) {
    if (!mRow) {
      mRow = document.createElement('div');
      mRow.className = 'panels-row-mobile';
      gb.appendChild(mRow);
    }
    if (!mRow.contains(lb)) mRow.appendChild(lb);
    if (!mRow.contains(cp)) mRow.appendChild(cp);
  } else {
    if (mRow && mRow.parentNode) {
      gb.insertBefore(lb, gb.firstChild);
      gb.appendChild(cp);
      mRow.remove();
    }
  }
  resizeCanvas();
}
window.addEventListener('resize', setupMobileLayout);

/* ================================================================
   GAME INIT
================================================================ */
function initGame() {
  buildPlayers();
  buildColorPalette();
  setupToolbar();
  setupChat();
  setupMuteBtn();
  setupContextMenu();
  setupVoteBanner();
  setupReactions();
  initCanvas();
  setupMobileLayout();

  overlayWaiting.classList.add('hidden');
  addChat('system','','🎨 Welcome to Picazo! Let\'s draw!');
  addChat('system','',`${S.players[0].name} draws first!`);

  S.round=1; S.drawerIdx=0; S.isDrawer=S.players[0].id===S.myId;
  updateRoundBadge(); buildLeaderboard();
  startWordSelection();
}

/* ================================================================
   PLAYERS
================================================================ */
function buildPlayers() {
  S.players=[{id:S.myId,name:S.playerName,avatarDef:AVATAR_DEFS[S.avatarIdx],score:0,isSelf:true,guessed:false}];
  const sNames=shuffle(BOT_NAMES), sAvs=shuffle(AVATAR_DEFS.slice(1));
  for(let i=0;i<S.botCount-1;i++) {
    S.players.push({id:'bot_'+i,name:sNames[i%sNames.length]+(i>=sNames.length?i:''),avatarDef:sAvs[i%sAvs.length],score:0,isSelf:false,guessed:false});
  }
  S.drawerIdx=0;
}

function buildLeaderboard() {
  const sorted=[...S.players].sort((a,b)=>b.score-a.score);
  playerList.innerHTML='';
  sorted.forEach((p,rank)=>{
    const li=document.createElement('li');
    li.className='player-item'+(p.id===S.players[S.drawerIdx]?.id?' is-drawing':'')+(p.guessed?' guessed':'');
    const rc=['gold','silver','bronze'][rank]||'';
    const rs=['🥇','🥈','🥉'][rank]||(rank+1);
    const avDiv=document.createElement('div'); avDiv.className='pi-av';
    const avC=document.createElement('canvas'); avC.width=30;avC.height=30;
    drawAvatar(avC,p.avatarDef,30); avDiv.appendChild(avC);
    li.innerHTML=`<div class="pi-rank ${rc}">${rs}</div>`;
    li.appendChild(avDiv);
    li.insertAdjacentHTML('beforeend',`<div class="pi-info"><div class="pi-name">${p.isSelf?'⭐ ':''}${esc(p.name)}</div><div class="pi-score">${p.score} pts</div></div>`);
    if(p.id===S.players[S.drawerIdx]?.id) li.insertAdjacentHTML('beforeend','<span class="pi-badge drawing">✏️</span>');
    else if(p.guessed) li.insertAdjacentHTML('beforeend','<span class="pi-badge guessed">✅</span>');
    if(!p.isSelf){li.style.cursor='pointer';li.addEventListener('click',e=>openCtxMenu(e,p));}
    playerList.appendChild(li);
  });
}
function updateRoundBadge(){roundBadge.textContent=`Round ${S.round}/${S.totalRounds}`;}

/* ================================================================
   WORD SELECTION
================================================================ */
function startWordSelection() {
  S.players.forEach(p=>p.guessed=false); S.guessedIds.clear(); buildLeaderboard();
  overlayWordSelect.classList.remove('hidden');
  const choices=shuffle(WORD_BANK).slice(0,3);
  wsCards.innerHTML='';
  choices.forEach(w=>{
    const card=document.createElement('div'); card.className='ws-card';
    card.innerHTML=`<span class="ws-emoji">${w.e}</span><div class="ws-word">${S.isDrawer?w.w:'???'}</div><div class="ws-len">${w.w.length} letters</div>`;
    if(S.isDrawer) card.addEventListener('click',()=>chooseWord(w.w));
    wsCards.appendChild(card);
  });

  let t=15;
  wsTimer.textContent=t;
  wsBar.style.transition='none'; wsBar.style.width='100%';
  clearInterval(S.wsTimerInterval);
  S.wsTimerInterval=setInterval(()=>{
    t--; wsTimer.textContent=t;
    wsBar.style.transition='width 1s linear'; wsBar.style.width=(t/15*100)+'%';
    if(t<=0){clearInterval(S.wsTimerInterval); chooseWord(choices[0].w);}
  },1000);

  // Bots: auto-pick quickly
  if(!S.isDrawer) setTimeout(()=>{if(!overlayWordSelect.classList.contains('hidden')) chooseWord(choices[Math.floor(Math.random()*3)].w);},3500);
}

function chooseWord(word) {
  clearInterval(S.wsTimerInterval);
  overlayWordSelect.classList.add('hidden');
  S.currentWord=word; S.revealedIdx=[];
  renderBlanks(); startRoundTimer();
  addChat('system','',`${S.players[S.drawerIdx].name} is drawing! 🖊️`);
  scheduleBotActivity();
}

/* ================================================================
   WORD BLANKS
================================================================ */
function renderBlanks() {
  wordDisplay.innerHTML='';
  if(!S.currentWord){wordMeta.textContent='';return;}
  S.currentWord.split('').forEach((ch,i)=>{
    if(ch===' '){wordDisplay.insertAdjacentHTML('beforeend','<div style="width:12px"></div>');return;}
    const grp=document.createElement('div'); grp.className='wb-group';
    const charEl=document.createElement('div');
    charEl.className='wb-char'+(S.revealedIdx.includes(i)&&!S.isDrawer?' reveal':'');
    charEl.id='wc-'+i;
    charEl.textContent=(S.isDrawer||S.revealedIdx.includes(i))?ch.toUpperCase():'';
    grp.appendChild(charEl);
    grp.insertAdjacentHTML('beforeend',`<div class="wb-line" style="width:${Math.max(16,Math.floor(90/S.currentWord.length))}px"></div>`);
    wordDisplay.appendChild(grp);
  });
  wordMeta.textContent=S.isDrawer?`You are drawing — ${S.currentWord.length} letters`:`${S.currentWord.length} letters`;
}

function revealHint() {
  const unrevealed=S.currentWord.split('').map((_,i)=>i).filter(i=>!S.revealedIdx.includes(i)&&S.currentWord[i]!==' ');
  if(unrevealed.length<=1)return;
  const pick=unrevealed[Math.floor(Math.random()*unrevealed.length)];
  S.revealedIdx.push(pick); renderBlanks();
  showToast('💡 Hint revealed!','t-info');
}

/* ================================================================
   ROUND TIMER
================================================================ */
function startRoundTimer() {
  S.timeLeft=S.drawTime; clearInterval(S.timerInterval); updateTimerUI();
  // Reveal hints at ~60% and ~30% of time remaining (like Skribbl)
  const h1=Math.floor(S.drawTime*0.60), h2=Math.floor(S.drawTime*0.30);
  S.timerInterval=setInterval(()=>{
    S.timeLeft--;
    if(S.timeLeft===h1||S.timeLeft===h2) revealHint();
    updateTimerUI();
    if(S.timeLeft<=0){clearInterval(S.timerInterval);endRound(false);}
  },1000);
}
function updateTimerUI() {
  timerNum.textContent=S.timeLeft;
  tFg.style.strokeDashoffset=CIRC*(1-(S.timeLeft/S.drawTime));
  const warn=S.timeLeft<=20;
  timerNum.className='timer-num'+(warn?' warn':'');
  tFg.className='t-fg'+(warn?' warn':'');
}

/* ================================================================
   END ROUND / NEXT ROUND / END GAME
================================================================ */
function endRound(allGuessed=false) {
  clearInterval(S.timerInterval); clearInterval(S.wsTimerInterval);
  addChat('system','',`⏰ The word was: "${S.currentWord}"`);
  // Drawer bonus
  if(S.guessedIds.size>0){
    const bonus=Math.min(S.guessedIds.size*30,180);
    S.players[S.drawerIdx].score+=bonus;
    showToast(`✏️ ${S.players[S.drawerIdx].name} earned ${bonus} drawing pts!`,'t-info');
  }
  const sorted=[...S.players].sort((a,b)=>b.score-a.score);
  reEmoji.textContent=allGuessed?'🎉':'⏰';
  reTitle.textContent=allGuessed?'Everyone guessed it!':'Round Over!';
  reWordVal.textContent=S.currentWord;
  reScores.innerHTML=sorted.map((p,i)=>`<div class="re-score-row"><span class="re-score-name">${['🥇','🥈','🥉'][i]||''} ${esc(p.name)}</span><span class="re-score-pts">${p.score} pts</span></div>`).join('');
  overlayRoundEnd.classList.remove('hidden');
  let cd=5; reCountdown.textContent=cd; reNext.style.display='';
  const cdi=setInterval(()=>{cd--;reCountdown.textContent=cd;if(cd<=0){clearInterval(cdi);overlayRoundEnd.classList.add('hidden');nextRound();}},1000);
}

function nextRound() {
  S.round++;
  if(S.round>S.totalRounds){endGame();return;}
  S.drawerIdx=(S.drawerIdx+1)%S.players.length;
  S.isDrawer=S.players[S.drawerIdx].id===S.myId;
  updateRoundBadge();
  ctx.clearRect(0,0,gameCanvas.width,gameCanvas.height); S.strokes=[]; S.currentWord=''; S.revealedIdx=[];
  renderBlanks(); buildLeaderboard();
  addChat('system','',`🔄 Round ${S.round} — ${S.players[S.drawerIdx].name} draws!`);
  startWordSelection();
}

function endGame() {
  clearInterval(S.timerInterval);
  const sorted=[...S.players].sort((a,b)=>b.score-a.score);
  addChat('system','',`🏆 Game Over! Winner: ${sorted[0].name}!`);
  showToast(`🏆 ${sorted[0].name} wins! GG!`,'t-gold');
  buildPodium(sorted);
  overlayGameover.classList.remove('hidden');
  launchConfetti();
}

/* ================================================================
   PODIUM
================================================================ */
function buildPodium(sorted) {
  podium.innerHTML='';
  // Arrange: 2nd | 1st | 3rd
  const order=sorted.length>=3?[sorted[1],sorted[0],sorted[2]]:[sorted[0],sorted[1]||null];
  const isFirst=(p)=>p&&p.id===sorted[0].id;
  const blockClass=(p,i)=>isFirst(p)?'first':i===0?'second':'third';
  const blockLabel=(p,i)=>isFirst(p)?'1':'2345'[i>0?1:0];

  order.forEach((p,i)=>{
    if(!p) return;
    const first=isFirst(p);
    const bCls=blockClass(p,i);
    const place=document.createElement('div');
    place.className='podium-place';
    const avC=document.createElement('canvas'); avC.width=first?72:60;avC.height=first?72:60;
    drawAvatar(avC,p.avatarDef,first?72:60);
    const avWrap=document.createElement('div'); avWrap.className='podium-avatar'+(first?' first':''); avWrap.appendChild(avC);
    place.innerHTML=first?'<div class="podium-crown">👑</div>':'';
    place.appendChild(avWrap);
    place.insertAdjacentHTML('beforeend',`<div class="podium-name">${esc(p.name)}</div><div class="podium-pts">${p.score} pts</div><div class="podium-block ${bCls}"><span class="podium-medal">${['🥈','🥇','🥉'][i]}</span></div>`);
    podium.appendChild(place);
  });
}

/* ================================================================
   CONFETTI — Canvas Particle System
================================================================ */
let confettiParticles=[], confettiRAF=null;
const CONFETTI_COLORS=['#f4b942','#4a8fe8','#2ecc87','#f0525e','#9c5cf8','#ff6699','#ffcc00'];

function launchConfetti() {
  const cc=confettiCanvas;
  cc.width=overlayGameover.clientWidth||window.innerWidth;
  cc.height=overlayGameover.clientHeight||window.innerHeight;
  confettiParticles=[];
  for(let i=0;i<180;i++) confettiParticles.push({
    x:Math.random()*cc.width, y:Math.random()*-200,
    w:8+Math.random()*10, h:4+Math.random()*6,
    r:Math.random()*Math.PI*2, dr:Math.random()*0.25-0.125,
    vx:Math.random()*4-2, vy:2+Math.random()*4,
    color:CONFETTI_COLORS[Math.floor(Math.random()*CONFETTI_COLORS.length)],
    opacity:1
  });
  const cctx=cc.getContext('2d');
  function frame(){
    cctx.clearRect(0,0,cc.width,cc.height);
    confettiParticles=confettiParticles.filter(p=>p.opacity>0.05);
    confettiParticles.forEach(p=>{
      p.x+=p.vx; p.y+=p.vy; p.r+=p.dr;
      if(p.y>cc.height*0.8)p.opacity-=0.03;
      cctx.save();cctx.globalAlpha=p.opacity;cctx.fillStyle=p.color;
      cctx.translate(p.x,p.y);cctx.rotate(p.r);
      cctx.fillRect(-p.w/2,-p.h/2,p.w,p.h);
      cctx.restore();
    });
    if(confettiParticles.length>0)confettiRAF=requestAnimationFrame(frame);
  }
  if(confettiRAF)cancelAnimationFrame(confettiRAF);
  frame();
}

/* ================================================================
   BOT ACTIVITY SIMULATION
================================================================ */
function scheduleBotActivity() {
  const bots=S.players.filter(p=>!p.isSelf&&p.id!==S.players[S.drawerIdx]?.id);
  bots.forEach((bot,idx)=>{
    // Random chat message
    setTimeout(()=>{
      if(!S.currentWord||bot.guessed)return;
      addChat('normal',bot.name,BOT_CHATS[Math.floor(Math.random()*BOT_CHATS.length)]);
    },4000+idx*2000+Math.random()*3000);

    // Possibly guess correctly later
    setTimeout(()=>{
      if(!S.currentWord||bot.guessed)return;
      const ratio=S.timeLeft/S.drawTime;
      if(ratio<0.6&&Math.random()<0.45) botGuessCorrect(bot);
      else addChat('normal',bot.name,BOT_CHATS[Math.floor(Math.random()*BOT_CHATS.length)]);
    },12000+idx*2500+Math.random()*5000);
  });
}

function botGuessCorrect(bot) {
  const pts=Math.max(10,Math.round(S.timeLeft/S.drawTime*100));
  bot.score+=pts; bot.guessed=true; S.guessedIds.add(bot.id);
  addChat('correct',bot.name,`🎉 Guessed the word! (+${pts} pts)`);
  showToast(`✅ ${bot.name} guessed it!`,'t-correct');
  buildLeaderboard();
  const nonD=S.players.filter(p=>p.id!==S.players[S.drawerIdx]?.id);
  if(nonD.every(p=>p.guessed)){clearInterval(S.timerInterval);setTimeout(()=>endRound(true),800);}
}

/* ================================================================
   CHAT & GUESSING (with Near-Miss detection)
================================================================ */
function setupChat() {
  btnChatSend.addEventListener('click',sendGuess);
  chatInput.addEventListener('keydown',e=>{if(e.key==='Enter')sendGuess();});
}

function sendGuess() {
  const val=chatInput.value.trim(); if(!val)return; chatInput.value='';

  // Drawer just chats (their messages are private-ish but we show them)
  if(S.isDrawer){addChat('normal',S.playerName,val);return;}
  // Already guessed: just chat
  if(S.guessedIds.has(S.myId)){addChat('normal',S.playerName,val);return;}

  const guess=val.toLowerCase().trim();
  const word=S.currentWord.toLowerCase();

  if(word && guess===word) {
    // Correct!
    const pts=Math.max(10,Math.round(S.timeLeft/S.drawTime*100));
    const me=S.players.find(p=>p.isSelf); if(me){me.score+=pts;me.guessed=true;}
    S.guessedIds.add(S.myId);
    addChat('correct',S.playerName,`🎉 Guessed the word! (+${pts} pts)`);
    playDing();
    showToast(`✅ You got it! +${pts} pts`,'t-correct'); buildLeaderboard();
    const nonD=S.players.filter(p=>p.id!==S.players[S.drawerIdx]?.id);
    if(nonD.every(p=>p.guessed)){clearInterval(S.timerInterval);setTimeout(()=>endRound(true),800);}
  } else if(word && levenshtein(guess,word)<=1) {
    // Near miss — shake input, yellow message
    addChat('near-miss','','💛 "'+val+'" is very close!');
    chatInput.classList.add('shake-input'); setTimeout(()=>chatInput.classList.remove('shake-input'),500);
  } else {
    addChat('normal',S.playerName,val);
  }
}

function addChat(type,name,text) {
  const div=document.createElement('div');
  div.className='chat-msg '+({'correct':'correct','system':'system','near-miss':'near-miss','normal':'normal'}[type]||'normal');
  div.innerHTML=type==='system'||type==='near-miss'
    ?`<span class="msg-text">${esc(text)}</span>`
    :`<span class="msg-name">${esc(name)}:</span> <span class="msg-text">${esc(text)}</span>`;
  chatMessages.appendChild(div); chatMessages.scrollTop=chatMessages.scrollHeight;
}

/* ================================================================
   SOUND (Web Audio API — no files needed)
================================================================ */
let audioCtx=null;
function getACtx(){if(!audioCtx)audioCtx=new(window.AudioContext||window.webkitAudioContext)();return audioCtx;}

function playTone(freq,dur,type='sine',vol=0.3) {
  if(S.isMuted)return;
  try{
    const ac=getACtx(), osc=ac.createOscillator(), gain=ac.createGain();
    osc.type=type; osc.frequency.value=freq;
    gain.gain.setValueAtTime(vol,ac.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001,ac.currentTime+dur);
    osc.connect(gain); gain.connect(ac.destination);
    osc.start(); osc.stop(ac.currentTime+dur);
  }catch(e){}
}
function playDing()  { playTone(880,0.15,'sine',0.4); setTimeout(()=>playTone(1100,0.2,'sine',0.3),100); setTimeout(()=>playTone(1320,0.3,'sine',0.25),220); }
function playWhistle(){ playTone(600,0.08,'square',0.2); setTimeout(()=>playTone(800,0.12,'square',0.15),100); }
function playChimes() { [523,659,784,1047].forEach((f,i)=>setTimeout(()=>playTone(f,0.4,'sine',0.2),i*150)); }

/* ================================================================
   MUTE
================================================================ */
function setupMuteBtn() {
  btnMute.addEventListener('click',()=>{
    S.isMuted=!S.isMuted;
    muteIcon.innerHTML=S.isMuted
      ?'<polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><line x1="23" y1="9" x2="17" y2="15"/><line x1="17" y1="9" x2="23" y2="15"/>'
      :'<polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"/>';
    showToast(S.isMuted?'🔇 Muted':'🔊 Sound on','t-info');
  });
}

/* ================================================================
   REACTIONS
================================================================ */
function setupReactions() {
  $('btn-heart').addEventListener('click',()=>showReaction('❤️'));
  $('btn-brokenheart').addEventListener('click',()=>showReaction('💔'));
}
function showReaction(emoji) {
  const el=$('reaction-floater');
  el.textContent=emoji; el.classList.remove('hidden');
  el.style.animation='none'; void el.offsetWidth;
  el.style.animation='reactionFloat 1.5s cubic-bezier(0.175,0.885,0.32,1.275) forwards';
  setTimeout(()=>el.classList.add('hidden'),1600);
  addChat('system','',`${S.playerName} reacted ${emoji}`);
}

/* ================================================================
   CANVAS DRAWING (Pointer Events + DPR for HD clarity)
================================================================ */
function initCanvas() {
  resizeCanvas();
  window.addEventListener('resize',()=>{if(screenGame.classList.contains('active'))resizeCanvas();});
  gameCanvas.addEventListener('pointerdown',  onPtrDown);
  gameCanvas.addEventListener('pointermove',  onPtrMove);
  gameCanvas.addEventListener('pointerup',    onPtrUp);
  gameCanvas.addEventListener('pointercancel',onPtrUp);
}

function resizeCanvas() {
  const W=canvasWrap.clientWidth, H=canvasWrap.clientHeight;
  if(!W||!H)return;
  S.dpr=window.devicePixelRatio||1;
  let snap=null;
  if(gameCanvas.width>0){try{snap=ctx.getImageData(0,0,gameCanvas.width,gameCanvas.height);}catch(e){}}
  gameCanvas.width=W*S.dpr; gameCanvas.height=H*S.dpr;
  gameCanvas.style.width=W+'px'; gameCanvas.style.height=H+'px';
  ctx.scale(S.dpr,S.dpr); ctx.lineCap='round'; ctx.lineJoin='round';
  if(snap){
    const tmp=document.createElement('canvas');
    tmp.width=snap.width;tmp.height=snap.height;
    tmp.getContext('2d').putImageData(snap,0,0);
    ctx.drawImage(tmp,0,0,W,H);
  }
}

function getXY(e){const r=gameCanvas.getBoundingClientRect();return{x:e.clientX-r.left,y:e.clientY-r.top};}

function onPtrDown(e) {
  if(!S.isDrawer)return;
  gameCanvas.setPointerCapture(e.pointerId);
  const pos=getXY(e);
  if(S.tool==='fill'){floodFill(pos.x,pos.y,S.color);return;}
  S.isDrawing=true;
  if(S.tool==='line'||S.tool==='rect'||S.tool==='circle'){
    S.shapeStart=pos;
    S.snapBeforeShape=ctx.getImageData(0,0,gameCanvas.width,gameCanvas.height);
    return;
  }
  applyStyle(); ctx.beginPath(); ctx.moveTo(pos.x,pos.y);
}
function onPtrMove(e) {
  if(!S.isDrawer||!S.isDrawing)return;
  const pos=getXY(e);
  if(S.shapeStart){
    ctx.putImageData(S.snapBeforeShape,0,0);
    applyStyle(); ctx.beginPath();
    drawShape(S.shapeStart,pos); return;
  }
  ctx.lineTo(pos.x,pos.y); ctx.stroke();
}
function onPtrUp(e) {
  if(!S.isDrawer||!S.isDrawing)return;
  try{gameCanvas.releasePointerCapture(e.pointerId);}catch(ex){}
  S.isDrawing=false;
  if(S.shapeStart){
    const pos=getXY(e);
    ctx.putImageData(S.snapBeforeShape,0,0);
    applyStyle(); ctx.beginPath(); drawShape(S.shapeStart,pos);
    ctx.stroke();
    if(S.tool==='rect'||S.tool==='circle'){ctx.fillStyle=S.color+'22';ctx.fill();}
    S.shapeStart=null;
  } else { ctx.closePath(); }
  saveStroke();
}

function drawShape(s,e) {
  if(S.tool==='line'){ctx.moveTo(s.x,s.y);ctx.lineTo(e.x,e.y);ctx.stroke();}
  else if(S.tool==='rect'){ctx.rect(s.x,s.y,e.x-s.x,e.y-s.y);ctx.stroke();}
  else if(S.tool==='circle'){
    const rx=Math.abs(e.x-s.x)/2,ry=Math.abs(e.y-s.y)/2,cx=(s.x+e.x)/2,cy=(s.y+e.y)/2;
    ctx.ellipse(cx,cy,Math.max(1,rx),Math.max(1,ry),0,0,Math.PI*2); ctx.stroke();
  }
}

function applyStyle() {
  const eraser=S.tool==='eraser';
  ctx.strokeStyle=eraser?'#ffffff':S.color;
  ctx.lineWidth=eraser?S.brushSize*3:S.brushSize;
  ctx.globalCompositeOperation=eraser?'destination-out':'source-over';
  ctx.fillStyle=S.color+'22';
}

function saveStroke() {
  try{S.strokes.push(ctx.getImageData(0,0,gameCanvas.width,gameCanvas.height));if(S.strokes.length>30)S.strokes.shift();}catch(e){}
  ctx.globalCompositeOperation='source-over';
}

/* ── Flood Fill (Scanline for speed) ── */
function floodFill(sx,sy,fillHex) {
  const w=gameCanvas.width,h=gameCanvas.height;
  const id=ctx.getImageData(0,0,w,h),d=id.data;
  const xi=Math.round(sx*S.dpr),yi=Math.round(sy*S.dpr);
  if(xi<0||xi>=w||yi<0||yi>=h)return;
  const idx=(yi*w+xi)*4;
  const tr=d[idx],tg=d[idx+1],tb=d[idx+2],ta=d[idx+3];
  const r=/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(fillHex);
  const fc=r?{r:parseInt(r[1],16),g:parseInt(r[2],16),b:parseInt(r[3],16)}:null;
  if(!fc||(tr===fc.r&&tg===fc.g&&tb===fc.b&&ta===255))return;
  const match=i=>Math.abs(d[i]-tr)<30&&Math.abs(d[i+1]-tg)<30&&Math.abs(d[i+2]-tb)<30&&Math.abs(d[i+3]-ta)<30;
  const stack=[xi+yi*w],seen=new Uint8Array(w*h);
  while(stack.length){
    const p=stack.pop(); if(seen[p])continue;
    const x=p%w,y=Math.floor(p/w);
    if(x<0||x>=w||y<0||y>=h)continue;
    const i=p*4; if(!match(i))continue;
    seen[p]=1; d[i]=fc.r;d[i+1]=fc.g;d[i+2]=fc.b;d[i+3]=255;
    if(x+1<w)stack.push(p+1); if(x-1>=0)stack.push(p-1);
    if(y+1<h)stack.push(p+w); if(y-1>=0)stack.push(p-w);
  }
  ctx.putImageData(id,0,0); saveStroke();
}

/* ================================================================
   TOOLBAR
================================================================ */
function setupToolbar() {
  // Tool buttons
  ['pencil','brush','line','rect','circle','fill','eraser'].forEach(t=>{
    const b=$('tool-'+t); if(b) b.addEventListener('click',()=>selectTool(t));
  });

  // Undo
  $('tool-undo').addEventListener('click',()=>{
    if(S.strokes.length>1){S.strokes.pop();ctx.putImageData(S.strokes[S.strokes.length-1],0,0);}
    else{ctx.clearRect(0,0,gameCanvas.width,gameCanvas.height);S.strokes=[];}
  });

  // Clear
  $('tool-clear').addEventListener('click',()=>{
    ctx.clearRect(0,0,gameCanvas.width,gameCanvas.height);S.strokes=[];
    showToast('🗑️ Canvas cleared','t-info');
  });

  // Color popup
  const pColor=$('popup-color'), pSize=$('popup-size');
  $('btn-color-popup').addEventListener('click',e=>{
    e.stopPropagation(); pColor.classList.toggle('hidden'); pSize.classList.add('hidden');
  });
  $('btn-size-popup').addEventListener('click',e=>{
    e.stopPropagation(); pSize.classList.toggle('hidden'); pColor.classList.add('hidden');
  });
  document.addEventListener('click',e=>{
    if(!pColor.contains(e.target)&&!$('btn-color-popup').contains(e.target))pColor.classList.add('hidden');
    if(!pSize.contains(e.target)&&!$('btn-size-popup').contains(e.target))pSize.classList.add('hidden');
  });

  // Size slider
  $('size-slider').addEventListener('input',e=>{
    S.brushSize=+e.target.value; $('size-val').textContent=S.brushSize;
    document.querySelectorAll('.sz-preset').forEach(b=>b.classList.remove('active'));
  });

  // Size presets
  document.querySelectorAll('.sz-preset').forEach(btn=>{
    btn.addEventListener('click',()=>{
      S.brushSize=+btn.dataset.sz; $('size-slider').value=S.brushSize; $('size-val').textContent=S.brushSize;
      document.querySelectorAll('.sz-preset').forEach(b=>b.classList.remove('active'));
      btn.classList.add('active');
    });
  });
}

function buildColorPalette() {
  const cp=$('color-palette'); cp.innerHTML='';
  COLORS.forEach(hex=>{
    const sw=document.createElement('div'); sw.className='c-swatch'+(hex===S.color?' active':'');
    sw.style.background=hex;
    if(hex==='#ffffff')sw.style.border='1.5px solid #ccc';
    sw.addEventListener('click',()=>pickColor(hex));
    cp.appendChild(sw);
  });
  $('color-indicator').style.background=S.color;
  $('color-picker').addEventListener('input',e=>pickColor(e.target.value));
}

function pickColor(hex) {
  S.color=hex; $('color-indicator').style.background=hex; $('color-picker').value=hex;
  document.querySelectorAll('.c-swatch').forEach(s=>s.classList.toggle('active',s.style.background===hex||s.dataset.hex===hex));
  if(S.tool==='eraser')selectTool('pencil');
}

function selectTool(tool) {
  S.tool=tool;
  document.querySelectorAll('.tool-btn[data-tool]').forEach(b=>b.classList.toggle('active',b.id==='tool-'+tool));
  gameCanvas.className=tool==='eraser'?'eraser':'';
}

/* ================================================================
   CONTEXT MENU
================================================================ */
function setupContextMenu() {
  document.addEventListener('click',e=>{if(!contextMenu.contains(e.target))contextMenu.classList.add('hidden');});
  $('ctx-kick').addEventListener('click',()=>{contextMenu.classList.add('hidden');if(S.ctxTarget)initiateVoteKick(S.ctxTarget);});
  $('ctx-mute-player').addEventListener('click',()=>{if(S.ctxTarget)showToast(`🔇 ${S.ctxTarget.name} muted`,'t-info');contextMenu.classList.add('hidden');});
  $('ctx-report').addEventListener('click',()=>{if(S.ctxTarget)showToast(`🚩 ${S.ctxTarget.name} reported`,'t-info');contextMenu.classList.add('hidden');});
  $('ctx-close').addEventListener('click',()=>contextMenu.classList.add('hidden'));
}

function openCtxMenu(e,player) {
  e.stopPropagation(); S.ctxTarget=player;
  ctxName.textContent=player.name; ctxPts.textContent=player.score+' pts';
  ctxAv.innerHTML=''; const c=document.createElement('canvas');c.width=34;c.height=34;
  drawAvatar(c,player.avatarDef,34);ctxAv.appendChild(c);
  contextMenu.classList.remove('hidden');
  contextMenu.style.left=Math.min(e.clientX,window.innerWidth-190)+'px';
  contextMenu.style.top=Math.min(e.clientY,window.innerHeight-230)+'px';
}

/* ================================================================
   VOTE KICK
================================================================ */
function setupVoteBanner() {
  $('btn-vote-yes').addEventListener('click',()=>{
    voteBanner.classList.add('hidden');
    const needed=Math.ceil(S.players.length*0.7), votes=1+Math.floor(Math.random()*(S.players.length-1));
    if(votes>=needed&&S.ctxTarget){
      const name=S.ctxTarget.name; S.players=S.players.filter(p=>p.id!==S.ctxTarget.id);
      buildLeaderboard(); addChat('system','',`🚪 ${name} was kicked.`); showToast(`🚪 ${name} kicked`,'t-warn');
    } else { showToast('❌ Not enough votes','t-info'); }
  });
  $('btn-vote-no').addEventListener('click',()=>{voteBanner.classList.add('hidden');showToast('✅ Vote cancelled','t-info');});
}

function initiateVoteKick(player) {
  $('vote-title').textContent=`Vote to kick ${player.name}?`;
  $('vote-sub').textContent=`${Math.ceil(S.players.length*0.7)} of ${S.players.length} votes (70%)`;
  voteBanner.classList.remove('hidden');
  setTimeout(()=>voteBanner.classList.add('hidden'),12000);
}

/* ================================================================
   TOASTS
================================================================ */
function showToast(msg,type='t-info') {
  const tc=$('toast-container'), t=document.createElement('div');
  t.className='toast '+type; t.textContent=msg; tc.prepend(t);
  setTimeout(()=>{t.classList.add('fade-out');setTimeout(()=>t.remove(),380);},4200);
}

/* ================================================================
   UTILS
================================================================ */
function shuffle(a){return[...a].sort(()=>Math.random()-0.5);}
function esc(s){return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');}

/* ================================================================
   INIT
================================================================ */
buildAvDots(); setAvatar(0);
