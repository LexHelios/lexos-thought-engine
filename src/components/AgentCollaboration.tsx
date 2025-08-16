import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { supabase } from '@/integrations/supabase/client';
import { 
  Users, 
  MessageSquare, 
  Share2, 
  Brain, 
  Code, 
  Globe, 
  Terminal,
  Zap,
  Link2,
  Activity
} from 'lucide-react';

interface Agent {
  id: string;
  type: 'coder' | 'browser' | 'thinker' | 'researcher';
  status: 'idle' | 'thinking' | 'working' | 'collaborating';
  currentTask: string;
  collaborators: string[];
  sharedContext: any;
}

interface CollaborationEvent {
  id: string;
  timestamp: string;
  type: 'share_context' | 'request_help' | 'task_complete' | 'knowledge_share';
  fromAgent: string;
  toAgent: string;
  content: string;
  data?: any;
}

export const AgentCollaboration = () => {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [collaborationEvents, setCollaborationEvents] = useState<CollaborationEvent[]>([]);
  const [selectedAgents, setSelectedAgents] = useState<string[]>([]);

  useEffect(() => {
    // Initialize with some demo agents
    setAgents([
      {
        id: 'coder-1',
        type: 'coder',
        status: 'working',
        currentTask: 'Building React component',
        collaborators: ['browser-1', 'thinker-1'],
        sharedContext: { language: 'TypeScript', framework: 'React' }
      },
      {
        id: 'browser-1', 
        type: 'browser',
        status: 'collaborating',
        currentTask: 'Testing UI components',
        collaborators: ['coder-1'],
        sharedContext: { url: 'http://localhost:3000', testResults: [] }
      },
      {
        id: 'thinker-1',
        type: 'thinker', 
        status: 'thinking',
        currentTask: 'Analyzing architecture patterns',
        collaborators: ['coder-1', 'researcher-1'],
        sharedContext: { patterns: ['MVC', 'MVVM'], recommendations: [] }
      },
      {
        id: 'researcher-1',
        type: 'researcher',
        status: 'working', 
        currentTask: 'Gathering best practices',
        collaborators: ['thinker-1'],
        sharedContext: { sources: [], findings: [] }
      }
    ]);

    // Simulate collaboration events
    const events: CollaborationEvent[] = [
      {
        id: '1',
        timestamp: new Date(Date.now() - 300000).toISOString(),
        type: 'share_context',
        fromAgent: 'coder-1',
        toAgent: 'browser-1', 
        content: 'Shared component code for testing',
        data: { componentName: 'UserProfile', status: 'ready' }
      },
      {
        id: '2',
        timestamp: new Date(Date.now() - 180000).toISOString(),
        type: 'request_help',
        fromAgent: 'browser-1',
        toAgent: 'thinker-1',
        content: 'Need architectural guidance for responsive design',
        data: { issue: 'mobile_layout', priority: 'high' }
      },
      {
        id: '3', 
        timestamp: new Date(Date.now() - 60000).toISOString(),
        type: 'knowledge_share',
        fromAgent: 'researcher-1',
        toAgent: 'thinker-1',
        content: 'Found optimal CSS Grid patterns for responsive layouts',
        data: { patterns: ['auto-fit', 'minmax'], performance: '95%' }
      }
    ];
    
    setCollaborationEvents(events);
  }, []);

  const getAgentIcon = (type: string) => {
    switch (type) {
      case 'coder': return <Code className="w-4 h-4 text-orange-500" />;
      case 'browser': return <Globe className="w-4 h-4 text-blue-500" />;
      case 'thinker': return <Brain className="w-4 h-4 text-purple-500" />;
      case 'researcher': return <Terminal className="w-4 h-4 text-green-500" />;
      default: return <Activity className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'working': return 'bg-green-500';
      case 'thinking': return 'bg-purple-500';
      case 'collaborating': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'share_context': return <Share2 className="w-3 h-3 text-blue-500" />;
      case 'request_help': return <MessageSquare className="w-3 h-3 text-orange-500" />;
      case 'task_complete': return <Zap className="w-3 h-3 text-green-500" />;
      case 'knowledge_share': return <Brain className="w-3 h-3 text-purple-500" />;
      default: return <Activity className="w-3 h-3 text-gray-500" />;
    }
  };

  const initiateCollaboration = async (agentIds: string[]) => {
    if (agentIds.length < 2) return;

    // Create collaboration session
    const collaborationId = `collab-${Date.now()}`;
    
    try {
      const { error } = await supabase.functions.invoke('agent-manager', {
        body: {
          action: 'create_collaboration',
          collaborationId,
          agentIds,
          objective: 'Cross-agent task coordination'
        }
      });

      if (error) throw error;

      // Update agents to reflect collaboration
      setAgents(prev => prev.map(agent => 
        agentIds.includes(agent.id) 
          ? { ...agent, status: 'collaborating' as const, collaborators: agentIds.filter(id => id !== agent.id) }
          : agent
      ));

      // Add collaboration event
      const newEvent: CollaborationEvent = {
        id: Date.now().toString(),
        timestamp: new Date().toISOString(),
        type: 'share_context',
        fromAgent: agentIds[0],
        toAgent: agentIds[1],
        content: `Initiated collaboration between ${agentIds.length} agents`
      };

      setCollaborationEvents(prev => [newEvent, ...prev]);
      setSelectedAgents([]);

    } catch (error) {
      console.error('Failed to initiate collaboration:', error);
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div className="flex items-center gap-2">
          <Users className="w-5 h-5 text-primary" />
          <h3 className="font-semibold">Agent Collaboration</h3>
          <Badge variant="outline">{agents.length} Active Agents</Badge>
        </div>
        
        {selectedAgents.length >= 2 && (
          <Button 
            onClick={() => initiateCollaboration(selectedAgents)}
            size="sm" 
            className="bg-gradient-neural text-white hover:opacity-80"
          >
            <Link2 className="w-4 h-4 mr-2" />
            Start Collaboration
          </Button>
        )}
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Active Agents */}
        <div className="w-80 border-r border-border flex flex-col">
          <div className="p-3 border-b border-border">
            <h4 className="font-medium text-sm">Active Agents</h4>
          </div>
          
          <ScrollArea className="flex-1">
            <div className="p-3 space-y-2">
              {agents.map((agent) => (
                <Card 
                  key={agent.id}
                  className={`p-3 cursor-pointer transition-all duration-200 ${
                    selectedAgents.includes(agent.id) 
                      ? 'ring-2 ring-primary bg-primary/10' 
                      : 'hover:bg-secondary/50'
                  }`}
                  onClick={() => {
                    setSelectedAgents(prev => 
                      prev.includes(agent.id)
                        ? prev.filter(id => id !== agent.id)
                        : [...prev, agent.id]
                    );
                  }}
                >
                  <div className="flex items-center gap-2 mb-2">
                    {getAgentIcon(agent.type)}
                    <span className="font-medium text-sm capitalize">{agent.type}</span>
                    <div className={`w-2 h-2 rounded-full ${getStatusColor(agent.status)}`} />
                  </div>
                  
                  <div className="text-xs text-muted-foreground mb-1">
                    {agent.currentTask}
                  </div>
                  
                  {agent.collaborators.length > 0 && (
                    <div className="flex items-center gap-1 text-xs">
                      <Users className="w-3 h-3" />
                      <span>{agent.collaborators.length} collaborators</span>
                    </div>
                  )}
                </Card>
              ))}
            </div>
          </ScrollArea>
        </div>

        {/* Collaboration Events */}
        <div className="flex-1 flex flex-col">
          <div className="p-3 border-b border-border">
            <h4 className="font-medium text-sm">Collaboration Activity</h4>
          </div>
          
          <ScrollArea className="flex-1">
            <div className="p-3 space-y-3">
              {collaborationEvents.length > 0 ? (
                collaborationEvents.map((event) => (
                  <div key={event.id} className="flex gap-3 p-3 rounded-lg bg-muted/30">
                    <div className="mt-1">
                      {getEventIcon(event.type)}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-medium text-primary">
                          {event.fromAgent}
                        </span>
                        <span className="text-xs text-muted-foreground">→</span>
                        <span className="text-xs font-medium text-primary">
                          {event.toAgent}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {new Date(event.timestamp).toLocaleTimeString()}
                        </span>
                      </div>
                      
                      <div className="text-sm text-foreground mb-1">
                        {event.content}
                      </div>
                      
                      {event.data && (
                        <div className="text-xs text-muted-foreground font-mono bg-muted/50 p-2 rounded">
                          {JSON.stringify(event.data, null, 2)}
                        </div>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Users className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p>No collaboration activity yet</p>
                  <p className="text-xs mt-1">Select agents to start collaboration</p>
                </div>
              )}
            </div>
          </ScrollArea>
        </div>
      </div>
    </div>
  );
};