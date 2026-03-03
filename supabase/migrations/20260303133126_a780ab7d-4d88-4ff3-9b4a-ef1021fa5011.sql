
-- Add username column to profiles
ALTER TABLE public.profiles ADD COLUMN username text;

-- Create unique index on username (case-insensitive)
CREATE UNIQUE INDEX idx_profiles_username_unique ON public.profiles (lower(username));

-- Update existing profiles to use display_name as username
UPDATE public.profiles SET username = lower(replace(display_name, ' ', '_')) WHERE username IS NULL;

-- Update handle_new_user to also set username from metadata
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  INSERT INTO public.profiles (user_id, display_name, username)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'display_name', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'username', lower(replace(split_part(NEW.email, '@', 1), '.', '_')))
  );
  
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'apprentice');
  
  RETURN NEW;
END;
$function$;
