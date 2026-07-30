-- Run in Supabase SQL editor so cover / character image uploads work.
insert into storage.buckets (id, name, public)
values ('covers', 'covers', true)
on conflict (id) do update set public = true;

create policy "Public read covers"
  on storage.objects for select
  using (bucket_id = 'covers');

create policy "Public upload covers"
  on storage.objects for insert
  with check (bucket_id = 'covers');

create policy "Public update covers"
  on storage.objects for update
  using (bucket_id = 'covers');

create policy "Public delete covers"
  on storage.objects for delete
  using (bucket_id = 'covers');
