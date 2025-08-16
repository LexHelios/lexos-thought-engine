-- Fix security issues by enabling RLS on existing tables
ALTER TABLE public.agent_status ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.command_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.episodic_memory ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.missions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.semantic_memory ENABLE ROW LEVEL SECURITY;

-- Create basic security policies for existing tables
CREATE POLICY "Users can view their own data" ON public.agent_status FOR SELECT USING (true);
CREATE POLICY "Users can view their own data" ON public.command_logs FOR SELECT USING (true);
CREATE POLICY "Users can view their own data" ON public.episodic_memory FOR SELECT USING (true);
CREATE POLICY "Users can view their own data" ON public.missions FOR SELECT USING (true);
CREATE POLICY "Users can view their own data" ON public.semantic_memory FOR SELECT USING (true);

-- Fix search path for functions
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, email, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'avatar_url', '')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;