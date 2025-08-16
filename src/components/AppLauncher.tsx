import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Calculator, 
  FileText, 
  Image, 
  Music, 
  Settings, 
  Terminal, 
  Globe,
  Mail,
  Calendar,
  Folder,
  Camera,
  Brain,
  Search
} from 'lucide-react';

interface App {
  id: string;
  name: string;
  icon: React.ReactNode;
  category: string;
}

const apps: App[] = [
  { id: 'ai-assistant', name: 'AI Assistant', icon: <Brain className="w-6 h-6" />, category: 'AI' },
  { id: 'terminal', name: 'Terminal', icon: <Terminal className="w-6 h-6" />, category: 'System' },
  { id: 'calculator', name: 'Calculator', icon: <Calculator className="w-6 h-6" />, category: 'Tools' },
  { id: 'notes', name: 'Notes', icon: <FileText className="w-6 h-6" />, category: 'Productivity' },
  { id: 'gallery', name: 'Gallery', icon: <Image className="w-6 h-6" />, category: 'Media' },
  { id: 'music', name: 'Music', icon: <Music className="w-6 h-6" />, category: 'Media' },
  { id: 'browser', name: 'Browser', icon: <Globe className="w-6 h-6" />, category: 'Internet' },
  { id: 'mail', name: 'Mail', icon: <Mail className="w-6 h-6" />, category: 'Communication' },
  { id: 'calendar', name: 'Calendar', icon: <Calendar className="w-6 h-6" />, category: 'Productivity' },
  { id: 'files', name: 'Files', icon: <Folder className="w-6 h-6" />, category: 'System' },
  { id: 'camera', name: 'Camera', icon: <Camera className="w-6 h-6" />, category: 'Media' },
  { id: 'settings', name: 'Settings', icon: <Settings className="w-6 h-6" />, category: 'System' },
];

interface AppLauncherProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AppLauncher = ({ isOpen, onClose }: AppLauncherProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', ...Array.from(new Set(apps.map(app => app.category)))];

  const filteredApps = apps.filter(app => {
    const matchesSearch = app.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || app.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="w-full max-w-4xl h-[600px] glass neural-glow rounded-2xl border border-border p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold bg-gradient-neural bg-clip-text text-transparent">
            Application Launcher
          </h2>
          <Button
            variant="ghost"
            onClick={onClose}
            className="hover:bg-secondary/50"
          >
            ✕
          </Button>
        </div>

        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search applications..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-background/50 border-border"
          />
        </div>

        {/* Categories */}
        <div className="flex gap-2 mb-6 overflow-x-auto">
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(category)}
              className={selectedCategory === category ? 
                "bg-gradient-neural text-white border-primary" : 
                "hover:bg-secondary/50"
              }
            >
              {category}
            </Button>
          ))}
        </div>

        {/* Apps Grid */}
        <ScrollArea className="h-[400px]">
          <div className="grid grid-cols-6 gap-6">
            {filteredApps.map((app) => (
              <Button
                key={app.id}
                variant="ghost"
                className="h-24 flex flex-col items-center justify-center gap-2 hover:bg-secondary/50 hover:glow transition-all duration-300 group"
                onClick={() => {
                  // Handle app launch
                  console.log(`Launching ${app.name}`);
                  onClose();
                }}
              >
                <div className="w-8 h-8 flex items-center justify-center text-primary group-hover:text-accent transition-colors">
                  {app.icon}
                </div>
                <span className="text-xs text-center font-medium">{app.name}</span>
              </Button>
            ))}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};