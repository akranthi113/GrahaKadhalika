create table profiles (
  id uuid references auth.users not null primary key,
  full_name text,
  birth_date date,
  birth_time time,
  birth_latitude float,
  birth_longitude float,
  timezone text default 'UTC',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table profiles enable row level security;

create policy "Users can view own profile" on profiles for select using (auth.uid() = id);
create policy "Users can insert own profile" on profiles for insert with check (auth.uid() = id);
create policy "Users can update own profile" on profiles for update using (auth.uid() = id);

create table blogs (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  title text not null,
  content text not null,
  author_name text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table blogs enable row level security;

create policy "Anyone can view blogs" on blogs for select using (true);
create policy "Users can insert own blogs" on blogs for insert with check (auth.uid() = user_id);
create policy "Users can delete own blogs" on blogs for delete using (auth.uid() = user_id);
