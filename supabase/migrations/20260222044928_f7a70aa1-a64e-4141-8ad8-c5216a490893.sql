
-- Add more default channels to the Hive
INSERT INTO public.hive_channels (name, description, member_count) VALUES
  ('announcements', 'Official platform announcements and updates', 0),
  ('showcase', 'Show off your completed projects and builds', 0),
  ('help-desk', 'Get help with your circuits and code', 0),
  ('robotics', 'All things robotics — chassis, kinematics, control systems', 0),
  ('iot-cloud', 'IoT protocols, MQTT, cloud dashboards, and connectivity', 0),
  ('3d-printing', '3D printing tips, STL files, and slicer settings', 0),
  ('pcb-design', 'PCB layout, KiCad, EasyEDA, and fabrication', 0),
  ('off-topic', 'Random chat, memes, and non-engineering banter', 0),
  ('marketplace', 'Buy, sell, and trade components with other engineers', 0),
  ('competitions', 'Hackathons, contests, and engineering challenges', 0)
ON CONFLICT DO NOTHING;

-- Create user_inventory table for My Parts Box
CREATE TABLE IF NOT EXISTS public.user_inventory (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  component_id TEXT NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.user_inventory ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own inventory" ON public.user_inventory FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can add to their own inventory" ON public.user_inventory FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own inventory" ON public.user_inventory FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete from their own inventory" ON public.user_inventory FOR DELETE USING (auth.uid() = user_id);

CREATE TRIGGER update_user_inventory_updated_at BEFORE UPDATE ON public.user_inventory FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Create storage bucket for chat uploads
INSERT INTO storage.buckets (id, name, public) VALUES ('chat-uploads', 'chat-uploads', true) ON CONFLICT DO NOTHING;

CREATE POLICY "Authenticated users can upload chat files" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'chat-uploads' AND auth.role() = 'authenticated');
CREATE POLICY "Chat files are publicly viewable" ON storage.objects FOR SELECT USING (bucket_id = 'chat-uploads');
