-- Add author_name column to blogs if it does not already exist.
alter table blogs add column if not exists author_name text;

-- Reload the PostgREST schema cache so the app immediately sees the new column.
notify pgrst, 'reload schema';