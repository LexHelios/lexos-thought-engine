import { useState, useEffect } from 'react';

interface NetworkInfo {
  effectiveType?: string;
  downlink?: number;
  rtt?: number;
  saveData?: boolean;
}

interface DeviceInfo {
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  deviceMemory?: number;
  hardwareConcurrency?: number;
  cookieEnabled: boolean;
  language: string;
  languages: readonly string[];
  platform: string;
  userAgent: string;
  touchSupported: boolean;
  screenResolution: string;
  colorDepth: number;
  pixelRatio: number;
  timezone: string;
}

interface BatteryInfo {
  charging?: boolean;
  level?: number;
  chargingTime?: number;
  dischargingTime?: number;
}

interface SystemInfo {
  network: NetworkInfo;
  device: DeviceInfo;
  battery: BatteryInfo;
}

export const useSystemInfo = () => {
  const [systemInfo, setSystemInfo] = useState<SystemInfo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getSystemInfo = async () => {
      try {
        // Network information
        const connection = (navigator as any).connection || 
                          (navigator as any).mozConnection || 
                          (navigator as any).webkitConnection;
        
        const networkInfo: NetworkInfo = {
          effectiveType: connection?.effectiveType,
          downlink: connection?.downlink,
          rtt: connection?.rtt,
          saveData: connection?.saveData,
        };

        // Device information
        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        const isTablet = /iPad|Android(?!.*Mobile)|Tablet/i.test(navigator.userAgent);
        const isDesktop = !isMobile && !isTablet;

        const deviceInfo: DeviceInfo = {
          isMobile,
          isTablet,
          isDesktop,
          deviceMemory: (navigator as any).deviceMemory,
          hardwareConcurrency: navigator.hardwareConcurrency,
          cookieEnabled: navigator.cookieEnabled,
          language: navigator.language,
          languages: navigator.languages,
          platform: navigator.platform,
          userAgent: navigator.userAgent,
          touchSupported: 'ontouchstart' in window || navigator.maxTouchPoints > 0,
          screenResolution: `${screen.width}x${screen.height}`,
          colorDepth: screen.colorDepth,
          pixelRatio: window.devicePixelRatio,
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        };

        // Battery information
        let batteryInfo: BatteryInfo = {};
        if ('getBattery' in navigator) {
          try {
            const battery = await (navigator as any).getBattery();
            batteryInfo = {
              charging: battery.charging,
              level: battery.level,
              chargingTime: battery.chargingTime,
              dischargingTime: battery.dischargingTime,
            };
          } catch (error) {
            console.warn('Battery API not available');
          }
        }

        setSystemInfo({
          network: networkInfo,
          device: deviceInfo,
          battery: batteryInfo,
        });
      } catch (error) {
        console.error('Failed to get system info:', error);
      } finally {
        setLoading(false);
      }
    };

    getSystemInfo();

    // Listen for network changes
    const connection = (navigator as any).connection;
    if (connection) {
      const handleNetworkChange = () => {
        setSystemInfo(prev => prev ? {
          ...prev,
          network: {
            effectiveType: connection.effectiveType,
            downlink: connection.downlink,
            rtt: connection.rtt,
            saveData: connection.saveData,
          }
        } : null);
      };

      connection.addEventListener('change', handleNetworkChange);
      return () => connection.removeEventListener('change', handleNetworkChange);
    }
  }, []);

  const logSystemInfo = async () => {
    if (!systemInfo) return;

    try {
      const { supabase } = await import('@/integrations/supabase/client');
      
      await supabase.from('application_logs').insert({
        level: 'info',
        message: 'System information collected',
        metadata: JSON.parse(JSON.stringify({
          ...systemInfo,
          timestamp: new Date().toISOString(),
        })),
        source: 'SystemInfo'
      });
    } catch (error) {
      console.error('Failed to log system info:', error);
    }
  };

  return {
    systemInfo,
    loading,
    logSystemInfo,
  };
};