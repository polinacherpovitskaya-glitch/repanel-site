-- ═══════════════════════════════════════════════════════════════════════════
--  RePanel — миграция под возвраты (returns).
--  Прогнать в Supabase → SQL Editor ПОСЛЕ schema.sql / migration-checkout.sql.
--  Идемпотентно.
-- ═══════════════════════════════════════════════════════════════════════════

create table if not exists returns (
  id          uuid primary key default gen_random_uuid(),
  order_id    uuid references shop_orders(id) on delete set null,
  reason      text,
  status      text not null default 'requested',   -- requested | approved | refunded | rejected
  amount      integer not null default 0,
  comment     text,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create index if not exists idx_returns_order_id on returns(order_id);

alter table returns enable row level security;   -- только сервер (service_role), без политик
