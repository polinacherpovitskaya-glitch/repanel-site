create table if not exists site_records (
  collection text not null check (collection in (
    'products',
    'shop_orders',
    'order_timeline',
    'order_shipments',
    'notification_log',
    'certificates',
    'certificate_redemptions',
    'promo_codes',
    'promo_redemptions',
    'returns'
  )),
  id text not null,
  body jsonb not null check (jsonb_typeof(body) = 'object' and body ->> 'id' = id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (collection, id)
);

create index if not exists site_records_collection_idx
  on site_records (collection);

create unique index if not exists site_records_product_slug_uidx
  on site_records ((body ->> 'slug'))
  where collection = 'products' and body ->> 'slug' is not null;

create unique index if not exists site_records_certificate_code_uidx
  on site_records ((body ->> 'code'))
  where collection = 'certificates' and body ->> 'code' is not null;

create unique index if not exists site_records_promo_code_uidx
  on site_records ((body ->> 'code'))
  where collection = 'promo_codes' and body ->> 'code' is not null;

revoke all on site_records from public;
