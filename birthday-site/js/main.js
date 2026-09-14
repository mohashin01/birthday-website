// ============ CONFIG (easily editable) ============
const GIRL_NAME = "Maria";
// =====================================================

const stages = {
  intro: document.getElementById('stage-intro'),
  scratch: document.getElementById('stage-scratch'),
  reveal: document.getElementById('stage-reveal'),
  tree: document.getElementById('stage-tree'),
  cake: document.getElementById('stage-cake'),
  finale: document.getElementById('stage-finale'),
};

function showStage(key){
  Object.values(stages).forEach(s => s.classList.remove('active'));
  stages[key].classList.add('active');
  window.scrollTo({top:0, behavior:'instant'});
}

/* ============ STAGE 1: INTRO ============ */
function floatingHearts(){
  const wrap = document.getElementById('floatingHearts');
  const emojis = ['💖','💕','❤️','💗'];
  for(let i=0;i<16;i++){
    const s = document.createElement('span');
    s.textContent = emojis[Math.floor(Math.random()*emojis.length)];
    s.style.left = Math.random()*100 + '%';
    s.style.animationDuration = (6 + Math.random()*6) + 's';
    s.style.animationDelay = (Math.random()*6) + 's';
    s.style.fontSize = (1 + Math.random()*1.2) + 'rem';
    wrap.appendChild(s);
  }
}
floatingHearts();

function typeText(el, text, speed=90){
  return new Promise(resolve=>{
    let i = 0;
    el.textContent = '';
    const timer = setInterval(()=>{
      el.textContent += text[i];
      i++;
      if(i >= text.length){
        clearInterval(timer);
        el.classList.add('done');
        resolve();
      }
    }, speed);
  });
}

(async function initIntro(){
  const typedEl = document.getElementById('typedText');
  const yesBtn = document.getElementById('yesBtn');
  await typeText(typedEl, `Are you ${GIRL_NAME}?`);
  yesBtn.classList.remove('hidden');
})();

document.getElementById('yesBtn').addEventListener('click', ()=>{
  showStage('scratch');
  setupScratchCards();
});

/* ============ STAGE 2: SCRATCH CARDS ============ */
let scratchedCount = 0;
function setupScratchCards(){
  const cards = document.querySelectorAll('.scratch-card');
  cards.forEach(card=>{
    const canvas = card.querySelector('.scratch-canvas');
    const rect = card.getBoundingClientRect();
    const size = rect.width || 104;
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = '#d98fb0';
    ctx.fillRect(0,0,size,size);
    ctx.fillStyle = 'rgba(255,255,255,0.85)';
    ctx.font = 'bold 13px Poppins, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('SCRATCH', size/2, size/2 - 4);
    ctx.fillText('ME', size/2, size/2 + 14);

    let drawing = false;
    let done = false;

    function getPos(e){
      const r = canvas.getBoundingClientRect();
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;
      return { x: clientX - r.left, y: clientY - r.top };
    }

    function scratchAt(x,y){
      ctx.globalCompositeOperation = 'destination-out';
      ctx.beginPath();
      ctx.arc(x,y, size*0.14, 0, Math.PI*2);
      ctx.fill();
    }

    function checkPercent(){
      const data = ctx.getImageData(0,0,size,size).data;
      let cleared = 0;
      const total = size*size;
      for(let i=3; i<data.length; i+=4*8){ // sample every 8th pixel for speed
        if(data[i] === 0) cleared++;
      }
      const percent = cleared / (total/8);
      if(percent > 0.5 && !done){
        done = true;
        ctx.clearRect(0,0,size,size);
        card.classList.add('done');
        scratchedCount++;
        if(scratchedCount === cards.length){
          setTimeout(()=>{
            showStage('reveal');
            burstConfetti(2200);
          }, 500);
        }
      }
    }

    function start(e){ if(done) return; drawing = true; const p = getPos(e); scratchAt(p.x,p.y); }
    function move(e){ if(!drawing || done) return; e.preventDefault(); const p = getPos(e); scratchAt(p.x,p.y); checkPercent(); }
    function end(){ drawing = false; }

    canvas.addEventListener('mousedown', start);
    canvas.addEventListener('mousemove', move);
    window.addEventListener('mouseup', end);
    canvas.addEventListener('touchstart', start, {passive:true});
    canvas.addEventListener('touchmove', move, {passive:false});
    canvas.addEventListener('touchend', end);
  });
}

/* ============ STAGE 3 -> 4 ============ */
document.getElementById('toTreeBtn').addEventListener('click', ()=>{
  showStage('tree');
  buildTree();
});

