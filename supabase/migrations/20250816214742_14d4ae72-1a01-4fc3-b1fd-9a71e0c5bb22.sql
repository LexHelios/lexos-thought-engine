-- Fix critical security vulnerability: Replace 'true' RLS policies with proper authentication checks
-- These tables contain sensitive system operations and should not be publicly accessible

-- Fix agent_status table - contains sensitive ngrok URLs
DROP POLICY IF EXISTS "Users can view their own data" ON public.agent_status;
CREATE POLICY "Authenticated users only can view agent status" 
ON public.agent_status 
FOR SELECT 
TO authenticated
USING (auth.uid() IS NOT NULL);

-- Fix command_logs table - contains sensitive system commands and outputs  
DROP POLICY IF EXISTS "Users can view their own data" ON public.command_logs;
CREATE POLICY "Authenticated users only can view command logs" 
ON public.command_logs 
FOR SELECT 
TO authenticated
USING (auth.uid() IS NOT NULL);

-- Fix episodic_memory table - contains AI agent conversations
DROP POLICY IF EXISTS "Users can view their own data" ON public.episodic_memory;
CREATE POLICY "Authenticated users only can view episodic memory" 
ON public.episodic_memory 
FOR SELECT 
TO authenticated
USING (auth.uid() IS NOT NULL);

-- Fix missions table - contains business logic and results
DROP POLICY IF EXISTS "Users can view their own data" ON public.missions;
CREATE POLICY "Authenticated users only can view missions" 
ON public.missions 
FOR SELECT 
TO authenticated
USING (auth.uid() IS NOT NULL);

-- Fix semantic_memory table - contains semantic data
DROP POLICY IF EXISTS "Users can view their own data" ON public.semantic_memory;
CREATE POLICY "Authenticated users only can view semantic memory" 
ON public.semantic_memory 
FOR SELECT 
TO authenticated
USING (auth.uid() IS NOT NULL);

-- Note: Consider adding user_id columns and user-specific policies if these tables 
-- should contain user-specific data rather than system-wide data