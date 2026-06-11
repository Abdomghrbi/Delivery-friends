create extension if not exists "pgcrypto";

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  role text not null default 'customer' check (role in ('customer', 'worker', 'admin')),
  full_name text,
  phone text,
  is_verified boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid not null references public.profiles(id) on delete cascade,
  worker_id uuid references public.profiles(id) on delete set null,
  item_name text not null,
  pickup_address text not null,
  pickup_lat double precision,
  pickup_lng double precision,
  delivery_address text not null,
  delivery_lat double precision,
  delivery_lng double precision,
  notes text,
  status text not null default 'pending' check (status in ('pending', 'accepted', 'in_transit', 'delivered', 'cancelled')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists profiles_role_idx on public.profiles(role);
create index if not exists orders_customer_id_idx on public.orders(customer_id);
create index if not exists orders_worker_id_idx on public.orders(worker_id);
create index if not exists orders_status_idx on public.orders(status);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, role, full_name, phone, is_verified)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'role', 'customer'),
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'phone',
    false
  )
  on conflict (id) do update set
    role = excluded.role,
    full_name = excluded.full_name,
    phone = excluded.phone,
    updated_at = now();

  return new;
end;
$$;

create or replace function public.current_user_role()
returns text
language sql
stable
security definer
set search_path = public
as $$
  select coalesce((select role from public.profiles where id = auth.uid()), 'customer');
$$;

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select public.current_user_role() = 'admin';
$$;

create trigger if not exists set_profiles_updated_at
before update on public.profiles
for each row execute procedure public.set_updated_at();

create trigger if not exists set_orders_updated_at
before update on public.orders
for each row execute procedure public.set_updated_at();

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.handle_new_user();

alter table public.profiles enable row level security;
alter table public.orders enable row level security;

create policy "profiles_select_self_or_admin"
on public.profiles
for select
to authenticated
using (
  auth.uid() = id
  or public.is_admin()
);

create policy "profiles_insert_self"
on public.profiles
for insert
to authenticated
with check (auth.uid() = id or public.is_admin());

create policy "profiles_update_self_or_admin"
on public.profiles
for update
to authenticated
using (
  auth.uid() = id
  or public.is_admin()
)
with check (
  auth.uid() = id
  or public.is_admin()
);

create policy "orders_select_relevant"
on public.orders
for select
to authenticated
using (
  auth.uid() = customer_id
  or auth.uid() = worker_id
  or public.is_admin()
);

create policy "orders_insert_customer_or_admin"
on public.orders
for insert
to authenticated
with check (
  auth.uid() = customer_id
  or public.is_admin()
);

create policy "orders_update_customer_worker_or_admin"
on public.orders
for update
to authenticated
using (
  auth.uid() = customer_id
  or auth.uid() = worker_id
  or public.is_admin()
)
with check (
  auth.uid() = customer_id
  or auth.uid() = worker_id
  or public.is_admin()
);
