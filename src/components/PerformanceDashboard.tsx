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
    <div className="fixed top-4 left-4 pointer-events-none select-none z-50">
      <div className="bg-black/75 backdrop-blur-sm text-white font-mono text-sm p-3 rounded border border-white/20 shadow-2xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-yellow-400 font-bold">FPS</span>
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

          <div className="flex items-center gap-2">
            <span className="text-blue-400 font-bold">RAM</span>
            <span className="text-white">{stats.memoryUsed}</span>
            <span className="text-gray-400">/ {stats.memoryTotal}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
