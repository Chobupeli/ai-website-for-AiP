"use strict";
(() => {
  const $ = s => document.querySelector(s);
  const $$ = s => [...document.querySelectorAll(s)];
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
  const topicArt = {
    vision: ["img/topic-vision.svg", "Схема: изображение из пикселей превращается в оценки категорий", "РИС. 1 / КОМПЬЮТЕРНОЕ ЗРЕНИЕ"],
    patterns: ["img/topic-patterns.svg", "График: точки данных, линия закономерности и прогноз", "РИС. 2 / ЗАКОНОМЕРНОСТИ В ДАННЫХ"],
    actions: ["img/topic-actions.svg", "Схема: агент ищет путь к цели среди препятствий", "РИС. 3 / ОБУЧЕНИЕ С ПОДКРЕПЛЕНИЕМ"],
    text: ["img/topic-text.svg", "Схема: оценка вероятностей следующего слова", "РИС. 4 / ГЕНЕРАЦИЯ ТЕКСТА"]
  };
  const eraArt = [
    ["img/era-0.svg", "Схема: группа исследователей вокруг идеи искусственного интеллекта", "РИС. 5 / ДАРТМУТ, 1956"],
    ["img/era-1.svg", "Схема: шахматная доска и дерево перебора ходов", "РИС. 6 / DEEP BLUE, 1997"],
    ["img/era-2.svg", "Схема: свёрточная сеть выделяет признаки изображения", "РИС. 7 / ALEXNET, 2012"],
    ["img/era-3.svg", "Схема: механизм внимания связывает слова", "РИС. 8 / TRANSFORMER, 2017"],
    ["img/era-4.svg", "Схема: диалог с языковой моделью", "РИС. 9 / CHATGPT, 2022"]
  ];
  function attachFigure(container, data) {
    const figure = document.createElement("figure");
    figure.className = "visual-figure";
    const img = document.createElement("img");
    img.loading = "lazy"; img.decoding = "async"; img.width = 480; img.height = 320;
    const caption = document.createElement("figcaption");
    figure.append(img, caption);
    img.addEventListener("error", () => { figure.hidden = true; container.classList.remove("has-visual"); });
    container.classList.add("has-visual");
    container.append(figure);
    return item => {
      figure.hidden = false; container.classList.add("has-visual");
      img.src = item[0]; img.alt = item[1]; caption.textContent = item[2];
      figure.style.animation = "none"; void figure.offsetWidth; figure.style.animation = "";
    };
  }
  const detail = $(".topic-detail");
  if (detail) {
    const show = attachFigure(detail);
    const active = $(".topic.active");
    show(topicArt[active ? active.dataset.topic : "vision"]);
    $$(".topic").forEach(button => button.addEventListener("click", () => show(topicArt[button.dataset.topic])));
  }
  const history = $(".history-panel");
  if (history) {
    const show = attachFigure(history);
    show(eraArt[0]);
    $$(".timeline-item").forEach(button => button.addEventListener("click", () => show(eraArt[Number(button.dataset.era)])));
  }
  const bar = document.createElement("div");
  bar.className = "scroll-progress"; bar.setAttribute("aria-hidden", "true");
  document.body.prepend(bar);
  let ticking = false;
  function updateBar() {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.transform = `scaleX(${max > 0 ? Math.min(1, window.scrollY / max) : 0})`;
    ticking = false;
  }
  window.addEventListener("scroll", () => { if (!ticking) { ticking = true; requestAnimationFrame(updateBar); } }, { passive: true });
  updateBar();
  if ("IntersectionObserver" in window && !reduce.matches) {
    document.documentElement.classList.add("js-reveal");
    const targets = $$(".section-heading, .topic-grid, .topic-detail, .timeline, .history-panel, .learning-steps, .lab-grid, .lab-explanation, .language-grid, .claim, .quiz-grid, .about-section");
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add("in"); observer.unobserve(entry.target); }
    }), { threshold: .08 });
    targets.forEach(el => { el.classList.add("reveal"); observer.observe(el); });
    setTimeout(() => targets.forEach(el => el.classList.add("in")), 4000);
  }
})();
