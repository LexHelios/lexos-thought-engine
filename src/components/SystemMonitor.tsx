import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Activity, 
  Cpu, 
  HardDrive, 
  Zap, 
  Wifi, 
  AlertTriangle,
  CheckCircle,
  XCircle,
  TrendingUp,
  Database,
  Globe,
  Brain
} from 'lucide-react';

interface SystemMetrics {
  cpu: number;
  memory: number;
  storage: number;
  network: number;
  aiProcessing: number;
  agentLoad: number;
}

interface SystemAlert {
  id: string;
  type: 'info' | 'warning' | 'error' | 'success';
  message: string;
  timestamp: Date;
  component: string;
}

export const SystemMonitor = () => {
  const [metrics, setMetrics] = useState<SystemMetrics>({
    cpu: 45,
    memory: 67,
    storage: 23,
    network: 89,
    aiProcessing: 72,
    agentLoad: 34
  });

  const [alerts, setAlerts] = useState<SystemAlert[]>([
    {
      id: '1',
      type: 'success',
      message: 'All agents operating normally',
      timestamp: new Date(Date.now() - 120000),
      component: 'Agent Manager'
    },
    {
      id: '2', 
      type: 'warning',
      message: 'High AI processing load detected',
      timestamp: new Date(Date.now() - 300000),
      component: 'AI Core'
    },
    {
      id: '3',
      type: 'info',
      message: 'System auto-optimization completed',
      timestamp: new Date(Date.now() - 600000),
      component: 'System'
    }
  ]);

  const [uptime, setUptime] = useState(0);

  // Simulate real-time metrics updates
  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics(prev => ({
        cpu: Math.max(10, Math.min(90, prev.cpu + (Math.random() - 0.5) * 10)),
        memory: Math.max(20, Math.min(85, prev.memory + (Math.random() - 0.5) * 8)),
        storage: Math.max(15, Math.min(95, prev.storage + (Math.random() - 0.5) * 5)),
        network: Math.max(30, Math.min(100, prev.network + (Math.random() - 0.5) * 15)),
        aiProcessing: Math.max(5, Math.min(95, prev.aiProcessing + (Math.random() - 0.5) * 12)),
        agentLoad: Math.max(0, Math.min(80, prev.agentLoad + (Math.random() - 0.5) * 8))
      }));
      
      setUptime(prev => prev + 5);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const getMetricColor = (value: number) => {
    if (value < 30) return 'text-green-500';
    if (value < 70) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getProgressColor = (value: number) => {
    if (value < 30) return 'bg-green-500';
    if (value < 70) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getAlertIcon = (type: SystemAlert['type']) => {
    switch (type) {
      case 'success': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'warning': return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      case 'error': return <XCircle className="w-4 h-4 text-red-500" />;
      default: return <Activity className="w-4 h-4 text-blue-500" />;
    }
  };

  const formatUptime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const optimizeSystem = () => {
    // Simulate system optimization
    setMetrics(prev => ({
      ...prev,
      cpu: Math.max(10, prev.cpu * 0.7),
      memory: Math.max(20, prev.memory * 0.8),
      aiProcessing: Math.max(5, prev.aiProcessing * 0.6)
    }));

    setAlerts(prev => [{
      id: Date.now().toString(),
      type: 'success',
      message: 'System optimization completed successfully',
      timestamp: new Date(),
      component: 'System Optimizer'
    }, ...prev.slice(0, 9)]);
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div className="flex items-center gap-2">
          <Activity className="w-5 h-5 text-primary" />
          <h3 className="font-semibold">System Monitor</h3>
          <Badge variant="outline" className="text-green-500 border-green-500">
            Online
          </Badge>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="text-right text-xs">
            <div className="text-muted-foreground">Uptime</div>
            <div className="font-mono font-semibold">{formatUptime(uptime)}</div>
          </div>
          
          <Button 
            onClick={optimizeSystem}
            size="sm" 
            className="bg-gradient-neural text-white hover:opacity-80"
          >
            <TrendingUp className="w-4 h-4 mr-2" />
            Optimize
          </Button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Metrics Panel */}
        <div className="w-80 border-r border-border flex flex-col">
          <div className="p-3 border-b border-border">
            <h4 className="font-medium text-sm">System Metrics</h4>
          </div>
          
          <ScrollArea className="flex-1">
            <div className="p-4 space-y-4">
              {/* CPU */}
              <Card className="p-3">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Cpu className="w-4 h-4 text-primary" />
                    <span className="text-sm font-medium">CPU</span>
                  </div>
                  <span className={`text-sm font-bold ${getMetricColor(metrics.cpu)}`}>
                    {metrics.cpu.toFixed(1)}%
                  </span>
                </div>
                <Progress value={metrics.cpu} className="h-2" />
              </Card>

              {/* Memory */}
              <Card className="p-3">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Database className="w-4 h-4 text-primary" />
                    <span className="text-sm font-medium">Memory</span>
                  </div>
                  <span className={`text-sm font-bold ${getMetricColor(metrics.memory)}`}>
                    {metrics.memory.toFixed(1)}%
                  </span>
                </div>
                <Progress value={metrics.memory} className="h-2" />
              </Card>

              {/* Storage */}
              <Card className="p-3">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <HardDrive className="w-4 h-4 text-primary" />
                    <span className="text-sm font-medium">Storage</span>
                  </div>
                  <span className={`text-sm font-bold ${getMetricColor(metrics.storage)}`}>
                    {metrics.storage.toFixed(1)}%
                  </span>
                </div>
                <Progress value={metrics.storage} className="h-2" />
              </Card>

              {/* Network */}
              <Card className="p-3">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Wifi className="w-4 h-4 text-primary" />
                    <span className="text-sm font-medium">Network</span>
                  </div>
                  <span className={`text-sm font-bold ${getMetricColor(100 - metrics.network)}`}>
                    {metrics.network.toFixed(1)}%
                  </span>
                </div>
                <Progress value={metrics.network} className="h-2" />
              </Card>

              {/* AI Processing */}
              <Card className="p-3">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Brain className="w-4 h-4 text-primary" />
                    <span className="text-sm font-medium">AI Processing</span>
                  </div>
                  <span className={`text-sm font-bold ${getMetricColor(metrics.aiProcessing)}`}>
                    {metrics.aiProcessing.toFixed(1)}%
                  </span>
                </div>
                <Progress value={metrics.aiProcessing} className="h-2" />
              </Card>

              {/* Agent Load */}
              <Card className="p-3">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-primary" />
                    <span className="text-sm font-medium">Agent Load</span>
                  </div>
                  <span className={`text-sm font-bold ${getMetricColor(metrics.agentLoad)}`}>
                    {metrics.agentLoad.toFixed(1)}%
                  </span>
                </div>
                <Progress value={metrics.agentLoad} className="h-2" />
              </Card>
            </div>
          </ScrollArea>
        </div>

        {/* Alerts & Events */}
        <div className="flex-1 flex flex-col">
          <div className="p-3 border-b border-border">
            <h4 className="font-medium text-sm">System Alerts & Events</h4>
          </div>
          
          <ScrollArea className="flex-1">
            <div className="p-4 space-y-3">
              {alerts.length > 0 ? (
                alerts.map((alert) => (
                  <Card key={alert.id} className="p-3">
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5">
                        {getAlertIcon(alert.type)}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm font-medium text-foreground">
                            {alert.component}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {alert.timestamp.toLocaleTimeString()}
                          </span>
                        </div>
                        
                        <div className="text-sm text-muted-foreground">
                          {alert.message}
                        </div>
                      </div>
                    </div>
                  </Card>
                ))
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Activity className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p>No system alerts</p>
                  <p className="text-xs mt-1">All systems operating normally</p>
                </div>
              )}
            </div>
          </ScrollArea>
        </div>
      </div>
    </div>
  );
};