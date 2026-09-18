/* =========================================================
   1. HERO — фон из "нейронной сети" на canvas
   ========================================================= */
(() => {
  const canvas = document.getElementById('neural-bg');
  const ctx = canvas.getContext('2d');
  let particles = [];
  let mouse = { x: -9999, y: -9999 };

  function resize() {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    initParticles();
  }

  function initParticles() {
    const count = Math.min(90, Math.floor((canvas.width * canvas.height) / 18000));
    particles = [];
    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
      });
    }
  }

  canvas.addEventListener('mousemove', e => {
    const r = canvas.getBoundingClientRect();
    mouse.x = e.clientX - r.left;
    mouse.y = e.clientY - r.top;
  });
  canvas.addEventListener('mouseleave', () => { mouse.x = -9999; mouse.y = -9999; });

  function loop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
      if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

      // мягкое притяжение к курсору
      const dx = mouse.x - p.x, dy = mouse.y - p.y;
      const d = Math.hypot(dx, dy);
      if (d < 160 && d > 0) {
        p.x += (dx / d) * 0.6;
        p.y += (dy / d) * 0.6;
      }
    });

    // связи
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.hypot(dx, dy);
        if (dist < 130) {
          const alpha = (1 - dist / 130) * 0.5;
          ctx.strokeStyle = `rgba(0, 229, 255, ${alpha})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }

    // точки
    particles.forEach(p => {
      ctx.fillStyle = 'rgba(168, 85, 247, 0.9)';
      ctx.beginPath();
      ctx.arc(p.x, p.y, 1.8, 0, Math.PI * 2);
      ctx.fill();
    });

    requestAnimationFrame(loop);
  }

  window.addEventListener('resize', resize);
  resize();
  loop();
})();


/* =========================================================
   2. REVEAL — анимация появления блоков
   ========================================================= */
(() => {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
})();


/* =========================================================
   3. FLIP CARDS — переворот по тапу на мобильных
   ========================================================= */
(() => {
  document.querySelectorAll('.flip').forEach(card => {
    card.addEventListener('click', () => card.classList.toggle('flipped'));
  });
})();


/* =========================================================
   4. BUILDER — интерактивная "нейросеть"
   ========================================================= */
(() => {
  const canvas = document.getElementById('builder');
  const ctx = canvas.getContext('2d');
  const countEl = document.getElementById('neuron-count');
  const clearBtn = document.getElementById('clear-btn');

  let neurons = [];   // { x, y, born }
  let edges = [];     // { a, b, phase }
  const MAX_DIST = 220;

  function resize() {
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;
  }

  function addNeuron(x, y) {
    const n = { x, y, born: performance.now() };
    neurons.push(n);

    // соединяем с ближайшими
    const others = neurons
      .filter(o => o !== n)
      .map(o => ({ o, d: Math.hypot(o.x - n.x, o.y - n.y) }))
      .filter(e => e.d < MAX_DIST)
      .sort((a, b) => a.d - b.d)
      .slice(0, 3);

    others.forEach(e => {
      edges.push({ a: neurons.indexOf(n), b: neurons.indexOf(e.o), phase: Math.random() * Math.PI * 2 });
    });

    countEl.textContent = 'нейронов: ' + neurons.length;
  }

  canvas.addEventListener('click', e => {
    const r = canvas.getBoundingClientRect();
    addNeuron(e.clientX - r.left, e.clientY - r.top);
  });

  clearBtn.addEventListener('click', () => {
    neurons = [];
    edges = [];
    countEl.textContent = 'нейронов: 0';
  });

  function draw(t) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // рёбра
    edges.forEach(e => {
      const a = neurons[e.a], b = neurons[e.b];
      if (!a || !b) return;

      const grad = ctx.createLinearGradient(a.x, a.y, b.x, b.y);
      const phase = (Math.sin(t * 0.002 + e.phase) + 1) / 2;
      grad.addColorStop(0, 'rgba(0, 229, 255, 0.15)');
      grad.addColorStop(Math.max(0.01, Math.min(0.99, phase)), 'rgba(168, 85, 247, 0.95)');
      grad.addColorStop(1, 'rgba(0, 229, 255, 0.15)');

      ctx.strokeStyle = grad;
      ctx.lineWidth = 1.4;
      ctx.beginPath();
      ctx.moveTo(a.x, a.y);
      ctx.lineTo(b.x, b.y);
      ctx.stroke();
    });

    // нейроны
    neurons.forEach(n => {
      const age = Math.min(1, (t - n.born) / 400);
      const r = 5 + age * 2;

      // glow
      const g = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, r * 5);
      g.addColorStop(0, 'rgba(0, 229, 255, 0.55)');
      g.addColorStop(1, 'rgba(0, 229, 255, 0)');
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(n.x, n.y, r * 5, 0, Math.PI * 2);
      ctx.fill();

      // тело
      ctx.fillStyle = '#00e5ff';
      ctx.beginPath();
      ctx.arc(n.x, n.y, r * age, 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = '#fff';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(n.x, n.y, r * age, 0, Math.PI * 2);
      ctx.stroke();
    });

    requestAnimationFrame(draw);
  }

  window.addEventListener('resize', resize);
  resize();
  requestAnimationFrame(draw);

  // стартовые нейроны для красоты
  setTimeout(() => {
    const w = canvas.width, h = canvas.height;
    addNeuron(w * 0.3, h * 0.5);
    addNeuron(w * 0.55, h * 0.3);
    addNeuron(w * 0.7, h * 0.6);
    addNeuron(w * 0.45, h * 0.75);
  }, 300);
})();


/* =========================================================
   5. QUIZ — ИИ или человек
   ========================================================= */
(() => {
  const data = [
    { text: "Я не могу постичь тишину между словами, но учусь её имитировать.", isAI: true },
    { text: "Солнце садилось за горизонт, и город медленно затихал.", isAI: false },
    { text: "Как языковая модель, я не могу испытывать личные чувства.", isAI: true },
    { text: "Бабушка всегда говорила: не спеши, жизнь длинная.", isAI: false },
    { text: "Оптимизация градиентного спуска требует аккуратного выбора learning rate.", isAI: true },
    { text: "Я так устал, что даже чай казался слишком сложной задачей.", isAI: false },
  ];

  const textEl = document.getElementById('quiz-text');
  const resultEl = document.getElementById('quiz-result');
  const scoreEl = document.getElementById('quiz-score');
  const btnAI = document.getElementById('btn-ai');
  const btnHuman = document.getElementById('btn-human');
  const startBtn = document.getElementById('start-quiz');

  let queue = [];
  let current = null;
  let score = 0;
  let total = 0;

  function shuffle(a) {
    return a.slice().sort(() => Math.random() - 0.5);
  }

  function next() {
    if (queue.length === 0) {
      textEl.textContent = 'Готово! 🎉';
      resultEl.textContent = '';
      btnAI.disabled = btnHuman.disabled = true;
      startBtn.textContent = 'Ещё раз';
      return;
    }
    current = queue.shift();
    textEl.textContent = '«' + current.text + '»';
    resultEl.textContent = '';
    resultEl.className = '';
  }

  function answer(choice) {
    if (!current) return;
    total++;
    if (choice === current.isAI) {
      score++;
      resultEl.textContent = '✅ Верно!';
      resultEl.className = 'ok';
    } else {
      resultEl.textContent = '❌ Мимо. Это ' + (current.isAI ? 'ИИ' : 'человек') + '.';
      resultEl.className = 'bad';
    }
    scoreEl.textContent = `Счёт: ${score} / ${total}`;
    current = null;
    setTimeout(next, 1100);
  }

  startBtn.addEventListener('click', () => {
    queue = shuffle(data);
    score = 0;
    total = 0;
    scoreEl.textContent = 'Счёт: 0 / 0';
    btnAI.disabled = btnHuman.disabled = false;
    startBtn.textContent = 'Заново';
    next();
  });

  btnAI.addEventListener('click', () => answer(true));
  btnHuman.addEventListener('click', () => answer(false));
})();