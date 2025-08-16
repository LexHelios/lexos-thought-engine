import { Button } from '@/components/ui/button';
import { 
  Folder, 
  FileText, 
  Trash2, 
  Settings,
  Brain,
  Terminal,
  Image,
  GitBranch,
  Code,
  Users,
  Activity,
  Monitor
} from 'lucide-react';

export const DesktopIcons = () => {
  const handleDoubleClick = (iconId: string) => {
    const windowManager = (window as any).windowManager;
    
    switch (iconId) {
      case 'github-manager':
        windowManager?.openGitHubManager();
        break;
      case 'terminal':
        windowManager?.openTerminal();
        break;
      case 'code-editor':
        windowManager?.openCodeEditor();
        break;
      case 'file-manager':
        windowManager?.openFileManager();
        break;
      case 'collaboration':
        windowManager?.openCollaboration();
        break;
      case 'system-monitor':
        windowManager?.openSystemMonitor();
        break;
      case 'code-ide':
        windowManager?.openCodeIDE();
        break;
      default:
        console.log(`Opening ${iconId}`);
    }
  };

  const desktopIcons = [
    { id: 'ai-core', name: 'AI Core', icon: <Brain className="w-8 h-8" />, x: 50, y: 50 },
    { id: 'github-manager', name: 'GitHub', icon: <GitBranch className="w-8 h-8" />, x: 50, y: 150 },
    { id: 'terminal', name: 'Research Agent', icon: <Terminal className="w-8 h-8" />, x: 50, y: 250 },
    { id: 'code-editor', name: 'Code Agent', icon: <Code className="w-8 h-8" />, x: 50, y: 350 },
    { id: 'file-manager', name: 'Browser Agent', icon: <Folder className="w-8 h-8" />, x: 150, y: 50 },
    { id: 'collaboration', name: 'Agent Collab', icon: <Users className="w-8 h-8" />, x: 150, y: 150 },
    { id: 'system-monitor', name: 'System Monitor', icon: <Activity className="w-8 h-8" />, x: 150, y: 250 },
    { id: 'code-ide', name: 'LexOS IDE', icon: <Monitor className="w-8 h-8" />, x: 150, y: 350 },
    { id: 'gallery', name: 'Gallery', icon: <Image className="w-8 h-8" />, x: 250, y: 50 },
    { id: 'settings', name: 'Settings', icon: <Settings className="w-8 h-8" />, x: 250, y: 150 },
    { id: 'trash', name: 'Trash', icon: <Trash2 className="w-8 h-8" />, x: 250, y: 450 },
  ];

  return (
    <div className="fixed inset-0 z-10">
      {desktopIcons.map((icon) => (
        <div
          key={icon.id}
          className="absolute"
          style={{ left: `${icon.x}px`, top: `${icon.y}px` }}
        >
          <Button
            variant="ghost"
            className="w-20 h-20 flex flex-col items-center justify-center gap-1 hover:bg-white/10 rounded-lg group transition-all duration-300"
            onDoubleClick={() => handleDoubleClick(icon.id)}
          >
            <div className="text-white drop-shadow-lg group-hover:text-accent transition-colors">
              {icon.icon}
            </div>
            <span className="text-xs text-white drop-shadow-lg text-center max-w-16 truncate">
              {icon.name}
            </span>
          </Button>
        </div>
      ))}
    </div>
  );
};