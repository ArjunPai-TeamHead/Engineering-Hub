
-- ORDERS: prevent payment status tampering
DROP POLICY IF EXISTS "Users can insert their own orders" ON public.orders;
DROP POLICY IF EXISTS "Users can update their own orders" ON public.orders;

CREATE POLICY "Users can insert their own pending orders"
ON public.orders
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id AND status = 'pending');

-- CERTIFICATES: prevent self-issuance
DROP POLICY IF EXISTS "Users can insert their own certificates" ON public.certificates;

-- PROFILES: restrict to authenticated users
DROP POLICY IF EXISTS "Profiles are publicly viewable" ON public.profiles;

CREATE POLICY "Profiles viewable by authenticated users"
ON public.profiles
FOR SELECT
TO authenticated
USING (true);

-- HIVE MESSAGES: restrict to authenticated users
DROP POLICY IF EXISTS "Messages are publicly viewable" ON public.hive_messages;

CREATE POLICY "Messages viewable by authenticated users"
ON public.hive_messages
FOR SELECT
TO authenticated
USING (true);

-- HIVE CHANNELS: restrict to authenticated users
DROP POLICY IF EXISTS "Channels are publicly viewable" ON public.hive_channels;

CREATE POLICY "Channels viewable by authenticated users"
ON public.hive_channels
FOR SELECT
TO authenticated
USING (true);

-- HIVE REACTIONS: restrict to authenticated users
DROP POLICY IF EXISTS "Reactions are publicly viewable" ON public.hive_reactions;

CREATE POLICY "Reactions viewable by authenticated users"
ON public.hive_reactions
FOR SELECT
TO authenticated
USING (true);

-- CHAT-UPLOADS storage: owner-scoped access (path prefix = user id)
DROP POLICY IF EXISTS "Users can view chat uploads" ON storage.objects;
DROP POLICY IF EXISTS "Users can upload to chat-uploads" ON storage.objects;
DROP POLICY IF EXISTS "Users can insert chat uploads" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated can read chat-uploads" ON storage.objects;

CREATE POLICY "Users can view their own chat uploads"
ON storage.objects
FOR SELECT
TO authenticated
USING (bucket_id = 'chat-uploads' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can upload their own chat uploads"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'chat-uploads' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can update their own chat uploads"
ON storage.objects
FOR UPDATE
TO authenticated
USING (bucket_id = 'chat-uploads' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own chat uploads"
ON storage.objects
FOR DELETE
TO authenticated
USING (bucket_id = 'chat-uploads' AND auth.uid()::text = (storage.foldername(name))[1]);
