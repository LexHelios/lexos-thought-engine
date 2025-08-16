import { useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

type LogLevel = 'info' | 'warn' | 'error' | 'debug';

interface LogEntry {
  level: LogLevel;
  message: string;
  metadata?: Record<string, any>;
  source?: string;
}

export const useLogger = () => {
  const log = useCallback(async ({ level, message, metadata = {}, source }: LogEntry) => {
    try {
      // Add client-side context
      const enrichedMetadata = {
        ...metadata,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        url: window.location.href,
        viewport: {
          width: window.innerWidth,
          height: window.innerHeight
        }
      };

      await supabase.from('application_logs').insert({
        level,
        message,
        metadata: enrichedMetadata,
        source: source || 'Client'
      });

      // Also log to console in development
      if (process.env.NODE_ENV === 'development') {
        const consoleMethod = level === 'error' ? 'error' : 
                             level === 'warn' ? 'warn' : 'log';
        console[consoleMethod](`[${level.toUpperCase()}] ${message}`, enrichedMetadata);
      }
    } catch (error) {
      console.error('Failed to log message:', error);
    }
  }, []);

  const info = useCallback((message: string, metadata?: Record<string, any>, source?: string) => {
    return log({ level: 'info', message, metadata, source });
  }, [log]);

  const warn = useCallback((message: string, metadata?: Record<string, any>, source?: string) => {
    return log({ level: 'warn', message, metadata, source });
  }, [log]);

  const error = useCallback((message: string, metadata?: Record<string, any>, source?: string) => {
    return log({ level: 'error', message, metadata, source });
  }, [log]);

  const debug = useCallback((message: string, metadata?: Record<string, any>, source?: string) => {
    return log({ level: 'debug', message, metadata, source });
  }, [log]);

  return { log, info, warn, error, debug };
};