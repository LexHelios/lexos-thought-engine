import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface AgentConfig {
  id: string;
  type: 'coder' | 'browser' | 'thinker' | 'researcher';
  status: 'idle' | 'thinking' | 'working' | 'browsing' | 'coding';
  currentTask: string;
  capabilities: string[];
}

interface AgentUpdate {
  type: 'state_change' | 'thought' | 'browser_update' | 'code_update' | 'action';
  data: any;
}

// In-memory store for active agents (in production, use a proper database)
const activeAgents = new Map<string, AgentConfig>();
const agentConnections = new Map<string, WebSocket[]>();

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { action, agentId, agentType, task } = await req.json();

    console.log(`Agent Manager - Action: ${action}, Agent: ${agentId}, Type: ${agentType}`);

    switch (action) {
      case 'initialize':
        return await initializeAgent(agentId, agentType);
      
      case 'start':
        return await startAgent(agentId, task);
      
      case 'pause':
        return await pauseAgent(agentId);
      
      case 'reset':
        return await resetAgent(agentId);
      
      case 'get_status':
        return await getAgentStatus(agentId);
      
      default:
        return new Response(
          JSON.stringify({ error: 'Unknown action' }), 
          { 
            status: 400, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        );
    }
  } catch (error) {
    console.error('Agent Manager Error:', error);
    return new Response(
      JSON.stringify({ error: error.message }), 
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});

async function initializeAgent(agentId: string, agentType: string) {
  const capabilities = getAgentCapabilities(agentType);
  
  const agent: AgentConfig = {
    id: agentId,
    type: agentType as any,
    status: 'idle',
    currentTask: '',
    capabilities
  };

  activeAgents.set(agentId, agent);
  
  console.log(`Initialized ${agentType} agent with ID: ${agentId}`);
  
  return new Response(
    JSON.stringify({ 
      success: true, 
      agent: agent,
      message: `${agentType} agent initialized successfully`
    }), 
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
}

async function startAgent(agentId: string, task: string) {
  const agent = activeAgents.get(agentId);
  if (!agent) {
    throw new Error('Agent not found');
  }

  agent.status = 'thinking';
  agent.currentTask = task;
  activeAgents.set(agentId, agent);

  // Simulate agent starting to work
  setTimeout(() => simulateAgentActivity(agentId), 1000);
  
  console.log(`Started agent ${agentId} with task: ${task}`);
  
  return new Response(
    JSON.stringify({ 
      success: true, 
      message: `Agent ${agentId} started with task: ${task}`
    }), 
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
}

async function pauseAgent(agentId: string) {
  const agent = activeAgents.get(agentId);
  if (!agent) {
    throw new Error('Agent not found');
  }

  agent.status = 'idle';
  activeAgents.set(agentId, agent);

  console.log(`Paused agent ${agentId}`);
  
  return new Response(
    JSON.stringify({ 
      success: true, 
      message: `Agent ${agentId} paused`
    }), 
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
}

async function resetAgent(agentId: string) {
  const agent = activeAgents.get(agentId);
  if (!agent) {
    throw new Error('Agent not found');
  }

  agent.status = 'idle';
  agent.currentTask = '';
  activeAgents.set(agentId, agent);

  console.log(`Reset agent ${agentId}`);
  
  return new Response(
    JSON.stringify({ 
      success: true, 
      message: `Agent ${agentId} reset successfully`
    }), 
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
}

async function getAgentStatus(agentId: string) {
  const agent = activeAgents.get(agentId);
  if (!agent) {
    throw new Error('Agent not found');
  }

  return new Response(
    JSON.stringify({ 
      success: true, 
      agent: agent
    }), 
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
}

function getAgentCapabilities(agentType: string): string[] {
  switch (agentType) {
    case 'coder':
      return ['code_analysis', 'file_editing', 'git_operations', 'testing', 'debugging'];
    case 'browser':
      return ['web_navigation', 'form_filling', 'screenshot_capture', 'data_extraction'];
    case 'thinker':
      return ['problem_solving', 'planning', 'reasoning', 'decision_making'];
    case 'researcher':
      return ['web_search', 'data_analysis', 'report_generation', 'fact_checking'];
    default:
      return ['basic_operations'];
  }
}

// Simulate agent activity (replace with real agent integration)
async function simulateAgentActivity(agentId: string) {
  const agent = activeAgents.get(agentId);
  if (!agent || agent.status === 'idle') return;

  const activities = generateActivitySequence(agent.type);
  
  for (const activity of activities) {
    await new Promise(resolve => setTimeout(resolve, activity.delay));
    
    if (agent.status === 'idle') break; // Agent was paused
    
    // Update agent status
    agent.status = activity.status;
    activeAgents.set(agentId, agent);
    
    // Broadcast update to connected clients
    broadcastAgentUpdate(agentId, {
      type: activity.updateType,
      data: activity.data
    });
  }
}

function generateActivitySequence(agentType: string) {
  switch (agentType) {
    case 'coder':
      return [
        {
          delay: 2000,
          status: 'thinking' as const,
          updateType: 'thought' as const,
          data: { content: 'Analyzing the current codebase structure...' }
        },
        {
          delay: 3000,
          status: 'coding' as const,
          updateType: 'code_update' as const,
          data: { 
            files: [
              { name: 'main.py', content: 'def hello_world():\n    print("Hello from AI agent!")' }
            ],
            fileName: 'main.py'
          }
        },
        {
          delay: 2000,
          status: 'thinking' as const,
          updateType: 'thought' as const,
          data: { content: 'Testing the implementation...' }
        }
      ];
    
    case 'browser':
      return [
        {
          delay: 1500,
          status: 'browsing' as const,
          updateType: 'browser_update' as const,
          data: { 
            url: 'https://example.com',
            screenshot: '/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k='
          }
        },
        {
          delay: 3000,
          status: 'thinking' as const,
          updateType: 'thought' as const,
          data: { content: 'Analyzing page content for relevant information...' }
        }
      ];
    
    default:
      return [
        {
          delay: 2000,
          status: 'thinking' as const,
          updateType: 'thought' as const,
          data: { content: `Starting ${agentType} operations...` }
        }
      ];
  }
}

function broadcastAgentUpdate(agentId: string, update: AgentUpdate) {
  const connections = agentConnections.get(agentId) || [];
  const message = JSON.stringify(update);
  
  connections.forEach(ws => {
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(message);
    }
  });
  
  console.log(`Broadcasted ${update.type} update to ${connections.length} clients for agent ${agentId}`);
}