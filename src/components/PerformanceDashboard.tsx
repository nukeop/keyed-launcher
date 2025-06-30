import { useEffect, useState } from 'react';
import { PerformanceMonitor } from '../utils/performance';
import { isProd } from '../utils/environment';

interface PerformanceStats {
  fps: number;
  memoryUsed: string;
  memoryTotal: string;
}

export const PerformanceDashboard = () => {
  if (isProd()) return null;

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
    <div className="select-none" data-testid="performance-dashboard">
      <div className="font-mono text-xs text-white">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2" data-testid="fps">
            <span className="font-bold text-yellow-400">FPS</span>
            <span
              className={`font-bold ${
                stats.fps >= 55
                  ? 'text-green-400'
                  : stats.fps >= 30
                    ? 'text-yellow-400'
                    : 'text-red-400'
              }`}
            >
              {stats.fps}
            </span>
          </div>

          <div className="flex items-center gap-2" data-testid="ram">
            <span className="font-bold text-blue-400">RAM</span>
            <span className="text-white">{stats.memoryUsed}</span>
            <span className="text-gray-400">/ {stats.memoryTotal}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
