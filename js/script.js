"use strict";
(() => {
  const $ = (selector) => document.querySelector(selector);
  const $$ = (selector) => [...document.querySelectorAll(selector)];
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const menu = $(".menu-toggle");
  menu.addEventListener("click", () => {
    const opened = menu.getAttribute("aria-expanded") !== "true";
    menu.setAttribute("aria-expanded", String(opened));
    $("#navigation").classList.toggle("open", opened);
  });
  $$("#navigation a").forEach(link => link.addEventListener("click", () => {
    menu.setAttribute("aria-expanded", "false");
    $("#navigation").classList.remove("open");
  }));
  document.addEventListener("keydown", event => {
    if (event.key === "Escape" && menu.getAttribute("aria-expanded") === "true") {
      menu.setAttribute("aria-expanded", "false");
      $("#navigation").classList.remove("open");
      menu.focus();
    }
  });
  if ("IntersectionObserver" in window) {
    const navObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        $$("#navigation a").forEach(a => a.classList.toggle("current", a.getAttribute("href") === "#" + entry.target.id));
      });
    }, { rootMargin: "-20% 0px -50% 0px" });
    $$("main section[id]").forEach(section => navObserver.observe(section));
  }

  const topics = {
    vision: ["Распознавание изображений", "Модель получает числовое представление изображения и ищет признаки, полезные для задачи. Например, учится различать кошек и собак по размеченным примерам. Это не безошибочное «зрение»: необычный ракурс или незнакомые условия могут привести к ошибке.", "Пример: классификация фотографии. Результат: оценки для категорий «кошка» и «собака»."],
    patterns: ["Закономерности в данных", "Модель изучает примеры и находит зависимости, которые помогают делать прогнозы. Важно, какие данные мы собрали: неполные или смещённые примеры могут приводить к неверным выводам. Найденная связь сама по себе не доказывает причинность.", "Пример: прогноз спроса по истории продаж. Результат: оценка будущих продаж, а не гарантированное число."],
    actions: ["Действия и обратная связь", "Один из подходов — обучение с подкреплением. Агент выбирает действия, получает обратную связь и учится стратегии, которая увеличивает ожидаемую суммарную награду. Другие системы могут использовать поиск или заранее заданные правила.", "Пример: агент в игре. Его задача — не угадать слово, а выбрать последовательность полезных действий."],
    text: ["Языковые модели", "Языковая модель оценивает вероятности токенов в контексте. Генерация происходит последовательно: выбранный фрагмент добавляется к тексту и становится частью контекста для следующего шага. Это не гарантирует фактическую точность ответа.", "Пример: продолжение предложения. Ниже можно исследовать упрощённую демонстрацию этого процесса."]
  };
  $$(".topic").forEach(button => button.addEventListener("click", () => {
    $$(".topic").forEach(b => { b.classList.toggle("active", b === button); b.setAttribute("aria-pressed", String(b === button)); });
    const [title, description, example] = topics[button.dataset.topic];
    $("#topic-title").textContent = title;
    $("#topic-description").textContent = description;
    $("#topic-example").textContent = example;
  }));
  const eras = [
    ["1956", "НАЧАЛО НАПРАВЛЕНИЯ", "У идеи появляется имя.", "Летний исследовательский проект в Дартмуте объединил учёных вокруг идеи искусственного интеллекта. Это важная точка становления области, а не момент появления первой «умной машины».", "Название направления не означало, что задача создания универсального интеллекта уже решена."],
    ["1997", "ИГРА НА УРОВНЕ ЧЕМПИОНА", "Deep Blue побеждает Каспарова.", "Шахматная система IBM выиграла матч у действующего чемпиона мира Гарри Каспарова. Поиск вариантов и оценка позиций позволили компьютеру достичь выдающегося результата в конкретной игре.", "Победа в шахматах не означала способности вести беседу или решать произвольные человеческие задачи. Deep Blue не был современной языковой моделью."],
    ["2012", "ПРОРЫВ В КОМПЬЮТЕРНОМ ЗРЕНИИ", "Нейросети учатся видеть лучше.", "AlexNet значительно улучшила результат классификации изображений в соревновании ImageNet. Глубокая свёрточная нейросеть, большой набор примеров и вычисления на GPU стали важным сочетанием для развития компьютерного зрения.", "Модель определяла категории изображений. Успех в этой задаче не равен полному пониманию визуального мира."],
    ["2017", "НОВАЯ АРХИТЕКТУРА", "Attention Is All You Need.", "Исследователи представили архитектуру Transformer. В ней механизм внимания позволяет учитывать связи между элементами последовательности. Эта архитектура стала основой многих современных языковых моделей.", "Transformer — архитектура, а не отдельный чат-бот. Его появление не означало, что ИИ перестал ошибаться."],
    ["2022", "ИИ В МАССОВОМ ИНТЕРФЕЙСЕ", "Разговор становится интерфейсом.", "В ноябре 2022 года OpenAI представила ChatGPT. Возможность задавать вопросы обычным языком привлекла широкое внимание к генеративному ИИ и сделала взаимодействие с языковой моделью доступным многим людям.", "ИИ существовал задолго до ChatGPT. Удобный интерфейс не гарантирует достоверность ответа и не превращает модель в всезнающую систему."]
  ];
  $$(".timeline-item").forEach(button => button.addEventListener("click", () => {
    $$(".timeline-item").forEach(b => { b.classList.toggle("active", b === button); b.setAttribute("aria-pressed", String(b === button)); });
    const values = eras[Number(button.dataset.era)];
    ["#era-year", "#era-tag", "#era-title", "#era-text", "#era-limit"].forEach((id, i) => $(id).textContent = values[i]);
  }));

  function canvasSize(canvas) {
    const rect = canvas.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const width = Math.max(1, Math.round(rect.width));
    const height = Math.max(1, Math.round(rect.height));
    if (canvas.width !== Math.round(width * dpr) || canvas.height !== Math.round(height * dpr)) {
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
    }
    const ctx = canvas.getContext("2d");
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    return { ctx, width, height };
  }
  const network = $("#network");
  const stars = Array.from({ length: 55 }, (_, i) => ({
    x: ((i * 137.508) % 100) / 100, y: ((i * 71.71 + 17) % 100) / 100,
    phase: i * 1.31, speed: .4 + (i % 5) * .1
  }));
  let pointer = null, netFrame = null, netVisible = true;
  network.addEventListener("pointermove", event => {
    const rect = network.getBoundingClientRect();
    pointer = { x: event.clientX - rect.left, y: event.clientY - rect.top };
    if (reduceMotion.matches) drawNetwork(0);
  });
  network.addEventListener("pointerleave", () => { pointer = null; if (reduceMotion.matches) drawNetwork(0); });
  function drawNetwork(time) {
    const { ctx, width, height } = canvasSize(network);
    ctx.clearRect(0, 0, width, height);
    const t = reduceMotion.matches ? 0 : time * .00025;
    const positions = stars.map(s => ({ x: s.x * width + Math.sin(t * s.speed + s.phase) * 16, y: s.y * height + Math.cos(t * s.speed + s.phase) * 18 }));
    positions.forEach((p, i) => {
      positions.slice(i + 1).forEach(q => {
        const distance = Math.hypot(p.x - q.x, p.y - q.y);
        if (distance < 115) {
          ctx.strokeStyle = `rgba(194,249,112,${(1 - distance / 115) * .22})`;
          ctx.lineWidth = .7; ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y); ctx.stroke();
        }
      });
      let close = false;
      if (pointer) {
        const distance = Math.hypot(p.x - pointer.x, p.y - pointer.y);
        if (distance < 145) {
          close = true; ctx.strokeStyle = `rgba(115,210,255,${(1 - distance / 145) * .7})`;
          ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(pointer.x, pointer.y); ctx.stroke();
        }
      }
      ctx.beginPath(); ctx.arc(p.x, p.y, close ? 3 : 1.7, 0, Math.PI * 2); ctx.fillStyle = close ? "#73d2ff" : "#c2f97095"; ctx.fill();
    });
  }
  function animateNetwork(time) {
    netFrame = null;
    if (!netVisible || document.hidden || reduceMotion.matches) return;
    drawNetwork(time);
    netFrame = requestAnimationFrame(animateNetwork);
  }
  function startNetwork() {
    if (netFrame !== null) cancelAnimationFrame(netFrame);
    netFrame = null;
    drawNetwork(0);
    if (netVisible && !document.hidden && !reduceMotion.matches) netFrame = requestAnimationFrame(animateNetwork);
  }
  if ("IntersectionObserver" in window) new IntersectionObserver(entries => {
    netVisible = entries[0].isIntersecting; startNetwork();
  }).observe(network);
  document.addEventListener("visibilitychange", startNetwork);
  reduceMotion.addEventListener("change", startNetwork);
  startNetwork();

  const field = $("#classifier");
  let points = [], weights = [0, 0, 0], epochs = 0, mode = "a", testPoint = null, trainTimer = null;
  const sigmoid = z => 1 / (1 + Math.exp(-Math.max(-40, Math.min(40, z))));
  const predict = (x, y) => sigmoid(weights[0] * x + weights[1] * y + weights[2]);
  const clamp = v => Math.max(-.94, Math.min(.94, v));
  let seed = 42;
  function random() { seed = (seed * 1664525 + 1013904223) >>> 0; return seed / 4294967296; }
  function stopTraining() {
    if (trainTimer !== null) clearInterval(trainTimer);
    trainTimer = null; $("#train").disabled = false; $("#train").innerHTML = 'Обучить модель <span>↗</span>';
  }
  function updateMetrics() {
    $("#point-count").textContent = points.length + " ТОЧЕК";
    $("#epochs").textContent = epochs.toLocaleString("ru-RU");
    if (!epochs) { $("#accuracy").textContent = "—"; $("#loss").textContent = "—"; return; }
    let correct = 0, loss = 0;
    points.forEach(p => { const probability = predict(p.x, p.y); correct += Number((probability >= .5 ? 1 : 0) === p.label); loss -= p.label * Math.log(Math.max(1e-9, probability)) + (1 - p.label) * Math.log(Math.max(1e-9, 1 - probability)); });
    $("#accuracy").textContent = Math.round(correct / points.length * 100) + "%";
    $("#loss").textContent = (loss / points.length).toFixed(3);
  }
  function drawClassifier() {
    const { ctx, width: w, height: h } = canvasSize(field);
    ctx.clearRect(0, 0, w, h);
    const toX = x => (x + 1) * .5 * w;
    const toY = y => (1 - y) * .5 * h;
    if (epochs) {
      const cell = 12;
      for (let sx = 0; sx < w; sx += cell) for (let sy = 0; sy < h; sy += cell) {
        const p = predict((sx + cell / 2) / w * 2 - 1, 1 - (sy + cell / 2) / h * 2);
        ctx.fillStyle = p < .5 ? `rgba(194,249,112,${.025 + (.5 - p) * .3})` : `rgba(115,210,255,${.025 + (p - .5) * .3})`;
        ctx.fillRect(sx, sy, cell, cell);
      }
    }
    ctx.lineWidth = 1; ctx.strokeStyle = "#ffffff08";
    for (let i = 1; i < 10; i++) {
      ctx.beginPath(); ctx.moveTo(w * i / 10, 0); ctx.lineTo(w * i / 10, h); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(0, h * i / 10); ctx.lineTo(w, h * i / 10); ctx.stroke();
    }
    ctx.strokeStyle = "#ffffff20"; ctx.setLineDash([4, 5]);
    ctx.beginPath(); ctx.moveTo(w / 2, 0); ctx.lineTo(w / 2, h); ctx.moveTo(0, h / 2); ctx.lineTo(w, h / 2); ctx.stroke(); ctx.setLineDash([]);
    if (epochs && Math.hypot(weights[0], weights[1]) > 1e-5) {
      ctx.save(); ctx.beginPath(); ctx.rect(0, 0, w, h); ctx.clip(); ctx.beginPath();
      if (Math.abs(weights[1]) > Math.abs(weights[0]) * .001) {
        ctx.moveTo(0, toY(-(-weights[0] + weights[2]) / weights[1]));
        ctx.lineTo(w, toY(-(weights[0] + weights[2]) / weights[1]));
      } else { const x = toX(-weights[2] / weights[0]); ctx.moveTo(x, 0); ctx.lineTo(x, h); }
      ctx.strokeStyle = "#e5efdf99"; ctx.lineWidth = 1.5; ctx.stroke(); ctx.restore();
    }
    points.forEach(p => {
      ctx.beginPath(); ctx.arc(toX(p.x), toY(p.y), 5.5, 0, 2 * Math.PI);
      ctx.fillStyle = p.label === 0 ? "#c2f970" : "#73d2ff"; ctx.fill(); ctx.lineWidth = 2; ctx.strokeStyle = "#0b1014"; ctx.stroke();
    });
    if (testPoint) {
      const x = toX(testPoint.x), y = toY(testPoint.y);
      ctx.strokeStyle = "#ffffff"; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(x, y, 10, 0, 2 * Math.PI); ctx.moveTo(x - 15, y); ctx.lineTo(x + 15, y); ctx.moveTo(x, y - 15); ctx.lineTo(x, y + 15); ctx.stroke();
    }
    ctx.fillStyle = "#869ba7"; ctx.font = "9px monospace"; ctx.fillText("x →", w - 33, h - 10); ctx.fillText("y ↑", 10, 17);
  }
  function loadDataset() {
    stopTraining(); seed = 42; points = []; weights = [0, 0, 0]; epochs = 0; testPoint = null;
    const name = $("#dataset").value;
    for (let i = 0; i < (name === "xor" ? 32 : 24); i++) {
      const label = i % 2;
      let x, y;
      if (name === "xor") {
        const quadrant = i % 4;
        x = (quadrant < 2 ? -1 : 1) * (.25 + random() * .6);
        y = (quadrant % 2 === 0 ? -1 : 1) * (.25 + random() * .6);
        points.push({ x, y, label: x * y > 0 ? 0 : 1 });
      } else {
        const spread = name === "mixed" ? 1.45 : .7;
        const center = name === "mixed" ? .22 : .47;
        x = clamp((label === 0 ? -center : center) + (random() - .5) * spread);
        y = clamp((label === 0 ? -.25 : .25) + (random() - .5) * (name === "mixed" ? 1.6 : 1.05));
        points.push({ x, y, label });
      }
    }
    updateMetrics(); drawClassifier();
    $("#lab-status").textContent = name === "xor" ? "В этом наборе одной прямой недостаточно. Проверь ограничение модели." : "Новые примеры готовы. Нажми «Обучить».";
  }
  function interact(x, y) {
    if (mode === "test") {
      testPoint = { x, y };
      if (!epochs) $("#lab-status").textContent = "Сначала обучи модель: сейчас все оценки равны 50%.";
      else {
        const p = predict(x, y), label = p >= .5 ? "B" : "A", probability = p >= .5 ? p : 1 - p;
        $("#lab-status").textContent = `Предсказание: класс ${label}. Оценка модели: ${Math.round(probability * 100)}%. Это не гарантия правильности. Точка не добавлена в обучение.`;
      }
    } else {
      if (points.length >= 200) { $("#lab-status").textContent = "Для этого эксперимента установлен лимит 200 точек. Выбери начальный набор заново."; return; }
      stopTraining(); points.push({ x, y, label: mode === "a" ? 0 : 1 }); testPoint = null;
      $("#lab-status").textContent = "Пример добавлен. Обучи модель, чтобы учесть новые данные.";
      updateMetrics();
    }
    drawClassifier();
  }
  field.addEventListener("click", e => {
    const rect = field.getBoundingClientRect();
    interact(clamp((e.clientX - rect.left) / rect.width * 2 - 1), clamp(1 - (e.clientY - rect.top) / rect.height * 2));
  });
  $("#add-point").addEventListener("click", () => interact((random() - .5) * 1.8, (random() - .5) * 1.8));
  $$("[data-mode]").forEach(button => button.addEventListener("click", () => {
    mode = button.dataset.mode;
    $$("[data-mode]").forEach(b => { b.classList.toggle("selected", b === button); b.setAttribute("aria-pressed", String(b === button)); });
    $("#canvas-hint").textContent = mode === "test" ? "Нажми на поле для предсказания" : "Нажми на поле, чтобы добавить точку";
    $("#add-point").innerHTML = mode === "test" ? 'Проверить случайную точку <span>↗</span>' : 'Добавить случайную точку <span>+</span>';
  }));
  $("#dataset").addEventListener("change", loadDataset);
  $("#reset").addEventListener("click", () => {
    stopTraining(); weights = [0, 0, 0]; epochs = 0; testPoint = null; updateMetrics(); drawClassifier();
    $("#lab-status").textContent = "Параметры сброшены. Твои примеры сохранены.";
  });
  function gradientStep() {
    const gradient = [0, 0, 0];
    points.forEach(p => { const error = predict(p.x, p.y) - p.label; gradient[0] += error * p.x; gradient[1] += error * p.y; gradient[2] += error; });
    weights = weights.map((w, i) => w - .35 * gradient[i] / points.length);
    epochs++;
  }
  $("#train").addEventListener("click", () => {
    if (!points.some(p => p.label === 0) || !points.some(p => p.label === 1)) { $("#lab-status").textContent = "Добавь хотя бы один пример каждого класса."; return; }
    stopTraining(); testPoint = null; $("#train").disabled = true;
    $("#train").innerHTML = 'Обучение… <span>◌</span>';
    $("#lab-status").textContent = "Считаем ошибку и корректируем параметры…";
    let completed = 0;
    trainTimer = setInterval(() => {
      for (let i = 0; i < 12; i++) gradientStep();
      completed += 12; updateMetrics(); drawClassifier();
      if (completed >= 600) {
        stopTraining();
        $("#lab-status").textContent = "600 шагов выполнено. Переключись в «Проверку» или добавь новые примеры. Повторное обучение продолжит работу с текущими параметрами.";
      }
    }, 35);
  });
  loadDataset();

  const branches = {
    root: { options: [["луна", 62, "moon"], ["звезда", 30, "star"], ["фонарь", 8, "lamp"]] },
    moon: { options: [["над", 58, "over"], ["сквозь", 27, "through"], ["рядом", 15, "near"]] },
    star: { options: [["над", 65, "over"], ["сквозь", 25, "through"], ["рядом", 10, "near"]] },
    lamp: { options: [["над", 70, "over"], ["сквозь", 20, "through"], ["рядом", 10, "near"]] },
    over: { options: [["городом.", 55, "done"], ["горизонтом.", 35, "done"], ["лесом.", 10, "done"]] },
    through: { options: [["облака.", 72, "done"], ["туман.", 22, "done"], ["ветви.", 6, "done"]] },
    near: { options: [["с горизонтом.", 61, "done"], ["с облаками.", 29, "done"], ["с башней.", 10, "done"]] }
  };
  let textState = "root", chosenTokens = [];
  function renderText() {
    const output = $("#generated-text");
    output.replaceChildren(document.createTextNode("На ночном небе ярко светит"));
    chosenTokens.forEach(token => { const span = document.createElement("span"); span.className = "generated-token"; span.textContent = " " + token; output.append(span); });
    const cursor = document.createElement("span"); cursor.className = "cursor"; cursor.setAttribute("aria-hidden", "true"); output.append(cursor);
    $("#token-step").textContent = textState === "done" ? "3 ШАГА / ГОТОВО" : `ШАГ ${chosenTokens.length + 1} / 3`;
    const options = $("#token-options"); options.replaceChildren();
    if (textState === "done") {
      const p = document.createElement("p"); p.className = "callout"; p.textContent = "Продолжение готово. Оно может звучать естественно или странно. Ни один из вариантов не подтверждает, что описанное событие произошло."; options.append(p);
      $("#token-feedback").textContent = "Это дерево заранее заданных вариантов. Оно иллюстрирует процесс, но не является настоящей языковой моделью.";
      return;
    }
    branches[textState].options.forEach(([word, probability, next]) => {
      const button = document.createElement("button"); button.className = "token-choice"; button.style.setProperty("--probability", probability + "%");
      const label = document.createElement("span"); label.textContent = word;
      const percent = document.createElement("span"); percent.textContent = probability + "%";
      button.append(label, percent); button.addEventListener("click", () => {
        chosenTokens.push(word); textState = next;
        $("#token-feedback").textContent = `Ты выбрал «${word}». Добавленный фрагмент меняет контекст следующего шага. Проценты здесь заданы автором.`;
        renderText();
        const target = options.querySelector("button") || $("#text-reset"); target.focus({ preventScroll: true });
      }); options.append(button);
    });
  }
  $("#text-reset").addEventListener("click", () => { textState = "root"; chosenTokens = []; $("#token-feedback").textContent = "Это заранее заданные вероятности, не вывод настоящей языковой модели."; renderText(); });
  renderText();
  $$(".reveal-claim").forEach(button => button.addEventListener("click", () => {
    const opened = button.getAttribute("aria-expanded") !== "true";
    button.setAttribute("aria-expanded", String(opened));
    document.getElementById(button.getAttribute("aria-controls")).hidden = !opened;
    button.innerHTML = opened ? 'Скрыть пояснение <span>−</span>' : 'Проверить утверждение <span>↗</span>';
  }));

  const questions = [
    { question: "Что меняется во время обучения модели в нашей лаборатории?", answers: ["Её внутренние параметры", "Правильные метки всех точек", "Координаты примеров сами перемещаются"], correct: 0, explanation: "Модель корректирует параметры, чтобы уменьшить ошибку. В нашей лаборатории это три числа: два веса и смещение. Примеры и их метки остаются на месте." },
    { question: "Токен в языковой модели — это…", answers: ["Всегда одно полное предложение", "Фрагмент текста: слово, часть слова или знак", "Обязательно одно целое слово"], correct: 1, explanation: "Токенизация зависит от модели. Нельзя универсально приравнивать число токенов к числу слов. Наш эксперимент использует целые слова только для наглядности." },
    { question: "Модель показывает 100% на учебных примерах. Что дальше?", answers: ["Можно считать её безошибочной", "Нужно проверить на новых данных", "Нужно удалить неудобные примеры"], correct: 1, explanation: "Результат на обучающих примерах не доказывает способность обобщать. Нужна отдельная проверка на данных, которые не использовались при обучении." },
    { question: "Почему нашей модели сложно разделить точки XOR?", answers: ["Браузеру обязательно нужен сервер", "Она не умеет читать названия цветов", "Одной прямой недостаточно для такой структуры"], correct: 2, explanation: "Мы используем линейную границу. При расположении классов в противоположных квадрантах нужна более сложная граница, другие признаки или другая модель." },
    { question: "Почему убедительный ответ языковой модели нужно проверять?", answers: ["Правдоподобное продолжение может содержать фактическую ошибку", "Любой ответ ИИ обязательно неверен", "Красивое оформление делает ответ истинным"], correct: 0, explanation: "Связность и уверенный тон не гарантируют достоверность. Особенно важно проверять источники для утверждений с серьёзными последствиями." }
  ];
  let quizIndex = 0, score = 0, answered = false;
  function renderQuiz() {
    answered = false;
    $("#quiz-progress").textContent = `ВОПРОС ${quizIndex + 1} / ${questions.length}`;
    $("#quiz-score").textContent = `${score} ВЕРНЫХ`;
    $("#quiz-bar").style.width = (quizIndex / questions.length * 100) + "%";
    $("#quiz-question").textContent = questions[quizIndex].question;
    $("#quiz-explanation").textContent = "";
    $("#quiz-next").hidden = true;
    const container = $("#quiz-options"); container.replaceChildren();
    questions[quizIndex].answers.forEach((answer, index) => {
      const button = document.createElement("button"); button.className = "quiz-option";
      const letter = document.createElement("span"); letter.textContent = String.fromCharCode(65 + index);
      button.append(letter, document.createTextNode(answer));
      button.addEventListener("click", () => {
        if (answered) return;
        answered = true;
        const correct = index === questions[quizIndex].correct;
        if (correct) score++;
        [...container.children].forEach((option, i) => {
          option.disabled = true;
          option.classList.toggle("correct", i === questions[quizIndex].correct);
          option.classList.toggle("incorrect", i === index && !correct);
        });
        $("#quiz-score").textContent = `${score} ВЕРНЫХ`;
        $("#quiz-bar").style.width = ((quizIndex + 1) / questions.length * 100) + "%";
        $("#quiz-explanation").textContent = (correct ? "Верно. " : "Не совсем. ") + questions[quizIndex].explanation;
        $("#quiz-next").hidden = false;
        $("#quiz-next").innerHTML = quizIndex === questions.length - 1 ? 'Посмотреть результат <span>↗</span>' : 'Следующий вопрос <span>→</span>';
        $("#quiz-next").focus({ preventScroll: true });
      }); container.append(button);
    });
  }
  $("#quiz-next").addEventListener("click", () => {
    if (quizIndex === questions.length) { quizIndex = 0; score = 0; renderQuiz(); }
    else if (answered) {
      quizIndex++;
      if (quizIndex < questions.length) renderQuiz();
      else {
        $("#quiz-progress").textContent = "ЭКСПЕРИМЕНТ ЗАВЕРШЁН";
        $("#quiz-question").textContent = `${score} из ${questions.length} — твой результат.`;
        $("#quiz-options").replaceChildren();
        $("#quiz-explanation").textContent = score === 5 ? "Отлично! Ты отличаешь обучение от применения, вероятность от истины и возможности модели от её ограничений." : "Теперь ты знаешь, где стоит копнуть глубже. Вернись к экспериментам и попробуй ещё раз — это тоже обучение.";
        $("#quiz-next").hidden = false; $("#quiz-next").innerHTML = 'Пройти ещё раз <span>↺</span>';
      }
    }
    const focusTarget = $("#quiz-options button") || $("#quiz-next"); focusTarget.focus({ preventScroll: true });
  });
  renderQuiz();
  const resizeAll = () => { drawClassifier(); if (reduceMotion.matches || !netVisible) drawNetwork(0); };
  if ("ResizeObserver" in window) { const observer = new ResizeObserver(resizeAll); observer.observe(field); observer.observe(network); }
  else window.addEventListener("resize", resizeAll);
})();
