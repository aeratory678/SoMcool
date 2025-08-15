const canvas = document.getElementById('fontCanvas');
const ctx = canvas.getContext('2d');

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

function createShapes(num) {
  for (let i = 0; i < num; i++) {
    const shape = document.createElement('div');
    shape.className = 'shape';
    shape.style.width = `${40 + Math.random() * 120}px`;
    shape.style.height = shape.style.width;
    shape.style.left = `${Math.random() * 100}vw`;
    shape.style.top = `${Math.random() * 100}vh`;
    shape.style.background = `radial-gradient(circle, hsl(${Math.random()*360},80%,60%) 0%, transparent 80%)`;
    shape.style.animationDelay = `${Math.random() * 6}s`;
    document.body.appendChild(shape);
  }
}
createShapes(24);

if (!document.querySelector('.glass')) {
  const glass = document.createElement('div');
  glass.className = 'glass';
  document.body.appendChild(glass);
}

const particles = [];
function spawnParticles(num) {
  for (let i = 0; i < num; i++) {
    particles.push({
      x: canvas.width / 2 + (Math.random() - 0.5) * 180,
      y: canvas.height / 2 + (Math.random() - 0.5) * 60,
      r: 2 + Math.random() * 3,
      dx: (Math.random() - 0.5) * 1.5,
      dy: (Math.random() - 0.5) * 1.5,
      color: `hsl(${Math.random()*360},80%,60%)`,
      life: 60 + Math.random() * 40
    });
  }
}
spawnParticles(40);

let fontIndex = 0;
const fonts = [
  'Roboto, sans-serif',
  'Pacifico, cursive',
  'Oswald, sans-serif',
  'Indie Flower, cursive',
  'Bebas Neue, sans-serif',
  'Arial, sans-serif',
  'Georgia, serif',
  'Courier New, monospace'
];
const text = 'summer of making is cool, except for ai slop';
let scale = 1;
let scaleDirection = 1;
let lastGlitch = 0;
let t = 0;

function drawParticles() {
  for (let p of particles) {
    ctx.save();
    ctx.globalAlpha = 0.7;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fillStyle = p.color;
    ctx.shadowColor = p.color;
    ctx.shadowBlur = 8;
    ctx.fill();
    ctx.restore();
    p.x += p.dx;
    p.y += p.dy;
    p.life--;
  }
  for (let i = particles.length - 1; i >= 0; i--) {
    if (particles[i].life < 0) {
      particles.splice(i, 1);
      spawnParticles(1);
    }
  }
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawParticles();
  ctx.save();
  ctx.translate(canvas.width / 2, canvas.height / 2);
  const angle = -0.10 + (Math.random() - 0.5) * 0.12;
  ctx.rotate(angle);
  ctx.scale(scale, scale);
  let waveY = Math.sin(t * 2) * 8;
  ctx.shadowColor = `hsl(${(t*60)%360},100%,60%)`;
  ctx.shadowBlur = 32 + Math.sin(t*3)*12;
  ctx.lineWidth = 2 + Math.sin(t*4)*1.5;
  ctx.strokeStyle = `hsl(${(t*120)%360},100%,70%)`;
  const grad = ctx.createLinearGradient(-300, 0, 300, 0);
  grad.addColorStop(0, `hsl(${(t*120)%360},100%,70%)`);
  grad.addColorStop(0.5, `hsl(${(t*60+120)%360},100%,70%)`);
  grad.addColorStop(1, `hsl(${(t*60+240)%360},100%,70%)`);
  ctx.font = `64px ${fonts[fontIndex]}`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = grad;
  ctx.strokeText(text, 0, waveY);
  ctx.fillText(text, 0, waveY);
  ctx.restore();
}

setInterval(() => {
  fontIndex = (fontIndex + 1) % fonts.length;
  if (Math.random() < 0.3) lastGlitch = Date.now();
  draw();
}, 500);

function animate() {
  scale += scaleDirection * 0.01;
  if (scale > 1.08 || scale < 0.92) scaleDirection *= -1;
  t += 0.03;
  draw();
  requestAnimationFrame(animate);
}
animate();