import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Send, Terminal, Minimize2, Maximize2, X } from 'lucide-react';

interface Message {
  id: string;
  content: string;
  type: 'user' | 'ai' | 'system';
  timestamp: Date;
}

export const AITerminal = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: 'LexOS AI Terminal initialized. How can I assist you today?',
      type: 'system',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isMinimized, setIsMinimized] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      type: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: `Processing your request: "${input}". This is a simulated AI response in the LexOS environment.`,
        type: 'ai',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiResponse]);
    }, 1000);

    setInput('');
  };

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  if (isMinimized) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <Button
          onClick={() => setIsMinimized(false)}
          className="glass neural-glow bg-gradient-neural text-white hover:bg-opacity-80"
        >
          <Terminal className="w-4 h-4 mr-2" />
          AI Terminal
        </Button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 w-96 h-80 glass neural-glow rounded-lg border border-border z-40 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b border-border bg-gradient-neural text-white rounded-t-lg">
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4" />
          <span className="text-sm font-medium">LexOS AI Terminal</span>
        </div>
        <div className="flex gap-1">
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setIsMinimized(true)}
            className="h-6 w-6 p-0 hover:bg-white/20"
          >
            <Minimize2 className="w-3 h-3" />
          </Button>
        </div>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-3" ref={scrollRef}>
        <div className="space-y-3">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-lg p-2 text-sm ${
                  message.type === 'user'
                    ? 'bg-primary text-primary-foreground'
                    : message.type === 'ai'
                    ? 'bg-accent/20 text-accent-foreground border border-accent/30'
                    : 'bg-muted text-muted-foreground border border-border'
                }`}
              >
                {message.content}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>

      {/* Input */}
      <div className="p-3 border-t border-border">
        <div className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask LexOS AI..."
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            className="bg-background/50 border-border"
          />
          <Button onClick={handleSend} size="sm" className="bg-gradient-neural text-white hover:opacity-80">
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};