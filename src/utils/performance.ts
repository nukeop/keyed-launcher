interface MemoryInfo {
  usedJSHeapSize: number;
  totalJSHeapSize: number;
  jsHeapSizeLimit: number;
}

export class PerformanceMonitor {
  private static startTime: number | null = null;
  private static frameCount = 0;
  private static lastTime = 0;
  private static fps = 0;
  private static isEnabled = import.meta.env.DEV;

  static startupTimer() {
    if (!this.isEnabled) return;
    this.startTime = performance.now();
  }

  static endStartupTimer(): number {
    if (!this.isEnabled) return 0;
    if (this.startTime === null) {
      console.warn('Startup timer was not started');
      return 0;
    }
    const duration = performance.now() - this.startTime;
    console.log(`Startup time: ${duration.toFixed(2)}ms`);
    this.startTime = null;
    return duration;
  }

  static startFPSMonitoring() {
    if (!this.isEnabled) return;
    const measureFPS = (currentTime: number) => {
      this.frameCount++;

      if (currentTime - this.lastTime >= 1000) {
        this.fps = Math.round(
          (this.frameCount * 1000) / (currentTime - this.lastTime),
        );
        console.log(`FPS: ${this.fps}`);
        this.frameCount = 0;
        this.lastTime = currentTime;
      }

      requestAnimationFrame(measureFPS);
    };

    requestAnimationFrame(measureFPS);
  }

  static getCurrentFPS(): number {
    return this.fps;
  }

  static async getMemoryStats() {
    if (!this.isEnabled) return { used: '0 MB', total: '0 MB' };

    try {
      if ('memory' in performance && (performance as any).memory) {
        const memory = (performance as any).memory;
        const used = memory.usedJSHeapSize || 0;
        const total = memory.totalJSHeapSize || 0;

        return {
          used: `${(used / 1024 / 1024).toFixed(1)} MB`,
          total: `${(total / 1024 / 1024).toFixed(1)} MB`,
        };
      }

      const { invoke } = await import('@tauri-apps/api/core');
      const [usedKb, totalKb] =
        await invoke<[number, number]>('get_memory_usage');

      return {
        used: `${(usedKb / 1024).toFixed(1)} MB`,
        total: `${(totalKb / 1024).toFixed(1)} MB`,
      };
    } catch (error) {
      console.warn('Memory API error:', error);
      return { used: 'Error', total: 'N/A' };
    }
  }

  static logMemoryUsage() {
    if (!this.isEnabled) return;
    if ('memory' in performance) {
      const memory = (performance as Performance & { memory: MemoryInfo })
        .memory;
      console.log({
        used: `${(memory.usedJSHeapSize / 1024 / 1024).toFixed(2)} MB`,
        total: `${(memory.totalJSHeapSize / 1024 / 1024).toFixed(2)} MB`,
        limit: `${(memory.jsHeapSizeLimit / 1024 / 1024).toFixed(2)} MB`,
      });
    }
  }
}
