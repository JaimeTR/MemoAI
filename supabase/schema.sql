-- MemoAI schema — run this once in the Supabase SQL editor (Project > SQL Editor > New query).

create extension if not exists "pgcrypto";

-- Extends auth.users with the extra profile fields we collect (name, phone).
-- email is duplicated here (also lives in auth.users) so the app can look up an existing
-- account by email via a normal table query, without paginating the Auth admin API.
create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null unique,
  name text,
  phone text,
  created_at timestamptz not null default now()
);

create table if not exists orders (
  id text primary key,
  customer_id uuid references auth.users(id) on delete set null,
  customer_name text not null,
  customer_email text not null,
  customer_phone text not null,
  address text not null default '',
  dni text,
  maps_link text,
  city text not null,
  province text,
  department text not null,
  product text not null,
  quantity integer not null default 1,
  coupon_code text,
  amount numeric not null,
  status text not null default 'pending' check (status in ('pending','paid','shipped','delivered','cancelled')),
  payment_provider text not null,
  created_at timestamptz not null default now()
);

create table if not exists products (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  tagline text,
  description text,
  sale_price numeric not null,
  original_price numeric,
  currency text not null default 'S/',
  images jsonb not null default '[]',
  stock integer,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table orders add column if not exists product_id uuid references products(id) on delete set null;
alter table orders add column if not exists payment_proof_url text;
-- Id del producto en el catalogo del ERP (o de products). Lo que se le manda al ERP en cada pedido.
alter table orders add column if not exists product_ref text;

create table if not exists coupons (
  code text primary key,
  type text not null check (type in ('percent','fixed')),
  value numeric not null,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists shop_settings (
  id integer primary key default 1 check (id = 1),
  whatsapp_number text not null default '+51975646074',
  yape_number text not null default '',
  plin_number text not null default '',
  yape_name text not null default '',
  payment_link text not null default '',
  payment_link_enabled boolean not null default false
);
insert into shop_settings (id) values (1) on conflict (id) do nothing;

-- Placeholder for the future payments plan (Culqi vault tokens) — not used by the app yet.
create table if not exists payment_methods (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid not null references auth.users(id) on delete cascade,
  provider text not null,
  provider_token text not null,
  label text,
  created_at timestamptz not null default now()
);

-- Row Level Security: customers only see their own rows. The app's API routes use the
-- service_role key (bypasses RLS) for admin reads/writes, so the admin panel is unaffected.
alter table profiles enable row level security;
alter table orders enable row level security;
alter table payment_methods enable row level security;

drop policy if exists "profiles: read own" on profiles;
create policy "profiles: read own" on profiles for select using (auth.uid() = id);
drop policy if exists "profiles: update own" on profiles;
create policy "profiles: update own" on profiles for update using (auth.uid() = id);

drop policy if exists "orders: read own" on orders;
create policy "orders: read own" on orders for select using (auth.uid() = customer_id);

drop policy if exists "payment_methods: read own" on payment_methods;
create policy "payment_methods: read own" on payment_methods for select using (auth.uid() = customer_id);
drop policy if exists "payment_methods: delete own" on payment_methods;
create policy "payment_methods: delete own" on payment_methods for delete using (auth.uid() = customer_id);
