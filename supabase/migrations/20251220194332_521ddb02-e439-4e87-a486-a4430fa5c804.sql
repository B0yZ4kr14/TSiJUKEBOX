-- Fix function search_path for update_jam_session_updated_at
CREATE OR REPLACE FUNCTION public.update_jam_session_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;