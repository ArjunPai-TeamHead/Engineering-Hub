
-- Add attachment support to hive_messages
ALTER TABLE public.hive_messages 
  ADD COLUMN IF NOT EXISTS attachment_url text,
  ADD COLUMN IF NOT EXISTS attachment_name text;

-- Create user_files table for Cloud Database
CREATE TABLE public.user_files (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  file_name text NOT NULL,
  file_type text NOT NULL DEFAULT 'text',
  file_url text,
  content text,
  file_size bigint DEFAULT 0,
  folder text DEFAULT '/',
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.user_files ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own files" ON public.user_files FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own files" ON public.user_files FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own files" ON public.user_files FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own files" ON public.user_files FOR DELETE USING (auth.uid() = user_id);

-- Create trigger for updated_at
CREATE TRIGGER update_user_files_updated_at
  BEFORE UPDATE ON public.user_files
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create hive_reactions table
CREATE TABLE public.hive_reactions (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  message_id uuid NOT NULL REFERENCES public.hive_messages(id) ON DELETE CASCADE,
  user_id uuid NOT NULL,
  emoji text NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(message_id, user_id, emoji)
);

ALTER TABLE public.hive_reactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Reactions are publicly viewable" ON public.hive_reactions FOR SELECT USING (true);
CREATE POLICY "Authenticated users can add reactions" ON public.hive_reactions FOR INSERT WITH CHECK (auth.uid() = user_id AND auth.role() = 'authenticated');
CREATE POLICY "Users can remove their own reactions" ON public.hive_reactions FOR DELETE USING (auth.uid() = user_id);

-- Enable realtime for reactions
ALTER PUBLICATION supabase_realtime ADD TABLE public.hive_reactions;

-- Create user-files storage bucket
INSERT INTO storage.buckets (id, name, public) VALUES ('user-files', 'user-files', true) ON CONFLICT DO NOTHING;

-- Storage RLS for user-files
CREATE POLICY "Users can upload their own files" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'user-files' AND (storage.foldername(name))[1] = auth.uid()::text);
CREATE POLICY "Users can view their own files" ON storage.objects FOR SELECT USING (bucket_id = 'user-files' AND (storage.foldername(name))[1] = auth.uid()::text);
CREATE POLICY "Users can delete their own files" ON storage.objects FOR DELETE USING (bucket_id = 'user-files' AND (storage.foldername(name))[1] = auth.uid()::text);
