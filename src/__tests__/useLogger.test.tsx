import { describe, it, expect, vi } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useLogger } from '@/hooks/useLogger';

// Mock Supabase
const mockInsert = vi.fn(() => Promise.resolve());
vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    from: vi.fn(() => ({
      insert: mockInsert,
    })),
  },
}));

// Mock console methods
const originalConsole = global.console;
const mockConsole = {
  log: vi.fn(),
  warn: vi.fn(),
  error: vi.fn(),
};

describe('useLogger', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    global.console = { ...originalConsole, ...mockConsole };
  });

  afterEach(() => {
    global.console = originalConsole;
  });

  it('logs info messages correctly', async () => {
    const { result } = renderHook(() => useLogger());

    await result.current.info('Test info message', { userId: '123' }, 'TestComponent');

    await waitFor(() => {
      expect(mockInsert).toHaveBeenCalledWith({
        level: 'info',
        message: 'Test info message',
        metadata: expect.objectContaining({
          userId: '123',
          timestamp: expect.any(String),
          userAgent: expect.any(String),
          url: expect.any(String),
          viewport: expect.objectContaining({
            width: expect.any(Number),
            height: expect.any(Number),
          }),
        }),
        source: 'TestComponent',
      });
    });
  });

  it('logs error messages correctly', async () => {
    const { result } = renderHook(() => useLogger());

    await result.current.error('Test error message', { errorCode: 500 });

    await waitFor(() => {
      expect(mockInsert).toHaveBeenCalledWith({
        level: 'error',
        message: 'Test error message',
        metadata: expect.objectContaining({
          errorCode: 500,
          timestamp: expect.any(String),
        }),
        source: 'Client',
      });
    });
  });

  it('logs to console in development mode', async () => {
    const originalEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'development';

    const { result } = renderHook(() => useLogger());

    await result.current.warn('Test warning');

    await waitFor(() => {
      expect(mockConsole.warn).toHaveBeenCalledWith(
        '[WARN] Test warning',
        expect.any(Object)
      );
    });

    process.env.NODE_ENV = originalEnv;
  });

  it('handles logging errors gracefully', async () => {
    mockInsert.mockRejectedValueOnce(new Error('Database error'));
    const { result } = renderHook(() => useLogger());

    await result.current.debug('Test debug message');

    // Should not throw and should log error to console
    expect(mockConsole.error).toHaveBeenCalledWith(
      'Failed to log message:',
      expect.any(Error)
    );
  });
});