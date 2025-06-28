import { useEffect, useState } from 'react';
import { PerformanceMonitor } from '../utils/performance';

interface PerformanceStats {
  fps: number;
  memoryUsed: string;
  memoryTotal: string;
}

export function PerformanceDashboard() {
  const [stats, setStats] = useState<PerformanceStats>({
    fps: 0,
    memoryUsed: '0 MB',
    memoryTotal: '0 MB',
  });

  useEffect(() => {
    const updateStats = () => {
      const fps = PerformanceMonitor.getCurrentFPS();

      let memoryUsed = '0 MB';
      let memoryTotal = '0 MB';

      if ('memory' in performance) {
        const memory = (performance as any).memory;
        memoryUsed = `${(memory.usedJSHeapSize / 1024 / 1024).toFixed(1)} MB`;
        memoryTotal = `${(memory.totalJSHeapSize / 1024 / 1024).toFixed(1)} MB`;
      }

      setStats({ fps, memoryUsed, memoryTotal });
    };

    const interval = setInterval(updateStats, 1000);
    updateStats();

    return () => clearInterval(interval);
  }, []);

  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <div className="fixed bottom-2 right-2 bg-black/80 text-white text-xs p-2 rounded border border-white/20 space-y-1">
      <div>FPS: {stats.fps}</div>
      <div>
        Memory: {stats.memoryUsed} / {stats.memoryTotal}
      </div>
    </div>
  );
}
