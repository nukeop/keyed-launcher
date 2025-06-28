import { useEffect, useState } from 'react';
import { PerformanceMonitor } from '../utils/performance';

interface PerformanceStats {
  fps: number;
  memoryUsed: string;
  memoryTotal: string;
}

export function PerformanceDashboard() {
  if (!import.meta.env.DEV) return null;

  const [stats, setStats] = useState<PerformanceStats>({
    fps: 0,
    memoryUsed: '0 MB',
    memoryTotal: '0 MB',
  });

  useEffect(() => {
    const updateStats = async () => {
      const fps = PerformanceMonitor.getCurrentFPS();
      const memory = await PerformanceMonitor.getMemoryStats();

      setStats({
        fps,
        memoryUsed: memory.used,
        memoryTotal: memory.total,
      });
    };

    const interval = setInterval(updateStats, 1000);
    updateStats();

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed bottom-2 right-2 bg-black/80 text-white text-xs p-2 rounded border border-white/20 space-y-1">
      <div>FPS: {stats.fps}</div>
      <div>
        Memory: {stats.memoryUsed} / {stats.memoryTotal}
      </div>
    </div>
  );
}
