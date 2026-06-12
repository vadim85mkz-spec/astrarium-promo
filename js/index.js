/* ============================================================
   index.js — главная страница.

   Эффекты мыши:
     • mousemove — параллакс трёх слоёв звёзд за курсором;
     • click по небу — вспышка из 12 разлетающихся частиц.

   Эффекты клавиатуры:
     • Space — запуск кометы через всё небо;
     • Enter — открыть окно «Акция месяца»;
     • Escape — закрыть окно.

   Прочие JS-анимации: печатающаяся строка (setInterval),
   мерцание случайных звёзд (setInterval + classList),
   счётчики статистики (setInterval).
   ============================================================ */

document.addEventListener("DOMContentLoaded", function () {

  var hero = document.getElementById("hero");
  var sky = document.getElementById("sky");

  /* ---------- 1. Генерация звёздного неба ----------
     Три слоя с разным размером звёзд и разной «скоростью» параллакса.
     Каждая звезда — элемент span, созданный через createElement
     (тема «Создание, добавление, изменение и удаление объектов»). */

  var layerConfigs = [
    { count: 60, size: 1.6, speed: 10 },  // дальний слой — мелкие, почти неподвижные
    { count: 40, size: 2.4, speed: 22 },  // средний слой
    { count: 22, size: 3.4, speed: 42 }   // ближний слой — крупные, двигаются заметнее
  ];

  var layers = [];

  layerConfigs.forEach(function (cfg) {
    var layer = document.createElement("div");
    layer.className = "sky__layer";
    layer.setAttribute("data-speed", cfg.speed); // data-атрибут (тема «Динамическое изменение стилей»)

    for (var i = 0; i < cfg.count; i++) {
      var star = document.createElement("span");
      star.className = "star";
      star.style.left = (Math.random() * 100) + "%";
      star.style.top = (Math.random() * 100) + "%";
      star.style.width = cfg.size + "px";
      star.style.height = cfg.size + "px";
      star.style.animationDelay = (Math.random() * 4).toFixed(2) + "s";
      layer.appendChild(star);
    }

    sky.appendChild(layer);
    layers.push(layer);
  });

  /* ---------- 2. Параллакс за курсором (событие mousemove) ----------
     Чем «ближе» слой, тем сильнее он сдвигается вслед за мышью.
     Размеры окна берём из window.innerWidth / innerHeight
     (тема «Свойства объекта Window»). */

  hero.addEventListener("mousemove", function (e) {
    var centerX = window.innerWidth / 2;
    var centerY = window.innerHeight / 2;

    layers.forEach(function (layer) {
      var speed = Number(layer.getAttribute("data-speed"));
      var dx = ((e.clientX - centerX) / centerX) * speed;
      var dy = ((e.clientY - centerY) / centerY) * speed;
      layer.style.transform = "translate(" + dx + "px, " + dy + "px)";
    });
  });

  /* ---------- 3. Вспышка частиц по клику (событие click) ---------- */

  function spawnBurst(x, y) {
    for (var i = 0; i < 12; i++) {
      var particle = document.createElement("span");
      particle.className = "burst";
      particle.style.left = x + "px";
      particle.style.top = y + "px";
      sky.appendChild(particle);

      // Случайное направление и дистанция разлёта
      var angle = Math.random() * Math.PI * 2;
      var distance = 45 + Math.random() * 55;
      var tx = Math.cos(angle) * distance;
      var ty = Math.sin(angle) * distance;

      // Через мгновение задаём новую позицию — CSS-transition доведёт анимацию
      (function (p, txx, tyy) {
        setTimeout(function () {
          p.style.transform = "translate(" + txx + "px, " + tyy + "px) scale(0.2)";
          p.style.opacity = "0";
        }, 20);
        setTimeout(function () {
          p.remove(); // удаляем частицу из DOM-дерева
        }, 800);
      })(particle, tx, ty);
    }
  }

  hero.addEventListener("click", function (e) {
    // Не реагируем на клики по кнопкам и ссылкам героя
    if (e.target.closest(".btn") || e.target.closest("a")) {
      return;
    }
    var rect = sky.getBoundingClientRect();
    spawnBurst(e.clientX - rect.left, e.clientY - rect.top);
  });

  /* ---------- 4. Мерцание случайной звезды (setInterval + classList) ---------- */

  var allStars = sky.querySelectorAll(".star");

  setInterval(function () {
    var randomIndex = Math.floor(Math.random() * allStars.length);
    var star = allStars[randomIndex];
    star.classList.add("star--bright");
    setTimeout(function () {
      star.classList.remove("star--bright");
    }, 700);
  }, 450);

  /* ---------- 5. Комета (клавиша Space) ---------- */

  function launchComet() {
    var comet = document.createElement("div");
    comet.className = "comet";
    comet.style.top = (8 + Math.random() * 42) + "%";
    sky.appendChild(comet);

    // Небольшая задержка, чтобы браузер успел отрисовать стартовое положение
    setTimeout(function () {
      comet.classList.add("comet--fly");
    }, 30);

    setTimeout(function () {
      comet.remove();
    }, 2000);
  }

  /* ---------- 6. Печатающаяся строка (setInterval) ---------- */

  var typedTarget = document.getElementById("typed");
  var phrase = "Полнокупольные шоу, лекции астрономов и телескопы на террасе — каждый вечер.";
  var charIndex = 0;

  var typeTimer = setInterval(function () {
    typedTarget.textContent += phrase[charIndex];
    charIndex++;
    if (charIndex >= phrase.length) {
      clearInterval(typeTimer);
    }
  }, 45);

  /* ---------- 7. Счётчики статистики (setInterval) ---------- */

  var counters = document.querySelectorAll(".stat__num");

  counters.forEach(function (el) {
    var target = Number(el.getAttribute("data-target"));
    var suffix = el.querySelector("small");           // например, «лет»
    var suffixHTML = suffix ? suffix.outerHTML : "";
    var current = 0;
    var step = Math.max(1, Math.round(target / 70));

    var timer = setInterval(function () {
      current += step;
      if (current >= target) {
        current = target;
        clearInterval(timer);
      }
      // Большие числа выводим с пробелом между тысячами: 8500 → «8 500»
      var text = String(current);
      if (current >= 1000) {
        text = text.slice(0, -3) + " " + text.slice(-3);
      }
      el.innerHTML = text + suffixHTML;
    }, 24);
  });

  /* ---------- 8. Модальное окно «Акция месяца» ---------- */

  var promoModal = document.getElementById("promoModal");
  var promoBtn = document.getElementById("promoBtn");
  var promoClose = document.getElementById("promoClose");

  function openPromo() {
    promoModal.classList.add("modal--open");
    document.body.style.overflow = "hidden";
  }

  function closePromo() {
    promoModal.classList.remove("modal--open");
    document.body.style.overflow = "";
  }

  promoBtn.addEventListener("click", openPromo);
  promoClose.addEventListener("click", closePromo);

  // Клик по затемнённому фону тоже закрывает окно
  promoModal.addEventListener("click", function (e) {
    if (e.target === promoModal) {
      closePromo();
    }
  });

  /* ---------- 9. Клавиатура: Space / Enter / Escape (событие keydown) ---------- */

  document.addEventListener("keydown", function (e) {
    // Escape закрывает окно из любого состояния — даже если фокус на кнопке
    if (e.key === "Escape") {
      closePromo();
      return;
    }

    // Остальные горячие клавиши не трогаем, когда фокус в поле или на кнопке
    var tag = document.activeElement.tagName;
    if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT" ||
        tag === "BUTTON" || tag === "A") {
      return;
    }

    if (e.code === "Space") {
      e.preventDefault();          // отменяем прокрутку страницы пробелом
      launchComet();
    } else if (e.key === "Enter") {
      openPromo();
    }
  });

});
