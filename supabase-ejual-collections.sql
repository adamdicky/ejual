begin;

do $$
begin
  if not exists (
    select 1
    from information_schema.tables
    where table_schema = current_schema()
      and table_name = 'users'
  ) or not exists (
    select 1
    from information_schema.tables
    where table_schema = current_schema()
      and table_name = 'categories'
  ) or not exists (
    select 1
    from information_schema.tables
    where table_schema = current_schema()
      and table_name = 'media'
  ) then
    raise exception 'Base Payload tables users/categories/media are missing. This script only applies the eJual collection additions on top of an existing Payload schema.';
  end if;

  if exists (
    select 1
    from information_schema.columns
    where table_schema = current_schema()
      and table_name in ('users', 'categories', 'media')
      and column_name = 'id'
      and data_type <> 'integer'
  ) then
    raise exception 'Existing Payload tables users/categories/media are not integer/serial-based. Stop here: forcing UUID primary IDs is not a safe additive SQL change.';
  end if;
end $$;

do $$
begin
  create type enum_users_role as enum ('admin', 'customer');
exception
  when duplicate_object then null;
end $$;

do $$
begin
  create type enum_users_account_status as enum ('active', 'suspended');
exception
  when duplicate_object then null;
end $$;

do $$
begin
  create type enum_products_status as enum ('available', 'out-of-stock', 'hidden');
exception
  when duplicate_object then null;
end $$;

do $$
begin
  create type enum_orders_payment_method as enum ('card', 'online-banking', 'cash-on-delivery');
exception
  when duplicate_object then null;
end $$;

do $$
begin
  create type enum_orders_payment_status as enum ('pending', 'paid', 'failed');
exception
  when duplicate_object then null;
end $$;

do $$
begin
  create type enum_orders_order_status as enum ('pending', 'processing', 'shipped', 'delivered', 'cancelled');
exception
  when duplicate_object then null;
end $$;

do $$
begin
  create type enum_notifications_type as enum ('order', 'promotion', 'system');
exception
  when duplicate_object then null;
end $$;

alter table users add column if not exists full_name varchar;
update users set full_name = coalesce(full_name, name, email) where full_name is null;
alter table users alter column full_name set not null;
alter table users add column if not exists phone_number varchar;
alter table users add column if not exists profile_image_id integer references media(id) on delete set null;
alter table users add column if not exists role enum_users_role not null default 'customer';
alter table users add column if not exists account_status enum_users_account_status not null default 'active';
create index if not exists users_profile_image_idx on users(profile_image_id);

alter table categories add column if not exists category_name varchar;
update categories set category_name = coalesce(category_name, title) where category_name is null;
alter table categories alter column category_name set not null;
alter table categories add column if not exists description varchar;

create table if not exists addresses (
  id serial primary key,
  user_id integer not null references users(id) on delete set null,
  receiver_name varchar not null,
  phone_number varchar not null,
  address_line1 varchar not null,
  address_line2 varchar,
  city varchar not null,
  state varchar not null,
  postcode varchar not null,
  country varchar not null default 'Malaysia',
  is_default boolean default false,
  updated_at timestamp(3) with time zone not null default now(),
  created_at timestamp(3) with time zone not null default now()
);
create index if not exists addresses_user_idx on addresses(user_id);
create index if not exists addresses_updated_at_idx on addresses(updated_at);
create index if not exists addresses_created_at_idx on addresses(created_at);

create table if not exists products (
  id serial primary key,
  seller_id integer not null references users(id) on delete set null,
  category_id integer not null references categories(id) on delete set null,
  product_name varchar not null,
  description varchar not null,
  base_price numeric not null,
  status enum_products_status not null default 'available',
  featured boolean default false,
  updated_at timestamp(3) with time zone not null default now(),
  created_at timestamp(3) with time zone not null default now()
);
create index if not exists products_seller_idx on products(seller_id);
create index if not exists products_category_idx on products(category_id);
create index if not exists products_updated_at_idx on products(updated_at);
create index if not exists products_created_at_idx on products(created_at);

