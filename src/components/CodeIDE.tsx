import { useState, useEffect, useRef } from 'react';
import Editor from '@monaco-editor/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { 
  FolderOpen,
  File,
  FileText,
  Save,
  Play,
  Terminal,
  GitBranch,
  RefreshCw,
  Search,
  Settings,
  Plus,
  Folder,
  ChevronRight,
  ChevronDown,
  X,
  Download,
  Upload
} from 'lucide-react';

interface FileNode {
  name: string;
  type: 'file' | 'folder';
  path: string;
  children?: FileNode[];
  content?: string;
  language?: string;
  isExpanded?: boolean;
}

interface Tab {
  id: string;
  name: string;
  path: string;
  content: string;
  language: string;
  isDirty: boolean;
}

export const CodeIDE = () => {
  const [fileTree, setFileTree] = useState<FileNode[]>([]);
  const [tabs, setTabs] = useState<Tab[]>([]);
  const [activeTab, setActiveTab] = useState<string | null>(null);
  const [terminalOutput, setTerminalOutput] = useState<string[]>(['LexOS IDE Terminal initialized...']);
  const [terminalInput, setTerminalInput] = useState('');
  const [currentRepo, setCurrentRepo] = useState<string>('');
  const [isTerminalVisible, setIsTerminalVisible] = useState(true);
  const { toast } = useToast();
  const editorRef = useRef<any>(null);

  // Initialize with sample file structure
  useEffect(() => {
    const sampleFiles: FileNode[] = [
      {
        name: 'src',
        type: 'folder',
        path: 'src',
        isExpanded: true,
        children: [
          {
            name: 'components',
            type: 'folder', 
            path: 'src/components',
            isExpanded: false,
            children: [
              { name: 'App.tsx', type: 'file', path: 'src/components/App.tsx', language: 'typescript' },
              { name: 'Button.tsx', type: 'file', path: 'src/components/Button.tsx', language: 'typescript' }
            ]
          },
          { name: 'index.ts', type: 'file', path: 'src/index.ts', language: 'typescript' },
          { name: 'main.tsx', type: 'file', path: 'src/main.tsx', language: 'typescript' }
        ]
      },
      { name: 'package.json', type: 'file', path: 'package.json', language: 'json' },
      { name: 'README.md', type: 'file', path: 'README.md', language: 'markdown' },
      { name: '.gitignore', type: 'file', path: '.gitignore', language: 'plaintext' }
    ];
    setFileTree(sampleFiles);
  }, []);

  const toggleFolder = (path: string) => {
    const updateFileTree = (nodes: FileNode[]): FileNode[] => {
      return nodes.map(node => {
        if (node.path === path && node.type === 'folder') {
          return { ...node, isExpanded: !node.isExpanded };
        }
        if (node.children) {
          return { ...node, children: updateFileTree(node.children) };
        }
        return node;
      });
    };
    setFileTree(updateFileTree(fileTree));
  };

  const openFile = async (file: FileNode) => {
    if (file.type === 'folder') {
      toggleFolder(file.path);
      return;
    }

    // Check if tab already exists
    const existingTab = tabs.find(tab => tab.path === file.path);
    if (existingTab) {
      setActiveTab(existingTab.id);
      return;
    }

    // Load file content (simulate for now)
    let content = '';
    switch (file.name) {
      case 'package.json':
        content = `{
  "name": "lexos-project",
  "version": "1.0.0",
  "description": "LexOS AI Operating System",
  "main": "index.js",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^18.2.0",
    "typescript": "^5.0.0"
  }
}`;
        break;
      case 'README.md':
        content = `# LexOS AI Operating System

A revolutionary AI-powered operating system built with React and TypeScript.

## Features

- Multi-agent AI system
- Real-time collaboration
- Voice interface
- Advanced monitoring

## Getting Started

\`\`\`bash
npm install
npm run dev
\`\`\`
`;
        break;
      case 'App.tsx':
        content = `import React from 'react';
import './App.css';

interface AppProps {
  title?: string;
}

const App: React.FC<AppProps> = ({ title = 'LexOS' }) => {
  return (
    <div className="app">
      <header className="app-header">
        <h1>{title}</h1>
        <p>Welcome to the LexOS AI Operating System</p>
      </header>
    </div>
  );
};

export default App;`;
        break;
      default:
        content = `// ${file.name}
// This is a placeholder file in the LexOS IDE
console.log('Hello from ${file.name}');`;
    }

    const newTab: Tab = {
      id: Date.now().toString(),
      name: file.name,
      path: file.path,
      content,
      language: file.language || 'typescript',
      isDirty: false
    };

    setTabs(prev => [...prev, newTab]);
    setActiveTab(newTab.id);
  };

  const closeTab = (tabId: string, event?: React.MouseEvent) => {
    if (event) {
      event.stopPropagation();
    }
    
    setTabs(prev => prev.filter(tab => tab.id !== tabId));
    
    if (activeTab === tabId) {
      const remainingTabs = tabs.filter(tab => tab.id !== tabId);
      setActiveTab(remainingTabs.length > 0 ? remainingTabs[remainingTabs.length - 1].id : null);
    }
  };

  const saveFile = async (tabId: string) => {
    const tab = tabs.find(t => t.id === tabId);
    if (!tab) return;

    // Simulate save operation
    setTabs(prev => prev.map(t => 
      t.id === tabId ? { ...t, isDirty: false } : t
    ));

    toast({
      title: "File Saved",
      description: `${tab.name} has been saved successfully`
    });
  };

  const executeTerminalCommand = async () => {
    if (!terminalInput.trim()) return;

    const command = terminalInput.trim();
    setTerminalOutput(prev => [...prev, `$ ${command}`]);
    setTerminalInput('');

    // Simulate command execution
    setTimeout(() => {
      let output = '';
      switch (command.toLowerCase()) {
        case 'ls':
        case 'dir':
          output = fileTree.map(file => file.name).join('  ');
          break;
        case 'pwd':
          output = `/workspace/${currentRepo || 'lexos-project'}`;
          break;
        case 'git status':
          output = 'On branch main\nnothing to commit, working tree clean';
          break;
        case 'npm install':
          output = 'Installing dependencies...\n✓ All dependencies installed successfully';
          break;
        case 'npm run dev':
          output = 'Starting development server...\n➜ Local: http://localhost:3000';
          break;
        case 'clear':
          setTerminalOutput(['Terminal cleared.']);
          return;
        case 'help':
          output = `Available commands:
  ls, dir     - List files
  pwd         - Current directory
  git status  - Git status
  npm install - Install dependencies
  npm run dev - Start dev server
  clear       - Clear terminal
  help        - Show this help`;
          break;
        default:
          output = `Command '${command}' not found. Type 'help' for available commands.`;
      }
      
      setTerminalOutput(prev => [...prev, output]);
    }, 500);
  };

  const connectToGitHub = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('github-api', {
        body: { action: 'listRepos' }
      });

      if (error) throw error;

      toast({
        title: "GitHub Connected",
        description: `Found ${data.length} repositories`
      });
    } catch (error) {
      toast({
        title: "GitHub Connection Failed",
        description: "Please check your GitHub integration",
        variant: "destructive"
      });
    }
  };

  const getFileIcon = (file: FileNode) => {
    if (file.type === 'folder') {
      return file.isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />;
    }
    
    const ext = file.name.split('.').pop()?.toLowerCase();
    switch (ext) {
      case 'tsx':
      case 'jsx':
        return <FileText className="w-4 h-4 text-blue-500" />;
      case 'ts':
      case 'js':
        return <FileText className="w-4 h-4 text-yellow-500" />;
      case 'json':
        return <FileText className="w-4 h-4 text-green-500" />;
      case 'md':
        return <FileText className="w-4 h-4 text-purple-500" />;
      default:
        return <File className="w-4 h-4 text-gray-500" />;
    }
  };

  const renderFileTree = (nodes: FileNode[], depth = 0) => {
    return nodes.map(node => (
      <div key={node.path}>
        <div 
          className={`flex items-center gap-2 px-2 py-1 hover:bg-secondary/50 cursor-pointer transition-colors`}
          style={{ paddingLeft: `${8 + depth * 16}px` }}
          onClick={() => openFile(node)}
        >
          {getFileIcon(node)}
          <span className="text-sm truncate">{node.name}</span>
        </div>
        {node.type === 'folder' && node.isExpanded && node.children && (
          <div>{renderFileTree(node.children, depth + 1)}</div>
        )}
      </div>
    ));
  };

  const activeTabData = tabs.find(tab => tab.id === activeTab);

  return (
    <div className="h-full flex flex-col bg-background">
      {/* Top Bar */}
      <div className="flex items-center justify-between p-2 border-b border-border bg-muted/30">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={connectToGitHub}>
            <GitBranch className="w-4 h-4 mr-2" />
            Connect GitHub
          </Button>
          {currentRepo && (
            <Badge variant="outline">{currentRepo}</Badge>
          )}
        </div>
        
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="sm">
            <RefreshCw className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm">
            <Search className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm">
            <Settings className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* File Explorer */}
        <div className="w-64 border-r border-border flex flex-col">
          <div className="p-3 border-b border-border">
            <div className="flex items-center justify-between">
              <h4 className="font-medium text-sm">Explorer</h4>
              <Button variant="ghost" size="sm" className="w-6 h-6 p-0">
                <Plus className="w-3 h-3" />
              </Button>
            </div>
          </div>
          
          <ScrollArea className="flex-1">
            <div className="p-2">
              {renderFileTree(fileTree)}
            </div>
          </ScrollArea>
        </div>

        {/* Main Editor Area */}
        <div className="flex-1 flex flex-col">
          {/* Tab Bar */}
          {tabs.length > 0 && (
            <div className="flex items-center border-b border-border bg-muted/20">
              {tabs.map(tab => (
                <div
                  key={tab.id}
                  className={`flex items-center gap-2 px-3 py-2 border-r border-border cursor-pointer transition-colors ${
                    activeTab === tab.id 
                      ? 'bg-background border-b-2 border-b-primary' 
                      : 'hover:bg-secondary/50'
                  }`}
                  onClick={() => setActiveTab(tab.id)}
                >
                  <span className="text-sm truncate max-w-32">{tab.name}</span>
                  {tab.isDirty && <div className="w-2 h-2 rounded-full bg-orange-500" />}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-4 h-4 p-0 hover:bg-destructive/20"
                    onClick={(e) => closeTab(tab.id, e)}
                  >
                    <X className="w-3 h-3" />
                  </Button>
                </div>
              ))}
            </div>
          )}

          {/* Editor */}
          <div className="flex-1 relative">
            {activeTabData ? (
              <div className="h-full flex flex-col">
                {/* Editor Toolbar */}
                <div className="flex items-center justify-between p-2 border-b border-border bg-muted/20">
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="text-xs">
                      {activeTabData.language}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {activeTabData.path}
                    </span>
                  </div>
                  
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => saveFile(activeTabData.id)}
                      disabled={!activeTabData.isDirty}
                    >
                      <Save className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Play className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                {/* Monaco Editor */}
                <div className="flex-1">
                  <Editor
                    height="100%"
                    language={activeTabData.language}
                    value={activeTabData.content}
                    theme="vs-dark"
                    onChange={(value) => {
                      if (value !== undefined) {
                        setTabs(prev => prev.map(tab => 
                          tab.id === activeTabData.id 
                            ? { ...tab, content: value, isDirty: true }
                            : tab
                        ));
                      }
                    }}
                    options={{
                      minimap: { enabled: true },
                      fontSize: 14,
                      wordWrap: 'on',
                      automaticLayout: true,
                      scrollBeyondLastLine: false,
                      smoothScrolling: true,
                      cursorBlinking: 'blink',
                      renderWhitespace: 'selection',
                      bracketPairColorization: { enabled: true }
                    }}
                  />
                </div>
              </div>
            ) : (
              <div className="h-full flex items-center justify-center text-muted-foreground">
                <div className="text-center">
                  <FolderOpen className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p className="text-lg font-medium">Welcome to LexOS IDE</p>
                  <p className="text-sm mt-2">Open a file from the explorer to start coding</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Terminal */}
      {isTerminalVisible && (
        <div className="h-64 border-t border-border flex flex-col bg-background">
          <div className="flex items-center justify-between p-2 border-b border-border bg-muted/30">
            <div className="flex items-center gap-2">
              <Terminal className="w-4 h-4" />
              <span className="text-sm font-medium">Terminal</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsTerminalVisible(false)}
              className="w-6 h-6 p-0"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
          
          <ScrollArea className="flex-1 p-3 font-mono text-sm">
            <div className="space-y-1">
              {terminalOutput.map((line, index) => (
                <div key={index} className={line.startsWith('$') ? 'text-primary' : 'text-foreground'}>
                  {line}
                </div>
              ))}
            </div>
          </ScrollArea>
          
          <div className="p-3 border-t border-border">
            <div className="flex items-center gap-2">
              <span className="text-sm text-primary">$</span>
              <Input
                value={terminalInput}
                onChange={(e) => setTerminalInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && executeTerminalCommand()}
                placeholder="Enter command..."
                className="bg-transparent border-0 p-0 font-mono text-sm focus:ring-0"
              />
            </div>
          </div>
        </div>
      )}

      {/* Show Terminal Button */}
      {!isTerminalVisible && (
        <div className="p-2 border-t border-border">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsTerminalVisible(true)}
            className="w-full justify-start"
          >
            <Terminal className="w-4 h-4 mr-2" />
            Show Terminal
          </Button>
        </div>
      )}
    </div>
  );
};