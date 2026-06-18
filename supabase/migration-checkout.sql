-- ═══════════════════════════════════════════════════════════════════════════
--  RePanel — миграция под полный checkout: скидки + сертификаты + промокоды.
--  Прогнать в Supabase → SQL Editor ПОСЛЕ основной schema.sql. Идемпотентно.
-- ═══════════════════════════════════════════════════════════════════════════

-- ─── shop_orders: поля скидки/промокода ───
alter table shop_orders add column if not exists applied_code      text;
alter table shop_orders add column if not exists applied_code_type text;   -- certificate | promo
alter table shop_orders add column if not exists discount_amount   integer not null default 0;

-- ─── Подарочные сертификаты ───
create table if not exists certificates (
  id              uuid primary key default gen_random_uuid(),
  code            text unique not null,
  initial_amount  integer not null,
  balance         integer not null,
  status          text not null default 'active',          -- active | used_up | disabled
  purchaser_email text,
  purchaser_name  text,
  recipient_email text,
  recipient_name  text,
  message         text,
  source_order_id uuid references shop_orders(id) on delete set null,
  expires_at      timestamptz,
  created_at      timestamptz not null default now()
);
create index if not exists idx_certificates_code on certificates(code);
alter table certificates enable row level security;   -- только сервер (service_role)

create table if not exists certificate_redemptions (
  id             uuid primary key default gen_random_uuid(),
  certificate_id uuid not null references certificates(id) on delete cascade,
  order_id       uuid references shop_orders(id) on delete set null,
  amount_used    integer not null,
  balance_after  integer not null,
  created_at     timestamptz not null default now()
);
create index if not exists idx_certificate_redemptions_cert on certificate_redemptions(certificate_id);
alter table certificate_redemptions enable row level security;

-- ─── Промокоды ───
create table if not exists promo_codes (
  id             uuid primary key default gen_random_uuid(),
  code           text unique not null,
  discount_type  text not null default 'percent',          -- percent | fixed | free_shipping
  discount_value integer not null default 0,               -- % или рубли (для free_shipping не используется)
  max_uses       integer,                                  -- null = без лимита
  uses           integer not null default 0,
  active         boolean not null default true,
  expires_at     timestamptz,
  created_at     timestamptz not null default now()
);
create index if not exists idx_promo_codes_code on promo_codes(code);
alter table promo_codes enable row level security;    -- только сервер

create table if not exists promo_redemptions (
  id              uuid primary key default gen_random_uuid(),
  promo_id        uuid not null references promo_codes(id) on delete cascade,
  order_id        uuid references shop_orders(id) on delete set null,
  discount_amount integer not null default 0,
  created_at      timestamptz not null default now()
);
create index if not exists idx_promo_redemptions_promo on promo_redemptions(promo_id);
alter table promo_redemptions enable row level security;
