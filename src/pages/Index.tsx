import { useState } from 'react';
import { DesktopTaskbar } from '@/components/DesktopTaskbar';
import { AITerminal } from '@/components/AITerminal';
import { AppLauncher } from '@/components/AppLauncher';
import { DesktopIcons } from '@/components/DesktopIcons';
import { WindowManager } from '@/components/WindowManager';
import { Button } from '@/components/ui/button';
import { Grid3X3 } from 'lucide-react';
import neuralBg from '@/assets/neural-bg.jpg';

const Index = () => {
  const [isAppLauncherOpen, setIsAppLauncherOpen] = useState(false);

  return (
    <div 
      className="min-h-screen relative overflow-hidden"
      style={{
        backgroundImage: `url(${neuralBg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
      }}
    >
      {/* Neural overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-background/20 via-transparent to-background/40"></div>
      
      {/* Desktop Icons */}
      <DesktopIcons />
      
      {/* App Launcher Button (floating) */}
      <Button
        onClick={() => setIsAppLauncherOpen(true)}
        className="fixed top-4 left-4 z-20 glass neural-glow hover:bg-gradient-neural transition-all duration-300"
        size="lg"
      >
        <Grid3X3 className="w-5 h-5 mr-2" />
        Apps
      </Button>

      {/* Welcome Message (top right) */}
      <div className="fixed top-4 right-4 z-20 glass rounded-lg p-4 max-w-sm">
        <h2 className="text-lg font-bold bg-gradient-neural bg-clip-text text-transparent mb-2">
          Welcome to LexOS
        </h2>
        <p className="text-sm text-muted-foreground">
          AI-powered operating system interface. Double-click desktop icons or use the AI terminal.
        </p>
      </div>
      
      {/* Window Manager for Applications */}
      <WindowManager />
      
      {/* App Launcher Modal */}
      <AppLauncher 
        isOpen={isAppLauncherOpen} 
        onClose={() => setIsAppLauncherOpen(false)} 
      />
      
      {/* AI Terminal */}
      <AITerminal />
      
      {/* Desktop Taskbar */}
      <DesktopTaskbar />
    </div>
  );
};

export default Index;
