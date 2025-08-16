import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { 
  Search, 
  Grid3X3, 
  Settings, 
  User, 
  Wifi, 
  Battery, 
  Volume2,
  Monitor,
  Brain
} from 'lucide-react';

export const DesktopTaskbar = () => {
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 h-14 glass border-t border-border backdrop-blur-xl z-30">
      <div className="flex items-center justify-between h-full px-4">
        {/* Left: Start Menu & Search */}
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            className="neural-glow hover:bg-gradient-neural hover:text-white transition-all duration-300"
          >
            <Brain className="w-5 h-5 mr-2" />
            <span className="font-semibold">LexOS</span>
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            className="hover:bg-secondary/50"
          >
            <Search className="w-4 h-4" />
          </Button>
        </div>

        {/* Center: Running Apps */}
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            className="w-12 h-8 bg-primary/20 border border-primary/30 glow"
          >
            <Monitor className="w-4 h-4" />
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            className="w-12 h-8 hover:bg-secondary/50"
          >
            <Grid3X3 className="w-4 h-4" />
          </Button>
        </div>

        {/* Right: System Tray */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 text-xs">
            <Button variant="ghost" size="sm" className="w-8 h-8 p-0 hover:bg-secondary/50">
              <Wifi className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm" className="w-8 h-8 p-0 hover:bg-secondary/50">
              <Volume2 className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm" className="w-8 h-8 p-0 hover:bg-secondary/50">
              <Battery className="w-4 h-4" />
            </Button>
          </div>
          
          <div className="text-right text-xs text-muted-foreground ml-2">
            <div className="font-medium">{formatTime(currentTime)}</div>
            <div className="text-[10px]">{formatDate(currentTime)}</div>
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            className="w-8 h-8 p-0 hover:bg-secondary/50"
          >
            <User className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};