/* ============ STAGE 4: MEMORY TREE ============ */
let treeBuilt = false;
function buildTree(){
  if(treeBuilt) return;
  treeBuilt = true;
  const canopy = document.getElementById('canopy');
  const photos = (typeof photosData !== 'undefined' && photosData.length) ? photosData : [];
  const n = photos.length;
  const cx = 50, cy = 48; // percent center of canopy area
  const maxRadius = 46;   // percent
  const goldenAngle = 137.508 * (Math.PI/180);

  photos.forEach((p, i)=>{
    const r = maxRadius * Math.sqrt((i+0.5)/n);
    const theta = i * goldenAngle;
    const x = cx + r * Math.cos(theta) * 1.15;
    const y = cy * 0.55 + r * Math.sin(theta) * 0.75 + 10;

    const size = 34 + (Math.random()*10);
    const el = document.createElement('div');
    el.className = 'leaf-photo';
    el.style.width = size + 'px';
    el.style.height = size + 'px';
    el.style.left = Math.max(6, Math.min(94, x)) + '%';
    el.style.top = Math.max(2, Math.min(96, y)) + '%';
    el.innerHTML = `<img src="${p.src}" alt="memory" loading="lazy">`;
    el.addEventListener('click', ()=> openPhoto(p));
    canopy.appendChild(el);
  });
}

let modalOpenedOnce = false;
function openPhoto(p){
  const modal = document.getElementById('photoModal');
  const flipCard = document.getElementById('flipCard');
  document.getElementById('modalImg').src = p.src;
  document.getElementById('modalQuote').textContent = p.quote || '❤';
  flipCard.classList.remove('flipped');
  modal.classList.remove('hidden');
}

document.getElementById('flipCard').addEventListener('click', function(){
  this.classList.toggle('flipped');
});

document.getElementById('closeModal').addEventListener('click', ()=>{
  document.getElementById('photoModal').classList.add('hidden');
  if(!modalOpenedOnce){
    modalOpenedOnce = true;
    document.getElementById('toCakeBtn').classList.remove('hidden');
  }
});

document.getElementById('toCakeBtn').addEventListener('click', ()=>{
  showStage('cake');
  setupCake();
});

/* ============ STAGE 5: CAKE CUTTING ============ */
let cakeReady = false;
function setupCake(){
  if(cakeReady) return;
  cakeReady = true;
  const wrap = document.querySelector('.cake-wrap');
  const svg = document.getElementById('cakeSvg');
  const knife = document.getElementById('knife');
  let dragging = false;
  let startX = null;
  let cut = false;
  let maxDeltaX = 0;

  function getX(e){ return e.touches ? e.touches[0].clientX : e.clientX; }
  function getY(e){ return e.touches ? e.touches[0].clientY : e.clientY; }

  function moveKnife(e){
    const rect = svg.getBoundingClientRect();
    const x = getX(e) - rect.left;
    const y = getY(e) - rect.top;
    knife.style.left = x + 'px';
    knife.style.top = y + 'px';
  }

  function start(e){
    if(cut) return;
    dragging = true;
    startX = getX(e);
    knife.style.display = 'block';
    moveKnife(e);
  }
  function move(e){
    if(!dragging || cut) return;
    moveKnife(e);
    const dx = Math.abs(getX(e) - startX);
    maxDeltaX = Math.max(maxDeltaX, dx);
    if(maxDeltaX > 60){
      triggerCut();
    }
  }
  function end(){ dragging = false; }

  function triggerCut(){
    cut = true;
    wrap.classList.add('cut');
    document.getElementById('cakeHint').textContent = 'কেক কাটা হয়ে গেছে! 🎂';
    burstConfetti(1000);
    setTimeout(()=>{
      showStage('finale');
      burstConfetti(3000);
    }, 1400);
  }

  svg.addEventListener('mousedown', start);
  svg.addEventListener('mousemove', move);
  window.addEventListener('mouseup', end);
  svg.addEventListener('touchstart', start, {passive:true});
  svg.addEventListener('touchmove', move, {passive:true});
  svg.addEventListener('touchend', end);
}

/* ============ CONFETTI ============ */
const confettiCanvas = document.getElementById('confetti-canvas');
const cctx = confettiCanvas.getContext('2d');
function resizeConfetti(){
  confettiCanvas.width = window.innerWidth;
  confettiCanvas.height = window.innerHeight;
}
resizeConfetti();
window.addEventListener('resize', resizeConfetti);

function burstConfetti(duration=2000){
  const colors = ['#ff6fa5','#ffd6e8','#ffb703','#a8d0f7','#c3a8f7','#ffffff'];
  const count = Math.floor(window.innerWidth/6);
  const particles = Array.from({length: count}, ()=>({
    x: Math.random()*confettiCanvas.width,
    y: -20 - Math.random()*confettiCanvas.height*0.5,
    r: 4 + Math.random()*5,
    c: colors[Math.floor(Math.random()*colors.length)],
    vy: 2 + Math.random()*3,
    vx: -1.5 + Math.random()*3,
    rot: Math.random()*360,
    vr: -6 + Math.random()*12
  }));

  const start = performance.now();
  function frame(now){
    const elapsed = now - start;
    cctx.clearRect(0,0,confettiCanvas.width, confettiCanvas.height);
    particles.forEach(p=>{
      p.x += p.vx; p.y += p.vy; p.rot += p.vr;
      cctx.save();
      cctx.translate(p.x,p.y);
      cctx.rotate(p.rot*Math.PI/180);
      cctx.fillStyle = p.c;
      cctx.fillRect(-p.r/2, -p.r/2, p.r, p.r*0.6);
      cctx.restore();
    });
    if(elapsed < duration){
      requestAnimationFrame(frame);
    } else {
      cctx.clearRect(0,0,confettiCanvas.width, confettiCanvas.height);
    }
  }
  requestAnimationFrame(frame);
}
