create table contact_requests (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  dob date not null,
  tob time not null,
  pob text not null,
  latitude double precision,
  longitude double precision,
  email text not null,
  issue text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table contact_requests enable row level security;

create policy "Anyone can submit contact requests" on contact_requests for insert with check (true);
create policy "Only authenticated users can view contact requests" on contact_requests for select using (auth.role() = 'authenticated');
