insert into storage.buckets (id, name, public)
values ('content', 'content', true)
on conflict (id) do nothing;
create policy "Public Access" on storage.objects for select using ( bucket_id = 'content' );
create policy "Owner uploads" on storage.objects for insert with check ( bucket_id = 'content' and exists ( select 1 from public.profiles where profiles.id = auth.uid() and profiles.role = 'owner' ) );
create policy "Owner deletes" on storage.objects for delete using ( bucket_id = 'content' and exists ( select 1 from public.profiles where profiles.id = auth.uid() and profiles.role = 'owner' ) );
create policy "Owner updates" on storage.objects for update using ( bucket_id = 'content' and exists ( select 1 from public.profiles where profiles.id = auth.uid() and profiles.role = 'owner' ) );
