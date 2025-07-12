import { useLauncherStore } from '../stores/launcher';
import { usePerformanceTracking } from '../utils/usePerformanceTracking';
import { useEffect } from 'react';

export const userPerformanceMonitoringStartup = () => {
  const { showWindow } = useLauncherStore();
  const { trackStartup, trackWindowShow, startMonitoring } =
    usePerformanceTracking();
  useEffect(() => {
    const startup = trackStartup();
    showWindow();
    startup.end();

    startMonitoring();

    const handleFocus = () => {
      trackWindowShow(showWindow);
    };

    window.addEventListener('focus', handleFocus);
    return () => {
      window.removeEventListener('focus', handleFocus);
    };
  }, [showWindow]);
};
