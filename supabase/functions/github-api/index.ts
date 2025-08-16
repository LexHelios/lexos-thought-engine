import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface GitHubRepo {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  html_url: string;
  clone_url: string;
  private: boolean;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  updated_at: string;
  owner: {
    login: string;
    avatar_url: string;
  };
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('GitHub API function called with method:', req.method);
    
    // Get the GitHub token from Supabase secrets
    const githubToken = Deno.env.get('GITHUB_TOKEN');
    if (!githubToken) {
      console.error('GitHub token not found in environment');
      return new Response(
        JSON.stringify({ error: 'GitHub token not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { action, ...params } = await req.json();
    console.log('Action requested:', action, 'with params:', params);

    const githubHeaders = {
      'Authorization': `Bearer ${githubToken}`,
      'Accept': 'application/vnd.github.v3+json',
      'User-Agent': 'LexOS-AI-OS',
    };

    let response;
    let data;

    switch (action) {
      case 'listRepos':
        console.log('Fetching user repositories...');
        response = await fetch('https://api.github.com/user/repos?sort=updated&per_page=50', {
          headers: githubHeaders,
        });
        data = await response.json();
        
        if (!response.ok) {
          console.error('GitHub API error:', data);
          throw new Error(data.message || 'Failed to fetch repositories');
        }
        
        console.log(`Successfully fetched ${data.length} repositories`);
        break;

      case 'getRepo':
        const { owner, repo } = params;
        console.log(`Fetching repository: ${owner}/${repo}`);
        response = await fetch(`https://api.github.com/repos/${owner}/${repo}`, {
          headers: githubHeaders,
        });
        data = await response.json();
        
        if (!response.ok) {
          console.error('GitHub API error:', data);
          throw new Error(data.message || 'Failed to fetch repository');
        }
        
        console.log(`Successfully fetched repository: ${data.full_name}`);
        break;

      case 'createRepo':
        const { name, description, private: isPrivate } = params;
        console.log(`Creating repository: ${name}`);
        response = await fetch('https://api.github.com/user/repos', {
          method: 'POST',
          headers: {
            ...githubHeaders,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name,
            description,
            private: isPrivate || false,
            auto_init: true,
          }),
        });
        data = await response.json();
        
        if (!response.ok) {
          console.error('GitHub API error:', data);
          throw new Error(data.message || 'Failed to create repository');
        }
        
        console.log(`Successfully created repository: ${data.full_name}`);
        break;

      case 'getContents':
        const { owner: contentsOwner, repo: contentsRepo, path } = params;
        console.log(`Fetching contents: ${contentsOwner}/${contentsRepo}/${path || ''}`);
        const contentsUrl = `https://api.github.com/repos/${contentsOwner}/${contentsRepo}/contents${path ? `/${path}` : ''}`;
        response = await fetch(contentsUrl, {
          headers: githubHeaders,
        });
        data = await response.json();
        
        if (!response.ok) {
          console.error('GitHub API error:', data);
          throw new Error(data.message || 'Failed to fetch repository contents');
        }
        
        console.log(`Successfully fetched contents for: ${contentsOwner}/${contentsRepo}/${path || 'root'}`);
        break;

      case 'getUserInfo':
        console.log('Fetching user information...');
        response = await fetch('https://api.github.com/user', {
          headers: githubHeaders,
        });
        data = await response.json();
        
        if (!response.ok) {
          console.error('GitHub API error:', data);
          throw new Error(data.message || 'Failed to fetch user information');
        }
        
        console.log(`Successfully fetched user info: ${data.login}`);
        break;

      default:
        console.error('Unknown action:', action);
        throw new Error(`Unknown action: ${action}`);
    }

    return new Response(
      JSON.stringify({ success: true, data }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('GitHub API function error:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message || 'Internal server error' 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});