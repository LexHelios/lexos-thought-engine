import { useState, useEffect, useCallback } from 'react';

interface UsePerformanceOptions {
  measureNavigationTiming?: boolean;
  measureResourceTiming?: boolean;
  reportThreshold?: number;
}

interface PerformanceMetrics {
  navigationTiming?: PerformanceTiming;
  resourceTiming?: PerformanceResourceTiming[];
  memoryUsage?: any;
  fps?: number;
  longTasks?: number;
}

export const usePerformance = (options: UsePerformanceOptions = {}) => {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({});
  const [isMonitoring, setIsMonitoring] = useState(false);

  const measureNavigationTiming = useCallback(() => {
    if (!options.measureNavigationTiming) return;

    const navigation = performance.timing;
    setMetrics(prev => ({ ...prev, navigationTiming: navigation }));
  }, [options.measureNavigationTiming]);

  const measureResourceTiming = useCallback(() => {
    if (!options.measureResourceTiming) return;

    const resources = performance.getEntriesByType('resource') as PerformanceResourceTiming[];
    setMetrics(prev => ({ ...prev, resourceTiming: resources }));
  }, [options.measureResourceTiming]);

  const measureMemoryUsage = useCallback(() => {
    if ('memory' in performance) {
      const memory = (performance as any).memory;
      setMetrics(prev => ({ ...prev, memoryUsage: memory }));
    }
  }, []);

  const measureFPS = useCallback(() => {
    let frames = 0;
    let startTime = performance.now();

    const countFrame = () => {
      frames++;
      const currentTime = performance.now();
      
      if (currentTime >= startTime + 1000) {
        const fps = Math.round((frames * 1000) / (currentTime - startTime));
        setMetrics(prev => ({ ...prev, fps }));
        
        frames = 0;
        startTime = currentTime;
      }
      
      if (isMonitoring) {
        requestAnimationFrame(countFrame);
      }
    };

    if (isMonitoring) {
      requestAnimationFrame(countFrame);
    }
  }, [isMonitoring]);

  const measureLongTasks = useCallback(() => {
    if ('PerformanceObserver' in window) {
      try {
        const observer = new PerformanceObserver((list) => {
          const longTasks = list.getEntries().length;
          setMetrics(prev => ({ ...prev, longTasks: (prev.longTasks || 0) + longTasks }));
        });
        
        observer.observe({ entryTypes: ['longtask'] });
        
        return () => observer.disconnect();
      } catch (error) {
        console.warn('PerformanceObserver not supported for longtask');
      }
    }
  }, []);

  const startMonitoring = useCallback(() => {
    setIsMonitoring(true);
  }, []);

  const stopMonitoring = useCallback(() => {
    setIsMonitoring(false);
  }, []);

  const reportMetrics = useCallback(async () => {
    if (Object.keys(metrics).length === 0) return;

    try {
      const { supabase } = await import('@/integrations/supabase/client');
      
      await supabase.from('application_logs').insert({
        level: 'info',
        message: 'Performance metrics report',
        metadata: JSON.parse(JSON.stringify({
          ...metrics,
          timestamp: new Date().toISOString(),
          userAgent: navigator.userAgent,
          url: window.location.href,
        })),
        source: 'PerformanceMonitor'
      });
    } catch (error) {
      console.error('Failed to report performance metrics:', error);
    }
  }, [metrics]);

  useEffect(() => {
    measureNavigationTiming();
    measureResourceTiming();
    measureMemoryUsage();
    
    const longTaskCleanup = measureLongTasks();
    
    return () => {
      if (longTaskCleanup) longTaskCleanup();
    };
  }, [measureNavigationTiming, measureResourceTiming, measureMemoryUsage, measureLongTasks]);

  useEffect(() => {
    measureFPS();
  }, [measureFPS]);

  // Auto-report metrics when threshold is reached
  useEffect(() => {
    const threshold = options.reportThreshold || 60000; // 1 minute default
    
    const interval = setInterval(() => {
      if (isMonitoring) {
        reportMetrics();
      }
    }, threshold);

    return () => clearInterval(interval);
  }, [reportMetrics, isMonitoring, options.reportThreshold]);

  return {
    metrics,
    isMonitoring,
    startMonitoring,
    stopMonitoring,
    reportMetrics,
  };
};