-- Доп. поля карточки товара: галерея фото (внутри карточки) + варианты цвета.
-- Размеры (length_cm/width_cm/height_cm), вес (weight_grams), описание (description)
-- и главное фото (image_url) уже есть в products.
alter table products
  add column if not exists gallery_urls text[] default '{}',
  add column if not exists colors jsonb default '[]'::jsonb;

-- colors — массив объектов: [{ "name": "Терракота", "hex": "#B5651D", "image": "https://…" }, …]
comment on column products.colors is 'Варианты цвета: [{name, hex, image}]';
comment on column products.gallery_urls is 'Доп. фото внутри карточки товара (главное — image_url)';
