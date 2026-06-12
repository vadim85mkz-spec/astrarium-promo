/* ============================================================
   programs.js — страница «Программы и залы».

   Эффекты мыши:
     • mouseover / mouseout — свечение карточки зала;
     • mousemove — 3D-наклон карточки вслед за курсором;
     • click — стрелки и точки слайдера, кнопка «Подробнее».

   Эффекты клавиатуры:
     • ← / → — листание слайдера афиши;
     • Enter — окно с подробностями активной программы;
     • Escape — закрыть окно.

   Слайды и точки-индикаторы целиком создаются из JavaScript
   по массиву данных (createElement + innerHTML + append).
   ============================================================ */

document.addEventListener("DOMContentLoaded", function () {

  /* ---------- 1. Данные программ ---------- */

  var programs = [
    {
      tag: "Полнокупольное шоу · 45 мин",
      title: "Путешествие к краю Вселенной",
      desc: "От Земли — сквозь Солнечную систему, мимо туманностей и скоплений галактик — к границе наблюдаемой Вселенной. Шоу снято по реальным данным космических телескопов.",
      details: "Сеансы ежедневно в 12:00, 16:00 и 19:30. Изображение проецируется на весь купол, поэтому лучшие места — в центре зала. Рекомендуем зрителям от 6 лет.",
      planet: "planet--deep",
      meta: ["45 минут", "6+", "Большой купол"],
      price: "700 ₽"
    },
    {
      tag: "VR-экспедиция · 40 мин",
      title: "Марс: первая высадка",
      desc: "Виртуальная высадка на Красную планету: пыльные бури, каньон Маринер и закат, при котором небо Марса становится синим.",
      details: "Сеансы по будням в 14:00 и 18:00, в выходные — каждые два часа. Перед стартом — короткий инструктаж пилота экспедиции. Рекомендуем зрителям от 8 лет.",
      planet: "planet--mars",
      meta: ["40 минут", "8+", "Большой купол"],
      price: "650 ₽"
    },
    {
      tag: "Лекция + наблюдения · 90 мин",
      title: "Сатурн и его кольца",
      desc: "Вечер одной планеты: рассказ астронома о кольцах и спутниках Сатурна, а после — наблюдения в телескопы на открытой террасе.",
      details: "Только по пятницам и субботам в 21:00. В пасмурную погоду наблюдения заменяются экскурсией по аппаратной купола. Тёплая одежда обязательна!",
      planet: "planet--saturn",
      meta: ["90 минут", "12+", "Терраса"],
      price: "900 ₽"
    }
  ];

  /* ---------- 2. Создание слайдов и точек из массива данных ---------- */

  var poster = document.getElementById("poster");
  var dotsBox = document.getElementById("dots");
  var currentIndex = 0;

  programs.forEach(function (program, i) {
    // Слайд
    var slide = document.createElement("article");
    slide.className = "slide";
    slide.innerHTML =
      '<div class="slide__visual">' +
        '<div class="planet ' + program.planet + '"></div>' +
      '</div>' +
      '<div class="slide__body">' +
        '<p class="slide__tag">' + program.tag + '</p>' +
        '<h2 class="slide__title">' + program.title + '</h2>' +
        '<p class="slide__desc">' + program.desc + '</p>' +
        '<div class="slide__meta">' +
          '<span class="chip">' + program.meta[0] + '</span>' +
          '<span class="chip">' + program.meta[1] + '</span>' +
          '<span class="chip">' + program.meta[2] + '</span>' +
          '<span class="chip chip--price">' + program.price + '</span>' +
        '</div>' +
        '<button class="btn btn--ghost slide__more" type="button" data-index="' + i + '">Подробнее</button>' +
      '</div>';
    poster.appendChild(slide);

    // Точка-индикатор
    var dot = document.createElement("button");
    dot.className = "dot";
    dot.type = "button";
    dot.setAttribute("data-index", i);
    dot.setAttribute("aria-label", "Программа " + (i + 1));
    dotsBox.appendChild(dot);
  });

  var slides = poster.querySelectorAll(".slide");
  var dots = dotsBox.querySelectorAll(".dot");

  /* ---------- 3. Переключение слайдов ---------- */

  function goToSlide(newIndex) {
    // Зацикливаем: после последнего идёт первый и наоборот
    currentIndex = (newIndex + programs.length) % programs.length;

    slides.forEach(function (slide, i) {
      if (i === currentIndex) {
        slide.classList.add("slide--active");
      } else {
        slide.classList.remove("slide--active");
      }
    });

    dots.forEach(function (dot, i) {
      if (i === currentIndex) {
        dot.classList.add("dot--active");
      } else {
        dot.classList.remove("dot--active");
      }
    });
  }

  goToSlide(0); // показываем первый слайд

  document.getElementById("prevBtn").addEventListener("click", function () {
    goToSlide(currentIndex - 1);
  });
  document.getElementById("nextBtn").addEventListener("click", function () {
    goToSlide(currentIndex + 1);
  });

  // Клик по точке — переход к нужному слайду (значение берём из data-атрибута)
  dots.forEach(function (dot) {
    dot.addEventListener("click", function () {
      goToSlide(Number(dot.getAttribute("data-index")));
    });
  });

  /* ---------- 4. Модальное окно «Подробнее» ---------- */

  var modal = document.getElementById("programModal");
  var modalTag = document.getElementById("modalTag");
  var modalTitle = document.getElementById("modalTitle");
  var modalText = document.getElementById("modalText");
  var modalMeta = document.getElementById("modalMeta");
  var modalClose = document.getElementById("programClose");

  function openProgram(index) {
    var program = programs[index];
    modalTag.textContent = program.tag;
    modalTitle.textContent = program.title;
    modalText.textContent = program.details;
    modalMeta.innerHTML =
      '<span class="chip">' + program.meta[0] + '</span>' +
      '<span class="chip">' + program.meta[1] + '</span>' +
      '<span class="chip">' + program.meta[2] + '</span>' +
      '<span class="chip chip--price">' + program.price + '</span>';

    modal.classList.add("modal--open");
    document.body.style.overflow = "hidden";
  }

  function closeProgram() {
    modal.classList.remove("modal--open");
    document.body.style.overflow = "";
  }

  modalClose.addEventListener("click", closeProgram);

  modal.addEventListener("click", function (e) {
    if (e.target === modal) {
      closeProgram();
    }
  });

  // Кнопки «Подробнее» создавались динамически — слушаем клики на контейнере
  poster.addEventListener("click", function (e) {
    if (e.target.classList.contains("slide__more")) {
      openProgram(Number(e.target.getAttribute("data-index")));
    }
  });

  /* ---------- 5. Карточки залов: свечение и 3D-наклон за курсором ---------- */

  var hallCards = document.querySelectorAll(".hall-card");

  hallCards.forEach(function (card) {

    card.addEventListener("mouseover", function () {
      card.classList.add("hall-card--glow");
    });

    card.addEventListener("mouseout", function () {
      card.classList.remove("hall-card--glow");
      card.style.transform = ""; // возвращаем карточку в исходное положение
    });

    card.addEventListener("mousemove", function (e) {
      var rect = card.getBoundingClientRect();
      var x = e.clientX - rect.left;   // позиция курсора внутри карточки
      var y = e.clientY - rect.top;

      // Переводим позицию в углы наклона: до ±6 градусов
      var rotateY = ((x / rect.width) - 0.5) * 12;
      var rotateX = ((y / rect.height) - 0.5) * -12;

      card.style.transform =
        "perspective(700px) rotateX(" + rotateX.toFixed(2) + "deg)" +
        " rotateY(" + rotateY.toFixed(2) + "deg) translateY(-3px)";
    });

  });

  /* ---------- 6. Клавиатура: ← → Enter Escape (событие keydown) ---------- */

  document.addEventListener("keydown", function (e) {
    // Escape закрывает окно при любом положении фокуса
    if (e.key === "Escape") {
      closeProgram();
      return;
    }

    var tag = document.activeElement.tagName;
    if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") {
      return;
    }

    if (e.key === "ArrowLeft") {
      e.preventDefault();            // отменяем прокрутку страницы стрелкой
      goToSlide(currentIndex - 1);
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      goToSlide(currentIndex + 1);
    } else if (e.key === "Enter") {
      // Enter на кнопке или ссылке должен работать как обычный клик
      if (tag === "BUTTON" || tag === "A") {
        return;
      }
      openProgram(currentIndex);
    }
  });

});