create table if not exists product_images (
  id serial primary key,
  product_id integer not null references products(id) on delete set null,
  image_id integer not null references media(id) on delete set null,
  display_order numeric not null default 0,
  updated_at timestamp(3) with time zone not null default now(),
  created_at timestamp(3) with time zone not null default now()
);
create index if not exists product_images_product_idx on product_images(product_id);
create index if not exists product_images_image_idx on product_images(image_id);
create index if not exists product_images_updated_at_idx on product_images(updated_at);
create index if not exists product_images_created_at_idx on product_images(created_at);

create table if not exists product_variants (
  id serial primary key,
  product_id integer not null references products(id) on delete set null,
  color varchar not null,
  size varchar not null,
  additional_price numeric not null default 0,
  updated_at timestamp(3) with time zone not null default now(),
  created_at timestamp(3) with time zone not null default now()
);
create index if not exists product_variants_product_idx on product_variants(product_id);
create index if not exists product_variants_updated_at_idx on product_variants(updated_at);
create index if not exists product_variants_created_at_idx on product_variants(created_at);

create table if not exists inventory (
  id serial primary key,
  variant_id integer not null references product_variants(id) on delete set null,
  stock_quantity numeric not null default 0,
  reserved_quantity numeric not null default 0,
  updated_at timestamp(3) with time zone not null default now(),
  created_at timestamp(3) with time zone not null default now()
);
create unique index if not exists inventory_variant_idx on inventory(variant_id);
create index if not exists inventory_updated_at_idx on inventory(updated_at);
create index if not exists inventory_created_at_idx on inventory(created_at);

create table if not exists carts (
  id serial primary key,
  user_id integer not null references users(id) on delete set null,
  updated_at timestamp(3) with time zone not null default now(),
  created_at timestamp(3) with time zone not null default now()
);
create unique index if not exists carts_user_idx on carts(user_id);
create index if not exists carts_updated_at_idx on carts(updated_at);
create index if not exists carts_created_at_idx on carts(created_at);

create table if not exists cart_items (
  id serial primary key,
  cart_id integer not null references carts(id) on delete set null,
  variant_id integer not null references product_variants(id) on delete set null,
  quantity numeric not null,
  updated_at timestamp(3) with time zone not null default now(),
  created_at timestamp(3) with time zone not null default now()
);
create index if not exists cart_items_cart_idx on cart_items(cart_id);
create index if not exists cart_items_variant_idx on cart_items(variant_id);
create index if not exists cart_items_updated_at_idx on cart_items(updated_at);
create index if not exists cart_items_created_at_idx on cart_items(created_at);

create table if not exists orders (
  id serial primary key,
  buyer_id integer not null references users(id) on delete set null,
  shipping_address_id integer not null references addresses(id) on delete set null,
  payment_method enum_orders_payment_method not null,
  payment_status enum_orders_payment_status not null default 'pending',
  order_status enum_orders_order_status not null default 'pending',
  subtotal numeric not null,
  shipping_fee numeric not null default 0,
  total_amount numeric not null,
  order_date timestamp(3) with time zone not null,
  updated_at timestamp(3) with time zone not null default now(),
  created_at timestamp(3) with time zone not null default now()
);
create index if not exists orders_buyer_idx on orders(buyer_id);
create index if not exists orders_shipping_address_idx on orders(shipping_address_id);
create index if not exists orders_updated_at_idx on orders(updated_at);
create index if not exists orders_created_at_idx on orders(created_at);

create table if not exists order_items (
  id serial primary key,
  order_id integer not null references orders(id) on delete set null,
  variant_id integer not null references product_variants(id) on delete set null,
  seller_id integer not null references users(id) on delete set null,
  quantity numeric not null,
  unit_price numeric not null,
  subtotal numeric not null,
  updated_at timestamp(3) with time zone not null default now(),
  created_at timestamp(3) with time zone not null default now()
);
create index if not exists order_items_order_idx on order_items(order_id);
create index if not exists order_items_variant_idx on order_items(variant_id);
create index if not exists order_items_seller_idx on order_items(seller_id);
create index if not exists order_items_updated_at_idx on order_items(updated_at);
create index if not exists order_items_created_at_idx on order_items(created_at);

create table if not exists notifications (
  id serial primary key,
  user_id integer not null references users(id) on delete set null,
  title varchar not null,
  message varchar not null,
  type enum_notifications_type not null,
  is_read boolean default false,
  updated_at timestamp(3) with time zone not null default now(),
  created_at timestamp(3) with time zone not null default now()
);
create index if not exists notifications_user_idx on notifications(user_id);
create index if not exists notifications_updated_at_idx on notifications(updated_at);
create index if not exists notifications_created_at_idx on notifications(created_at);

