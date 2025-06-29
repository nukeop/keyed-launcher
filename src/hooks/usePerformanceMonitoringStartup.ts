import { useEffect } from 'react';
import { useLauncherStore } from '../stores/launcher';
import { usePerformanceTracking } from '../utils/usePerformanceTracking';

export const userPerformanceMonitoringStartup = () => {
  const { showWindow } = useLauncherStore();
  const { trackStartup, trackWindowShow, startMonitoring } =
    usePerformanceTracking();
  useEffect(() => {
    const startup = trackStartup();
    showWindow();
    startup.end();

    const memoryInterval = startMonitoring();

    const handleFocus = () => {
      trackWindowShow(showWindow);
    };

    window.addEventListener('focus', handleFocus);
    return () => {
      window.removeEventListener('focus', handleFocus);
      if (memoryInterval) {
        clearInterval(memoryInterval);
      }
    };
  }, [showWindow]);
};
