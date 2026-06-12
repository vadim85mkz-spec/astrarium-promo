/* ============================================================
   tickets.js — страница «Билеты».

   Эффекты мыши (рисовалка созвездий — развитие примера «Paint»
   из лекции «События мыши»):
     • mousedown — начать рисование, поставить первую звезду;
     • mousemove — звёздный след за курсором, пока кнопка зажата;
     • mouseup / mouseleave — закончить рисование;
     • click — кнопка «Очистить поле».

   Эффекты клавиатуры и формы:
     • focus / blur — подсветка и проверка полей;
     • input — пересчёт стоимости и счётчик символов;
     • submit + preventDefault — проверка и «отправка» формы;
     • Backspace — убрать последнюю звезду (removeChild);
     • Escape — очистить рисунок или закрыть окно.
   ============================================================ */

document.addEventListener("DOMContentLoaded", function () {

  /* ================== РИСОВАЛКА СОЗВЕЗДИЙ ================== */

  var pad = document.getElementById("pad");
  var starCount = document.getElementById("starCount");
  var clearBtn = document.getElementById("clearPad");
  var isDrawing = false;

  function updateCount() {
    starCount.textContent = pad.children.length;
  }

  // Создаём звезду в точке (x, y) внутри поля
  function drawStar(x, y) {
    var star = document.createElement("span");
    star.className = "pad-star";
    star.style.left = x + "px";
    star.style.top = y + "px";
    pad.appendChild(star);

    // Класс добавляем чуть позже — звезда «выпрыгивает» через CSS-transition
    setTimeout(function () {
      star.classList.add("pad-star--on");
    }, 10);

    updateCount();
  }

  // Координаты курсора относительно поля
  function getPadPosition(e) {
    var rect = pad.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
  }

  pad.addEventListener("mousedown", function (e) {
    e.preventDefault(); // отменяем выделение текста при ведении мыши
    isDrawing = true;
    var pos = getPadPosition(e);
    drawStar(pos.x, pos.y);
  });

  pad.addEventListener("mousemove", function (e) {
    if (isDrawing) {
      var pos = getPadPosition(e);
      drawStar(pos.x, pos.y);
    }
  });

  pad.addEventListener("mouseup", function () {
    isDrawing = false;
  });

  pad.addEventListener("mouseleave", function () {
    isDrawing = false;
  });

  // Убрать последнюю звезду (метод removeChild + lastElementChild)
  function removeLastStar() {
    if (pad.lastElementChild) {
      pad.removeChild(pad.lastElementChild);
      updateCount();
    }
  }

  // Очистить всё поле
  function clearPad() {
    pad.innerHTML = "";
    updateCount();
  }

  clearBtn.addEventListener("click", clearPad);

  /* ================== ФОРМА БРОНИРОВАНИЯ ================== */

  var form = document.forms.order;     // доступ к форме по имени (тема «События для элементов формы»)
  var nameInput = document.getElementById("name");
  var emailInput = document.getElementById("email");
  var programSelect = document.getElementById("program");
  var qtyInput = document.getElementById("qty");
  var wishArea = document.getElementById("wish");
  var wishCount = document.getElementById("wishCount");
  var totalPrice = document.getElementById("totalPrice");

  /* ---------- Подсветка поля при фокусе (события focus / blur) ---------- */

  var allInputs = form.querySelectorAll("input, select, textarea");

  allInputs.forEach(function (input) {
    input.addEventListener("focus", function () {
      input.parentElement.classList.add("field--focus");
    });

    input.addEventListener("blur", function () {
      input.parentElement.classList.remove("field--focus");
      validateField(input); // проверяем поле, когда пользователь его покинул
    });
  });

  /* ---------- Проверка полей ---------- */

  function setFieldState(input, isValid, message) {
    var field = input.parentElement;
    var msg = field.querySelector(".field__msg");

    field.classList.remove("field--ok", "field--error");

    if (isValid) {
      field.classList.add("field--ok");
      if (msg) { msg.textContent = ""; }
    } else {
      field.classList.add("field--error");
      if (msg) { msg.textContent = message; }
    }
  }

  function validateField(input) {
    var value = input.value.trim();

    if (input === nameInput) {
      var nameOk = value.length >= 2;
      setFieldState(input, nameOk, "Введите имя — не короче двух букв");
      return nameOk;
    }

    if (input === emailInput) {
      var emailOk = value.indexOf("@") > 0 && value.indexOf(".") > 0;
      setFieldState(input, emailOk, "Похоже, в адресе ошибка — проверьте «@» и точку");
      return emailOk;
    }

    if (input === qtyInput) {
      var qty = Number(value);
      var qtyOk = qty >= 1 && qty <= 10;
      setFieldState(input, qtyOk, "Можно забронировать от 1 до 10 билетов");
      return qtyOk;
    }

    return true; // программа и пожелания всегда корректны
  }

  /* ---------- Живой пересчёт стоимости (событие input) ---------- */

  function updateTotal() {
    var price = Number(programSelect.value);
    var qty = Number(qtyInput.value);

    if (qty < 1 || qty > 10 || isNaN(qty)) {
      totalPrice.textContent = "—";
      return;
    }

    var total = price * qty;
    var text = String(total);
    if (total >= 1000) {
      text = text.slice(0, -3) + " " + text.slice(-3); // 1400 → «1 400»
    }
    totalPrice.textContent = text + " ₽";
  }

  qtyInput.addEventListener("input", updateTotal);
  programSelect.addEventListener("change", updateTotal);
  updateTotal(); // первый расчёт при загрузке

  /* ---------- Счётчик символов в пожеланиях (событие input) ---------- */

  wishArea.addEventListener("input", function () {
    var left = 200 - wishArea.value.length;
    wishCount.textContent = "Осталось символов: " + left;
  });

  /* ---------- Отправка формы (событие submit + preventDefault) ---------- */

  var doneModal = document.getElementById("doneModal");
  var doneText = document.getElementById("doneText");
  var doneClose = document.getElementById("doneClose");

  function closeDone() {
    doneModal.classList.remove("modal--open");
    document.body.style.overflow = "";
  }

  doneClose.addEventListener("click", closeDone);

  doneModal.addEventListener("click", function (e) {
    if (e.target === doneModal) {
      closeDone();
    }
  });

  form.addEventListener("submit", function (e) {
    e.preventDefault(); // не даём браузеру перезагрузить страницу

    var nameOk = validateField(nameInput);
    var emailOk = validateField(emailInput);
    var qtyOk = validateField(qtyInput);

    if (!nameOk || !emailOk || !qtyOk) {
      // Встряхиваем форму и ставим фокус в первое поле с ошибкой
      form.classList.add("form--shake");
      setTimeout(function () {
        form.classList.remove("form--shake");
      }, 450);

      if (!nameOk) { nameInput.focus(); }
      else if (!emailOk) { emailInput.focus(); }
      else { qtyInput.focus(); }
      return;
    }

    // Название программы достаём из data-атрибута выбранного option
    var option = programSelect.options[programSelect.selectedIndex];
    var programTitle = option.getAttribute("data-title");

    doneText.innerText =
      "Привет, " + nameInput.value.trim() + "! " +
      "Мы забронировали " + qtyInput.value + " бил. на программу «" +
      programTitle + "». Подтверждение и билеты уже летят на " +
      emailInput.value.trim() + ".";

    doneModal.classList.add("modal--open");
    document.body.style.overflow = "hidden";

    // Сбрасываем форму и возвращаем её в исходное состояние
    form.reset();
    updateTotal();
    wishCount.textContent = "Осталось символов: 200";
    allInputs.forEach(function (input) {
      input.parentElement.classList.remove("field--ok", "field--error", "field--focus");
    });
  });

  /* ================== КЛАВИАТУРА: Backspace / Escape ================== */

  document.addEventListener("keydown", function (e) {
    // Закрытие окна по Escape работает всегда — даже если фокус остался
    // в поле формы после отправки по Enter
    if (e.key === "Escape" && doneModal.classList.contains("modal--open")) {
      closeDone();
      return;
    }

    // Когда пользователь печатает в поле — остальные клавиши не перехватываем
    var tag = document.activeElement.tagName;
    if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") {
      return;
    }

    if (e.key === "Backspace") {
      e.preventDefault();
      removeLastStar();
    } else if (e.key === "Escape") {
      clearPad();
    }
  });

});
