insert into storage.buckets (id, name, public)
values ('content', 'content', true)
on conflict (id) do nothing;
create policy "Public Access" on storage.objects for select using ( bucket_id = 'content' );
create policy "Authenticated uploads" on storage.objects for insert with check ( bucket_id = 'content' and auth.role() = 'authenticated' );
create policy "Authenticated deletes" on storage.objects for delete using ( bucket_id = 'content' and auth.role() = 'authenticated' );
