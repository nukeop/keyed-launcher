export class PerformanceMonitor {
  private static startTime: number | null = null
  private static frameCount = 0
  private static lastTime = 0
  private static fps = 0

  static startupTimer() {
    this.startTime = performance.now()
  }

  static endStartupTimer(): number {
    if (this.startTime === null) {
      console.warn('Startup timer was not started')
      return 0
    }
    const duration = performance.now() - this.startTime
    console.log(`Startup time: ${duration.toFixed(2)}ms`)
    this.startTime = null
    return duration
  }

  static startFPSMonitoring() {
    const measureFPS = (currentTime: number) => {
      this.frameCount++
      
      if (currentTime - this.lastTime >= 1000) {
        this.fps = Math.round((this.frameCount * 1000) / (currentTime - this.lastTime))
        console.log(`FPS: ${this.fps}`)
        this.frameCount = 0
        this.lastTime = currentTime
      }
      
      requestAnimationFrame(measureFPS)
    }
    
    requestAnimationFrame(measureFPS)
  }

  static getCurrentFPS(): number {
    return this.fps
  }

  static logMemoryUsage() {
    if ('memory' in performance) {
      const memory = (performance as any).memory
      console.log({
        used: `${(memory.usedJSHeapSize / 1024 / 1024).toFixed(2)} MB`,
        total: `${(memory.totalJSHeapSize / 1024 / 1024).toFixed(2)} MB`,
        limit: `${(memory.jsHeapSizeLimit / 1024 / 1024).toFixed(2)} MB`
      })
    }
  }
}
