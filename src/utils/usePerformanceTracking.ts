import { PerformanceMonitor } from './performance';

export const usePerformanceTracking = () => {
  const trackStartup = () => {
    if (!import.meta.env.DEV) return { end: () => {} };

    PerformanceMonitor.startupTimer();
    return {
      end: () => {
        setTimeout(() => {
          PerformanceMonitor.endStartupTimer();
        }, 0);
      },
    };
  };

  const trackWindowShow = (showFn: () => void) => {
    if (!import.meta.env.DEV) {
      showFn();
      return;
    }

    const start = performance.now();
    showFn();
    setTimeout(() => {
      const time = performance.now() - start;
      console.log(`Window show time: ${time.toFixed(2)}ms`);
    }, 0);
  };

  const trackWindowHide = async (hideFn: () => Promise<void>) => {
    if (!import.meta.env.DEV) {
      await hideFn();
      return;
    }

    const start = performance.now();
    await hideFn();
    const time = performance.now() - start;
    console.log(`Window hide time: ${time.toFixed(2)}ms`);
  };

  const startMonitoring = () => {
    if (!import.meta.env.DEV) return null;

    PerformanceMonitor.startFPSMonitoring();

    const memoryInterval = setInterval(() => {
      PerformanceMonitor.logMemoryUsage();
    }, 30000);

    return memoryInterval;
  };

  return {
    trackStartup,
    trackWindowShow,
    trackWindowHide,
    startMonitoring,
  };
};
