# Астрариум — промо-сайт городского планетария

Итоговая работа по дисциплине **«JavaScript DOM»**.

🔗 **Живой сайт (GitHub Pages):** https://ВАШ_ЛОГИН.github.io/astrarium-promo/

Многостраничный промо-сайт, написанный на чистых HTML, CSS и JavaScript —
без библиотек и фреймворков. Все динамические эффекты построены на DOM API
и событиях мыши и клавиатуры, изученных в курсе.

## Страницы и эффекты

| Страница | События мыши | События клавиатуры | Другие JS-анимации |
| --- | --- | --- | --- |
| `index.html` — Главная | `mousemove` — параллакс трёх слоёв звёзд; `click` по небу — вспышка из 12 частиц | `Space` — комета через всё небо; `Enter` — окно «Акция месяца»; `Esc` — закрыть | печатающаяся строка, мерцание звёзд и счётчики статистики на `setInterval` |
| `programs.html` — Программы | `mouseover`/`mouseout` — свечение карточек залов; `mousemove` — 3D-наклон карточки за курсором; `click` — стрелки, точки, «Подробнее» | `←` / `→` — листание слайдера афиши; `Enter` — подробности программы; `Esc` — закрыть окно | слайдер и точки-индикаторы создаются из массива данных через `createElement` |
| `tickets.html` — Билеты | `mousedown` + `mousemove` + `mouseup` — рисование созвездия звёздным следом; `click` — «Очистить поле» | `Backspace` — убрать последнюю звезду (`removeChild`); `Esc` — очистить рисунок / закрыть окно | события формы: `focus`/`blur` — подсветка и проверка полей, `input` — живой пересчёт цены и счётчик символов, `submit` + `preventDefault` |

## Использованные темы курса

- **BOM**: `window.location` (подсветка активного пункта меню), `window.innerWidth/innerHeight` (параллакс), таймеры `setTimeout`/`setInterval`.
- **DOM-дерево и узлы**: `parentElement`, `lastElementChild`, `children`.
- **Получение контента**: `getElementById`, `querySelector`, `querySelectorAll` + `forEach` по `NodeList`.
- **Создание/удаление объектов**: `createElement`, `appendChild`, `remove`, `removeChild`.
- **Изменение содержимого**: `textContent`, `innerText`, `innerHTML`.
- **Стили и атрибуты**: свойство `style`, `classList.add/remove/contains`, `setAttribute`/`getAttribute`, data-атрибуты.
- **События мыши**: `click`, `mousemove`, `mouseover`, `mouseout`, `mousedown`, `mouseup`, `mouseleave`.
- **События формы**: `submit`, `focus`, `blur`, `input`, `change`, `preventDefault()`.
- **События клавиатуры**: `keydown`, свойства `e.key` и `e.code`.

## Структура проекта

```
astrarium-promo/
├── index.html        главная: интерактивное звёздное небо
├── programs.html     программы: слайдер афиши и карточки залов
├── tickets.html      билеты: форма бронирования и рисовалка созвездий
├── css/
│   └── style.css     все стили сайта
├── js/
│   ├── common.js     общий скрипт: активный пункт меню
│   ├── index.js      эффекты главной страницы
│   ├── programs.js   слайдер, наклон карточек, модальное окно
│   └── tickets.js    форма, проверка полей, рисовалка
└── README.md
```

## Как запустить локально

Сборка не нужна: откройте `index.html` двойным кликом в любом современном
браузере (Chrome, Edge, Firefox). Для шрифтов нужен интернет; без него сайт
работает на системных шрифтах.
