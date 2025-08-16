import { Button } from '@/components/ui/button';
import { 
  Folder, 
  FileText, 
  Trash2, 
  Settings,
  Brain,
  Terminal,
  Image
} from 'lucide-react';

export const DesktopIcons = () => {
  const desktopIcons = [
    { id: 'ai-core', name: 'AI Core', icon: <Brain className="w-8 h-8" />, x: 50, y: 50 },
    { id: 'terminal', name: 'Terminal', icon: <Terminal className="w-8 h-8" />, x: 50, y: 150 },
    { id: 'documents', name: 'Documents', icon: <Folder className="w-8 h-8" />, x: 50, y: 250 },
    { id: 'readme', name: 'README.txt', icon: <FileText className="w-8 h-8" />, x: 50, y: 350 },
    { id: 'gallery', name: 'Gallery', icon: <Image className="w-8 h-8" />, x: 150, y: 50 },
    { id: 'settings', name: 'Settings', icon: <Settings className="w-8 h-8" />, x: 150, y: 150 },
    { id: 'trash', name: 'Trash', icon: <Trash2 className="w-8 h-8" />, x: 150, y: 450 },
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
            onDoubleClick={() => {
              console.log(`Opening ${icon.name}`);
            }}
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