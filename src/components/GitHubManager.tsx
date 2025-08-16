import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { supabase } from '@/integrations/supabase/client';
import { 
  GitBranch, 
  Star, 
  GitFork, 
  ExternalLink, 
  Plus, 
  Search,
  Folder,
  File,
  RefreshCw,
  User,
  Calendar,
  Eye,
  Lock,
  Globe
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

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

interface GitHubUser {
  login: string;
  name: string;
  avatar_url: string;
  public_repos: number;
  followers: number;
  following: number;
}

export const GitHubManager = () => {
  const [repos, setRepos] = useState<GitHubRepo[]>([]);
  const [user, setUser] = useState<GitHubUser | null>(null);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newRepoName, setNewRepoName] = useState('');
  const [newRepoDescription, setNewRepoDescription] = useState('');
  const [newRepoPrivate, setNewRepoPrivate] = useState(false);
  const { toast } = useToast();

  const callGitHubAPI = async (action: string, params = {}) => {
    try {
      const { data, error } = await supabase.functions.invoke('github-api', {
        body: { action, ...params }
      });

      if (error) throw error;
      if (!data.success) throw new Error(data.error);

      return data.data;
    } catch (error) {
      console.error('GitHub API call failed:', error);
      toast({
        title: 'GitHub API Error',
        description: error.message || 'Failed to communicate with GitHub',
        variant: 'destructive'
      });
      throw error;
    }
  };

  const fetchUserInfo = async () => {
    try {
      const userData = await callGitHubAPI('getUserInfo');
      setUser(userData);
    } catch (error) {
      console.error('Failed to fetch user info:', error);
    }
  };

  const fetchRepositories = async () => {
    setLoading(true);
    try {
      const repoData = await callGitHubAPI('listRepos');
      setRepos(repoData);
      toast({
        title: 'Success',
        description: `Loaded ${repoData.length} repositories`
      });
    } catch (error) {
      console.error('Failed to fetch repositories:', error);
    } finally {
      setLoading(false);
    }
  };

  const createRepository = async () => {
    if (!newRepoName.trim()) return;
    
    setLoading(true);
    try {
      const newRepo = await callGitHubAPI('createRepo', {
        name: newRepoName,
        description: newRepoDescription,
        private: newRepoPrivate
      });
      
      setRepos(prev => [newRepo, ...prev]);
      setIsCreateDialogOpen(false);
      setNewRepoName('');
      setNewRepoDescription('');
      setNewRepoPrivate(false);
      
      toast({
        title: 'Repository Created',
        description: `Successfully created ${newRepo.full_name}`
      });
    } catch (error) {
      console.error('Failed to create repository:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserInfo();
    fetchRepositories();
  }, []);

  const filteredRepos = repos.filter(repo =>
    repo.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    repo.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <GitBranch className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-semibold">GitHub Manager</h2>
          </div>
          {user && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <img 
                src={user.avatar_url} 
                alt={user.login}
                className="w-6 h-6 rounded-full"
              />
              <span>{user.login}</span>
              <Badge variant="outline">{user.public_repos} repos</Badge>
            </div>
          )}
        </div>
        
        <div className="flex gap-2">
          <Button
            onClick={fetchRepositories}
            disabled={loading}
            size="sm"
            variant="outline"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="bg-gradient-neural text-white hover:opacity-80">
                <Plus className="w-4 h-4 mr-2" />
                New Repo
              </Button>
            </DialogTrigger>
            <DialogContent className="glass border-border">
              <DialogHeader>
                <DialogTitle>Create New Repository</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Repository Name</label>
                  <Input
                    value={newRepoName}
                    onChange={(e) => setNewRepoName(e.target.value)}
                    placeholder="my-awesome-project"
                    className="bg-background/50"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Description (optional)</label>
                  <Input
                    value={newRepoDescription}
                    onChange={(e) => setNewRepoDescription(e.target.value)}
                    placeholder="A brief description of your project"
                    className="bg-background/50"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="private"
                    checked={newRepoPrivate}
                    onChange={(e) => setNewRepoPrivate(e.target.checked)}
                    className="rounded"
                  />
                  <label htmlFor="private" className="text-sm">Private repository</label>
                </div>
                <div className="flex gap-2 pt-4">
                  <Button
                    onClick={createRepository}
                    disabled={loading || !newRepoName.trim()}
                    className="flex-1 bg-gradient-neural text-white hover:opacity-80"
                  >
                    {loading ? 'Creating...' : 'Create Repository'}
                  </Button>
                  <Button
                    onClick={() => setIsCreateDialogOpen(false)}
                    variant="outline"
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Search */}
      <div className="p-4 border-b border-border">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search repositories..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-background/50"
          />
        </div>
      </div>

      {/* Repository List */}
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-3">
          {loading && repos.length === 0 ? (
            <div className="flex items-center justify-center py-8">
              <RefreshCw className="w-6 h-6 animate-spin text-primary mr-2" />
              <span className="text-muted-foreground">Loading repositories...</span>
            </div>
          ) : filteredRepos.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              {searchQuery ? 'No repositories match your search' : 'No repositories found'}
            </div>
          ) : (
            filteredRepos.map((repo) => (
              <div
                key={repo.id}
                className="glass rounded-lg p-4 hover:bg-secondary/50 transition-all duration-300 group"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                        {repo.name}
                      </h3>
                      {repo.private ? (
                        <Lock className="w-3 h-3 text-muted-foreground" />
                      ) : (
                        <Globe className="w-3 h-3 text-muted-foreground" />
                      )}
                      {repo.language && (
                        <Badge variant="secondary" className="text-xs">
                          {repo.language}
                        </Badge>
                      )}
                    </div>
                    
                    {repo.description && (
                      <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                        {repo.description}
                      </p>
                    )}
                    
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Star className="w-3 h-3" />
                        {repo.stargazers_count}
                      </div>
                      <div className="flex items-center gap-1">
                        <GitFork className="w-3 h-3" />
                        {repo.forks_count}
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        Updated {formatDate(repo.updated_at)}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex gap-2 ml-4">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => window.open(repo.html_url, '_blank')}
                      className="hover:bg-secondary/50"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  );
};