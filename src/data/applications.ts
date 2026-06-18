// Применения RePanel — авто-сгенерировано из иллюстраций. Категории → пространства → элементы.
export type AppItem = { cap: string; img: string };
export type AppSpace = { space: string; items: AppItem[] };
export type AppCat = { key: string; title: string; cover: string; count: number; spaces: AppSpace[] };

export const appCats: AppCat[] = [
  { key: "interiors", title: "Интерьеры", cover: "/images/applications/commercial-living-room-tv-stand.png", count: 22, spaces: [
    { space: "Гостиная", items: [
      { cap: "ТВ-тумба", img: "/images/applications/commercial-living-room-tv-stand.png" },
      { cap: "Декор-стена", img: "/images/applications/commercial-living-room-wall-feature.png" },
      { cap: "Полки", img: "/images/applications/commercial-living-room-shelves.png" },
      { cap: "Журнальный стол", img: "/images/applications/commercial-living-room-coffee-table.png" },
    ] },
    { space: "Кухня", items: [
      { cap: "Остров", img: "/images/applications/commercial-kitchen-island.png" },
      { cap: "Столешницы", img: "/images/applications/commercial-kitchen-countertops.png" },
      { cap: "Фартук", img: "/images/applications/commercial-kitchen-backsplash.png" },
      { cap: "Фасады", img: "/images/applications/commercial-kitchen-cabinetry.png" },
      { cap: "Столешница", img: "/images/applications/commercial-kitchen-tabletop.png" },
      { cap: "Сиденья табуретов", img: "/images/applications/commercial-kitchen-stool-tops.png" },
    ] },
    { space: "Ванная", items: [
      { cap: "Столешница раковины", img: "/images/applications/commercial-washroom-vanity-top.png" },
      { cap: "Фартук", img: "/images/applications/commercial-washroom-backsplash.png" },
      { cap: "Стена душевой", img: "/images/applications/commercial-washroom-shower-wall.png" },
      { cap: "Тумба", img: "/images/applications/commercial-washroom-cabinet.png" },
      { cap: "Панель ванны", img: "/images/applications/commercial-washroom-bath-panel.png" },
    ] },
    { space: "Спальня", items: [
      { cap: "Мебель", img: "/images/applications/commercial-bedroom-furniture.png" },
      { cap: "Изголовье", img: "/images/applications/commercial-bedroom-headboard.png" },
      { cap: "Столешница стола", img: "/images/applications/commercial-bedroom-desk-top.png" },
      { cap: "Подоконник", img: "/images/applications/commercial-bedroom-window-sill.png" },
    ] },
    { space: "Домашний кабинет", items: [
      { cap: "Стол и фасады", img: "/images/applications/commercial-home-office-desk-top-frontage.png" },
      { cap: "Витринный модуль", img: "/images/applications/commercial-home-office-display-unit.png" },
      { cap: "Акцентная мебель", img: "/images/applications/commercial-home-office-feature-furniture.png" },
    ] },
  ] },
  { key: "horeca", title: "HoReCa", cover: "/images/applications/hospitality-entrance-reception.png", count: 19, spaces: [
    { space: "Зона питания", items: [
      { cap: "Барная зона", img: "/images/applications/hospitality-dining-beverage-area.png" },
      { cap: "Буфет", img: "/images/applications/hospitality-dining-buffet-area.png" },
      { cap: "Перегородка", img: "/images/applications/hospitality-dining-partition-wall.png" },
      { cap: "Обеденный стол", img: "/images/applications/hospitality-dining-dining-table.png" },
      { cap: "Скамьи-диваны", img: "/images/applications/hospitality-dining-bench-seating.png" },
    ] },
    { space: "Входная зона", items: [
      { cap: "Ресепшн", img: "/images/applications/hospitality-entrance-reception.png" },
      { cap: "Стойка", img: "/images/applications/hospitality-entrance-counter.png" },
      { cap: "Стеллажи", img: "/images/applications/hospitality-entrance-shelving.png" },
      { cap: "Барные столешницы", img: "/images/applications/hospitality-entrance-bar-tops.png" },
      { cap: "Стеновые панели", img: "/images/applications/hospitality-entrance-wall-panelling.png" },
    ] },
    { space: "Санузел", items: [
      { cap: "Столешница раковины", img: "/images/applications/hospitality-washrooms-vanity-top.png" },
      { cap: "Перегородки кабинок", img: "/images/applications/hospitality-washrooms-stall-divider.png" },
      { cap: "Столешница", img: "/images/applications/hospitality-washrooms-countertop.png" },
      { cap: "Панели", img: "/images/applications/hospitality-washrooms-panelling.png" },
      { cap: "Фартуки", img: "/images/applications/hospitality-washrooms-backsplashes.png" },
    ] },
    { space: "Мелочи сервиса", items: [
      { cap: "Органайзер для специй", img: "/images/applications/hospitality-small-condiment-organizer.png" },
      { cap: "Поднос для счёта", img: "/images/applications/hospitality-small-bill-tray.png" },
      { cap: "Подставка для меню", img: "/images/applications/hospitality-small-menu-holder.png" },
      { cap: "Ценникодержатели", img: "/images/applications/hospitality-small-price-tag-stands.png" },
    ] },
  ] },
  { key: "retail", title: "Ритейл", cover: "/images/applications/retail-shopfloor-tabletops.png", count: 18, spaces: [
    { space: "Торговый зал", items: [
      { cap: "Столешницы", img: "/images/applications/retail-shopfloor-tabletops.png" },
      { cap: "Стеллажи", img: "/images/applications/retail-shopfloor-shelving.png" },
      { cap: "Стеновые панели", img: "/images/applications/retail-shopfloor-wall-panelling.png" },
      { cap: "Основания витрин", img: "/images/applications/retail-shopfloor-fixture-bases.png" },
      { cap: "POS-дисплей", img: "/images/applications/retail-shopfloor-pos-display.png" },
      { cap: "Кассовая стойка", img: "/images/applications/retail-shopfloor-cash-desk.png" },
      { cap: "Ящики для выкладки", img: "/images/applications/retail-shopfloor-produce-crates.png" },
    ] },
    { space: "Витрина", items: [
      { cap: "Стеновые панели", img: "/images/applications/retail-window-wall-panelling.png" },
      { cap: "Подиумы", img: "/images/applications/retail-window-display-plinths.png" },
      { cap: "Витринная выкладка", img: "/images/applications/retail-window-vm-display.png" },
    ] },
    { space: "Примерочная", items: [
      { cap: "Стеновые панели", img: "/images/applications/retail-fitting-wall-panelling.png" },
      { cap: "Скамья", img: "/images/applications/retail-fitting-bench-top.png" },
      { cap: "Стеллажи", img: "/images/applications/retail-fitting-shelving.png" },
      { cap: "Сиденья табуретов", img: "/images/applications/retail-fitting-stool-tops.png" },
    ] },
    { space: "Бэк-офис", items: [
      { cap: "Столешницы", img: "/images/applications/retail-back-tabletops.png" },
      { cap: "Стеллажи", img: "/images/applications/retail-back-shelving.png" },
      { cap: "Системы хранения", img: "/images/applications/retail-back-storage-units.png" },
      { cap: "Санузел персонала", img: "/images/applications/retail-back-staff-washrooms.png" },
    ] },
  ] },
  { key: "office", title: "Офис", cover: "/images/applications/work-main-office-desk-table-tops.png", count: 19, spaces: [
    { space: "Рабочая зона", items: [
      { cap: "Столешницы столов", img: "/images/applications/work-main-office-desk-table-tops.png" },
      { cap: "Зона отдыха", img: "/images/applications/work-main-office-breakout-area.png" },
      { cap: "Журнальный стол", img: "/images/applications/work-main-office-coffee-table-top.png" },
      { cap: "Дверные фасады", img: "/images/applications/work-main-office-door-frontages.png" },
    ] },
    { space: "Переговорная", items: [
      { cap: "Стол переговорной", img: "/images/applications/work-meeting-boardroom-table.png" },
      { cap: "Стеновые панели", img: "/images/applications/work-meeting-wall-panelling.png" },
      { cap: "Чайная зона", img: "/images/applications/work-meeting-tea-point.png" },
    ] },
    { space: "Зона питания", items: [
      { cap: "Барная зона", img: "/images/applications/work-dining-beverage-area.png" },
      { cap: "Буфет", img: "/images/applications/work-dining-buffet-area.png" },
      { cap: "Перегородка", img: "/images/applications/work-dining-partition-wall.png" },
      { cap: "Стол", img: "/images/applications/work-dining-table.png" },
    ] },
    { space: "Входная зона", items: [
      { cap: "Ресепшн", img: "/images/applications/work-entrance-reception.png" },
      { cap: "Стойка", img: "/images/applications/work-entrance-counter.png" },
      { cap: "Стеллажи", img: "/images/applications/work-entrance-shelving.png" },
      { cap: "Стеновые панели", img: "/images/applications/work-entrance-wall-panelling.png" },
    ] },
    { space: "Санузел", items: [
      { cap: "Столешница раковины", img: "/images/applications/work-washrooms-vanity-top.png" },
      { cap: "Перегородки кабинок", img: "/images/applications/work-washrooms-stall-divider.png" },
      { cap: "Столешница", img: "/images/applications/work-washrooms-countertop.png" },
      { cap: "Панели", img: "/images/applications/work-washrooms-panelling.png" },
    ] },
  ] },
  { key: "urban", title: "Городская среда", cover: "/images/applications/public-outdoor-large-planters.png", count: 8, spaces: [
    { space: "Уличная зона", items: [
      { cap: "Скамьи", img: "/images/applications/public-outdoor-benches.png" },
      { cap: "Кашпо", img: "/images/applications/public-outdoor-large-planters.png" },
      { cap: "Мозаичная поверхность", img: "/images/applications/public-outdoor-mosaic-surface.png" },
      { cap: "Дверные ручки", img: "/images/applications/public-outdoor-entrance-handles.png" },
      { cap: "Игровые элементы", img: "/images/applications/public-outdoor-playground-elements.png" },
      { cap: "Навигация", img: "/images/applications/public-outdoor-navigation.png" },
      { cap: "Светильники", img: "/images/applications/public-outdoor-luminaires.png" },
      { cap: "Уличная мебель", img: "/images/applications/public-outdoor-street-furniture.png" },
    ] },
  ] },
];
