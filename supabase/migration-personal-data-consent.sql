-- RePanel — фиксация отдельного согласия на обработку персональных данных.
-- Выполнить до публикации кода с обязательным чекбоксом.

alter table shop_orders
  add column if not exists personal_data_consent_at timestamptz,
  add column if not exists personal_data_consent_version text,
  add column if not exists privacy_policy_version text;

comment on column shop_orders.personal_data_consent_at is
  'Серверное время подтверждения отдельного согласия на обработку персональных данных';
comment on column shop_orders.personal_data_consent_version is
  'Редакция согласия, подтверждённая пользователем';
comment on column shop_orders.privacy_policy_version is
  'Редакция политики, показанная пользователю при оформлении заказа';

