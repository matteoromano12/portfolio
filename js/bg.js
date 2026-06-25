const canvas = document.getElementById("bg");
const ctx = canvas.getContext("2d");

let w = canvas.width = window.innerWidth;
let h = canvas.height = window.innerHeight;
let dpr = Math.min(window.devicePixelRatio || 1, 2);

const mouse = {
  x: w / 2,
  y: h / 2,
  radius: 140
};

const particles = [];
const PARTICLE_COUNT = Math.min(120, Math.floor((w * h) / 12000));

function resizeCanvas() {
  w = window.innerWidth;
  h = window.innerHeight;
  dpr = Math.min(window.devicePixelRatio || 1, 2);

  canvas.width = w * dpr;
  canvas.height = h * dpr;
  canvas.style.width = `${w}px`;
  canvas.style.height = `${h}px`;

  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}

class Particle {
  constructor() {
    this.x = Math.random() * w;
    this.y = Math.random() * h;
    this.vx = (Math.random() - 0.5) * 0.35;
    this.vy = (Math.random() - 0.5) * 0.35;
    this.size = Math.random() * 1.6 + 0.4;
    this.baseX = this.x;
    this.baseY = this.y;
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;

    if (this.x < 0 || this.x > w) this.vx *= -1;
    if (this.y < 0 || this.y > h) this.vy *= -1;

    const dx = mouse.x - this.x;
    const dy = mouse.y - this.y;
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (dist < mouse.radius) {
      const force = ((mouse.radius - dist) / mouse.radius) * 1.5;
      const angle = Math.atan2(dy, dx);

      this.x -= Math.cos(angle) * force * 1.2;
      this.y -= Math.sin(angle) * force * 1.2;
    }
  }

  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(255, 255, 255, 0.6)";
    ctx.shadowColor = "rgba(255, 255, 255, 0.08)";
    ctx.shadowBlur = 10;
    ctx.fill();
    ctx.shadowBlur = 0;
  }
}

function createParticles() {
  particles.length = 0;
  for (let i = 0; i < PARTICLE_COUNT; i++) {
    particles.push(new Particle());
  }
}

function drawConnections() {
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x;
      const dy = particles[i].y - particles[j].y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < 100) {
        const opacity = 1 - dist / 100;
        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.strokeStyle = `rgba(255, 255, 255, ${opacity * 0.08})`;
        ctx.lineWidth = 1;
        ctx.stroke();
      }
    }
  }
}

function drawMouseGlow() {
  const gradient = ctx.createRadialGradient(
    mouse.x,
    mouse.y,
    0,
    mouse.x,
    mouse.y,
    180
  );

  gradient.addColorStop(0, "rgba(255,255,255,0.06)");
  gradient.addColorStop(0.4, "rgba(255,255,255,0.025)");
  gradient.addColorStop(1, "rgba(255,255,255,0)");

  ctx.beginPath();
  ctx.fillStyle = gradient;
  ctx.arc(mouse.x, mouse.y, 180, 0, Math.PI * 2);
  ctx.fill();
}

function animate() {
  ctx.clearRect(0, 0, w, h);

  drawMouseGlow();

  for (const particle of particles) {
    particle.update();
    particle.draw();
  }

  drawConnections();
  requestAnimationFrame(animate);
}

window.addEventListener("mousemove", (e) => {
  mouse.x = e.clientX;
  mouse.y = e.clientY;
});

window.addEventListener("touchmove", (e) => {
  if (e.touches[0]) {
    mouse.x = e.touches[0].clientX;
    mouse.y = e.touches[0].clientY;
  }
}, { passive: true });

window.addEventListener("resize", () => {
  resizeCanvas();
  createParticles();
});

resizeCanvas();
createParticles();
animate();