alter table payload_locked_documents_rels add column if not exists addresses_id integer;
alter table payload_locked_documents_rels add column if not exists products_id integer;
alter table payload_locked_documents_rels add column if not exists product_images_id integer;
alter table payload_locked_documents_rels add column if not exists product_variants_id integer;
alter table payload_locked_documents_rels add column if not exists inventory_id integer;
alter table payload_locked_documents_rels add column if not exists carts_id integer;
alter table payload_locked_documents_rels add column if not exists cart_items_id integer;
alter table payload_locked_documents_rels add column if not exists orders_id integer;
alter table payload_locked_documents_rels add column if not exists order_items_id integer;
alter table payload_locked_documents_rels add column if not exists notifications_id integer;

create index if not exists payload_locked_documents_rels_addresses_id_idx on payload_locked_documents_rels(addresses_id);
create index if not exists payload_locked_documents_rels_products_id_idx on payload_locked_documents_rels(products_id);
create index if not exists payload_locked_documents_rels_product_images_id_idx on payload_locked_documents_rels(product_images_id);
create index if not exists payload_locked_documents_rels_product_variants_id_idx on payload_locked_documents_rels(product_variants_id);
create index if not exists payload_locked_documents_rels_inventory_id_idx on payload_locked_documents_rels(inventory_id);
create index if not exists payload_locked_documents_rels_carts_id_idx on payload_locked_documents_rels(carts_id);
create index if not exists payload_locked_documents_rels_cart_items_id_idx on payload_locked_documents_rels(cart_items_id);
create index if not exists payload_locked_documents_rels_orders_id_idx on payload_locked_documents_rels(orders_id);
create index if not exists payload_locked_documents_rels_order_items_id_idx on payload_locked_documents_rels(order_items_id);
create index if not exists payload_locked_documents_rels_notifications_id_idx on payload_locked_documents_rels(notifications_id);

do $$
begin
  alter table payload_locked_documents_rels add constraint payload_locked_documents_rels_addresses_fk foreign key (addresses_id) references addresses(id) on delete cascade;
exception
  when duplicate_object then null;
end $$;

do $$
begin
  alter table payload_locked_documents_rels add constraint payload_locked_documents_rels_products_fk foreign key (products_id) references products(id) on delete cascade;
exception
  when duplicate_object then null;
end $$;

do $$
begin
  alter table payload_locked_documents_rels add constraint payload_locked_documents_rels_product_images_fk foreign key (product_images_id) references product_images(id) on delete cascade;
exception
  when duplicate_object then null;
end $$;

do $$
begin
  alter table payload_locked_documents_rels add constraint payload_locked_documents_rels_product_variants_fk foreign key (product_variants_id) references product_variants(id) on delete cascade;
exception
  when duplicate_object then null;
end $$;

do $$
begin
  alter table payload_locked_documents_rels add constraint payload_locked_documents_rels_inventory_fk foreign key (inventory_id) references inventory(id) on delete cascade;
exception
  when duplicate_object then null;
end $$;

do $$
begin
  alter table payload_locked_documents_rels add constraint payload_locked_documents_rels_carts_fk foreign key (carts_id) references carts(id) on delete cascade;
exception
  when duplicate_object then null;
end $$;

do $$
begin
  alter table payload_locked_documents_rels add constraint payload_locked_documents_rels_cart_items_fk foreign key (cart_items_id) references cart_items(id) on delete cascade;
exception
  when duplicate_object then null;
end $$;

do $$
begin
  alter table payload_locked_documents_rels add constraint payload_locked_documents_rels_orders_fk foreign key (orders_id) references orders(id) on delete cascade;
exception
  when duplicate_object then null;
end $$;

do $$
begin
  alter table payload_locked_documents_rels add constraint payload_locked_documents_rels_order_items_fk foreign key (order_items_id) references order_items(id) on delete cascade;
exception
  when duplicate_object then null;
end $$;

do $$
begin
  alter table payload_locked_documents_rels add constraint payload_locked_documents_rels_notifications_fk foreign key (notifications_id) references notifications(id) on delete cascade;
exception
  when duplicate_object then null;
end $$;

commit;
