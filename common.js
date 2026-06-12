/* ============================================================
   common.js — общий скрипт для всех страниц.
   Подсвечивает активный пункт меню при помощи объекта
   window.location (тема «Свойства объекта Window», BOM).
   ============================================================ */

document.addEventListener("DOMContentLoaded", function () {
  // location.pathname — путь текущей страницы, например "/astrarium-promo/programs.html".
  // Берём последний кусочек пути; для корня сайта ("/") считаем, что это index.html.
  var path = window.location.pathname.split("/").pop();
  if (path === "") {
    path = "index.html";
  }

  // querySelectorAll возвращает NodeList — у него есть метод forEach
  // (тема «Свойства и методы для получения контента»).
  var links = document.querySelectorAll(".nav__link");
  links.forEach(function (link) {
    if (link.getAttribute("href") === path) {
      link.classList.add("nav__link--active");
    }
  });
});
