create extension pgcrypto;

create table sample_users (
  id uuid default gen_random_uuid(),
  name text,
  email text
);