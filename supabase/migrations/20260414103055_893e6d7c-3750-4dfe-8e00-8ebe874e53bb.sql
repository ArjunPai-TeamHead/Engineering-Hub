
UPDATE storage.buckets SET public = false WHERE id = 'chat-uploads';

DROP POLICY IF EXISTS "Chat files are publicly viewable" ON storage.objects;

CREATE POLICY "Authenticated users can view chat files"
  ON storage.objects FOR SELECT
  TO authenticated
  USING (bucket_id = 'chat-uploads');
