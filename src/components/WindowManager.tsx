import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { GitHubManager } from '@/components/GitHubManager';
import { AgentWorkspace } from '@/components/AgentWorkspace';
import { AgentCollaboration } from '@/components/AgentCollaboration';
import { SystemMonitor } from '@/components/SystemMonitor';
import { CodeIDE } from '@/components/CodeIDE';
import { 
  Terminal, 
  X, 
  Minimize2, 
  Maximize2,
  GitBranch,
  FileText,
  Code,
  Folder,
  Users,
  Activity,
  Monitor
} from 'lucide-react';

interface WindowProps {
  id: string;
  title: string;
  icon: React.ReactNode;
  content: React.ReactNode;
  isMinimized: boolean;
  onMinimize: () => void;
  onMaximize: () => void;
  onClose: () => void;
}

const AppWindow = ({ id, title, icon, content, isMinimized, onMinimize, onMaximize, onClose }: WindowProps) => {
  if (isMinimized) return null;

  return (
    <Dialog open={true} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-5xl w-full h-[80vh] glass neural-glow border border-border p-0 flex flex-col overflow-hidden"
        onInteractOutside={(e) => e.preventDefault()}
      >
        {/* Window Header */}
        <div className="flex items-center justify-between p-3 border-b border-border bg-gradient-neural text-white rounded-t-lg">
          <div className="flex items-center gap-2">
            {icon}
            <span className="text-sm font-medium">{title}</span>
          </div>
          <div className="flex gap-1">
            <Button
              size="sm"
              variant="ghost"
              onClick={onMinimize}
              className="h-6 w-6 p-0 hover:bg-white/20"
            >
              <Minimize2 className="w-3 h-3" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={onMaximize}
              className="h-6 w-6 p-0 hover:bg-white/20"
            >
              <Maximize2 className="w-3 h-3" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={onClose}
              className="h-6 w-6 p-0 hover:bg-white/20"
            >
              <X className="w-3 h-3" />
            </Button>
          </div>
        </div>

        {/* Window Content */}
        <div className="flex-1 overflow-hidden">
          {content}
        </div>
      </DialogContent>
    </Dialog>
  );
};

interface OpenWindow {
  id: string;
  title: string;
  icon: React.ReactNode;
  content: React.ReactNode;
  isMinimized: boolean;
}

export const WindowManager = () => {
  const [openWindows, setOpenWindows] = useState<OpenWindow[]>([]);

  const openWindow = (id: string, title: string, icon: React.ReactNode, content: React.ReactNode) => {
    // Check if window is already open
    const existingWindow = openWindows.find(w => w.id === id);
    if (existingWindow) {
      // If minimized, restore it
      if (existingWindow.isMinimized) {
        setOpenWindows(prev => 
          prev.map(w => w.id === id ? { ...w, isMinimized: false } : w)
        );
      }
      return;
    }

    // Open new window
    setOpenWindows(prev => [...prev, {
      id,
      title,
      icon,
      content,
      isMinimized: false
    }]);
  };

  const minimizeWindow = (id: string) => {
    setOpenWindows(prev =>
      prev.map(w => w.id === id ? { ...w, isMinimized: true } : w)
    );
  };

  const maximizeWindow = (id: string) => {
    setOpenWindows(prev =>
      prev.map(w => w.id === id ? { ...w, isMinimized: false } : w)
    );
  };

  const closeWindow = (id: string) => {
    setOpenWindows(prev => prev.filter(w => w.id !== id));
  };

  const openGitHubManager = () => {
    openWindow(
      'github-manager',
      'GitHub Manager',
      <GitBranch className="w-4 h-4" />,
      <GitHubManager />
    );
  };

  const openCodeEditor = () => {
    openWindow(
      'code-editor',
      'Code Editor',
      <Code className="w-4 h-4" />,
      <AgentWorkspace agentId="code-agent" agentType="coder" />
    );
  };

  const openFileManager = () => {
    openWindow(
      'file-manager',
      'Browser Agent',
      <Folder className="w-4 h-4" />,
      <AgentWorkspace agentId="browser-agent" agentType="browser" />
    );
  };

  const openTerminal = () => {
    openWindow(
      'terminal',
      'Research Agent',
      <Terminal className="w-4 h-4" />,
      <AgentWorkspace agentId="research-agent" agentType="researcher" />
    );
  };

  const openCollaboration = () => {
    openWindow(
      'collaboration',
      'Agent Collaboration',
      <Users className="w-4 h-4" />,
      <AgentCollaboration />
    );
  };

  const openSystemMonitor = () => {
    openWindow(
      'system-monitor',
      'System Monitor', 
      <Activity className="w-4 h-4" />,
      <SystemMonitor />
    );
  };

  const openCodeIDE = () => {
    openWindow(
      'code-ide',
      'LexOS IDE',
      <Monitor className="w-4 h-4" />,
      <CodeIDE />
    );
  };

  // Expose functions globally for desktop icons to use
  (window as any).windowManager = {
    openGitHubManager,
    openCodeEditor,
    openFileManager,
    openTerminal,
    openCollaboration,
    openSystemMonitor,
    openCodeIDE,
    closeAllWindows: () => setOpenWindows([])
  };

  return (
    <>
      {/* Render all open windows */}
      {openWindows.map(window => (
        <AppWindow
          key={window.id}
          id={window.id}
          title={window.title}
          icon={window.icon}
          content={window.content}
          isMinimized={window.isMinimized}
          onMinimize={() => minimizeWindow(window.id)}
          onMaximize={() => maximizeWindow(window.id)}
          onClose={() => closeWindow(window.id)}
        />
      ))}

      {/* Taskbar buttons for minimized windows */}
      <div className="fixed bottom-16 left-4 flex gap-2 z-40">
        {openWindows.filter(w => w.isMinimized).map(window => (
          <Button
            key={window.id}
            onClick={() => maximizeWindow(window.id)}
            className="glass neural-glow bg-gradient-neural text-white hover:bg-opacity-80 flex items-center gap-2"
            size="sm"
          >
            {window.icon}
            {window.title}
          </Button>
        ))}
      </div>
    </>
  );
};