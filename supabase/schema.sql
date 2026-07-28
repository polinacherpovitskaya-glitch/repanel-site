-- ═══════════════════════════════════════════════════════════════════════════
--  RePanel — минимальная схема магазина: товары + заказы + доставка (СДЭК).
--  Прогнать ЦЕЛИКОМ в Supabase → SQL Editor. Идемпотентно (можно повторно).
--  Адаптировано из Recycle Object handoff (sql/00-base/*).
-- ═══════════════════════════════════════════════════════════════════════════

-- ─── Товары ───────────────────────────────────────────────────────────────
create table if not exists products (
  id           uuid primary key default gen_random_uuid(),
  slug         text unique,
  title        text not null,
  price        integer not null default 0,        -- целые рубли
  description  text default '',
  category     text not null default 'Магазин',
  image_url    text,
  is_published boolean not null default true,
  weight_grams integer,                            -- для расчёта доставки СДЭК
  length_cm    integer,
  width_cm     integer,
  height_cm    integer,
  sort_order   integer default 0,
  created_at   timestamptz default now()
);

alter table products enable row level security;
drop policy if exists "products public read" on products;
create policy "products public read" on products
  for select using (is_published = true);
-- Запись в products — только сервер (service_role обходит RLS). Политик для anon нет.

-- ─── Заказы ───────────────────────────────────────────────────────────────
create table if not exists shop_orders (
  id                  uuid primary key default gen_random_uuid(),

  -- состав и суммы (цены — целые рубли)
  items               jsonb       not null default '[]'::jsonb,
  total               integer     not null default 0,
  delivery_method     text,
  delivery_price      integer     not null default 0,
  grand_total         integer     not null default 0,

  -- покупатель
  name                text,
  first_name          text,
  last_name           text,
  phone               text,
  email               text,
  city                text,
  address             text,
  comment             text,
  personal_data_consent_at      timestamptz,
  personal_data_consent_version text,
  privacy_policy_version        text,

  -- машина состояний
  status              text,
  payment_status      text        not null default 'pending', -- pending|authorized|paid|refunded|failed
  processing_status   text        not null default 'new',
  fulfillment_status  text        not null default 'not_started',
  delivery_status     text        not null default 'created',

  -- оплата (Точка)
  tochka_operation_id text,

  -- доставка / трекинг (СДЭК)
  tracking_token      uuid        default gen_random_uuid(),
  carrier             text,                                   -- cdek | self_pickup | null
  tracking_number     text,
  tracking_url        text,
  carrier_order_id    text,
  cdek_city_code      integer,
  pvz_code            text,
  estimated_delivery  date,

  -- операционка
  internal_note       text,
  cancelled_at        timestamptz,
  cancel_reason       text,
  refunded_at         timestamptz,
  refund_amount       integer,

  submitted_at        timestamptz not null default now(),
  created_at          timestamptz not null default now()
);

create unique index if not exists idx_shop_orders_tracking_token on shop_orders(tracking_token);
create index if not exists idx_shop_orders_payment_status    on shop_orders(payment_status);
create index if not exists idx_shop_orders_submitted_at      on shop_orders(submitted_at desc);

alter table shop_orders enable row level security;
-- НИ ОДНОЙ политики для anon/authenticated → из браузера таблица недоступна (персональные данные).
-- Создание заказа и отметка оплаты — серверные роуты с service_role (обходит RLS).

-- ─── Лента событий по заказу ──────────────────────────────────────────────
create table if not exists order_timeline (
  id         uuid primary key default gen_random_uuid(),
  order_id   uuid not null references shop_orders(id) on delete cascade,
  event_type text not null,
  actor      text not null default 'system',
  payload    jsonb default '{}',
  created_at timestamptz not null default now()
);
create index if not exists idx_order_timeline_order_id on order_timeline(order_id);
alter table order_timeline enable row level security;  -- только сервер (service_role)

-- ─── Отправления (СДЭК) ───────────────────────────────────────────────────
create table if not exists order_shipments (
  id               uuid primary key default gen_random_uuid(),
  order_id         uuid not null references shop_orders(id) on delete cascade,
  carrier          text not null,
  carrier_order_id text,
  tracking_number  text,
  tracking_url     text,
  status           text not null default 'created',
  items            jsonb default '[]',
  weight_grams     integer,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);
create index if not exists idx_order_shipments_order_id on order_shipments(order_id);
alter table order_shipments enable row level security;  -- только сервер (service_role)

-- ─── Журнал уведомлений (письма/Telegram) ─────────────────────────────────
create table if not exists notification_log (
  id         uuid primary key default gen_random_uuid(),
  order_id   uuid not null references shop_orders(id) on delete cascade,
  channel    text not null,
  template   text not null,
  recipient  text not null,
  status     text not null default 'sent',
  error      text,
  created_at timestamptz not null default now()
);
create index if not exists idx_notification_log_order_id on notification_log(order_id);
alter table notification_log enable row level security;  -- только сервер (service_role)

-- ─── Сид: текущий каталог RePanel (вес — ориентировочный, поправим) ───────
insert into products (slug, title, price, category, image_url, weight_grams, sort_order) values
  ('obraztsy',     'Набор образцов',     3500,  'Образцы',     '/images/obraztsy-card.png',       400,  0),
  ('side-table',   'Приставной столик',  12900, 'Мебель',      '/images/shop/shop-stolik.png',    6000, 1),
  ('clock',        'Настольные часы',    4500,  'Аксессуары',  '/images/shop/shop-chasy.png',     600,  2),
  ('rocking-horse','Лошадка-качалка',    8900,  'Дети',        '/images/shop/shop-loshadka.png',  4000, 3),
  ('step-stool',   'Стул-стремянка',     9900,  'Мебель',      '/images/shop/shop-stremianka.png',5000, 4),
  ('stool-01',     'Табурет',            7500,  'Мебель',      '/images/shop/shop-taburet.png',   3000, 5),
  ('bench',        'Скамья',             14900, 'Мебель',      '/images/shop/shop-skameika.png',  8000, 6)
on conflict (slug) do nothing;
