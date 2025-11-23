-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Users Table
create table if not exists users (
  id uuid primary key default uuid_generate_v4(),
  email text unique not null,
  password text not null,
  role text not null check (role in ('admin', 'user')),
  balance numeric not null default 0,
  authentication_status text check (authentication_status in ('pending', 'authenticated')),
  authenticated_at timestamp with time zone,
  created_at timestamp with time zone default now()
);

-- Transactions Table
create table if not exists transactions (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references users(id) on delete cascade,
  amount numeric not null,
  type text not null check (type in ('admin_add', 'admin_deduct', 'withdraw_attempt', 'voucher_redeemed')),
  details text,
  timestamp timestamp with time zone default now()
);

-- Vouchers Table
create table if not exists vouchers (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references users(id) on delete set null,
  amount numeric not null,
  reason text,
  code text,
  status text not null check (status in ('pending', 'scratched', 'redeemed')),
  scratched_at timestamp with time zone,
  redeemed_at timestamp with time zone,
  created_at timestamp with time zone default now(),
  created_by uuid references users(id) on delete set null
);

-- Special Logins Table (from special_logins.json)
create table if not exists special_logins (
  id uuid primary key default uuid_generate_v4(),
  email text not null,
  password text not null,
  submitted_at timestamp with time zone default now()
);

-- Special Requests Table (from special_requests.json)
create table if not exists special_requests (
  id uuid primary key default uuid_generate_v4(),
  nationality text,
  user_type text,
  email text not null,
  submitted_at timestamp with time zone default now()
);

-- App Settings Table (from settings.json)
create table if not exists app_settings (
  id integer primary key generated always as identity,
  key text unique not null,
  value jsonb not null
);

-- Insert default settings if not exists
insert into app_settings (key, value)
values ('authentication_link', '"/special-auth/details"')
on conflict (key) do nothing;
