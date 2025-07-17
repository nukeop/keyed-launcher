export const mockPerformance = () => {
  vi.mock('../../utils/performance', () => ({
    PerformanceMonitor: {
      getCurrentFPS: vi.fn(() => 60),
      getMemoryStats: vi.fn(() =>
        Promise.resolve({
          used: '32 MB',
          total: '64 MB',
        }),
      ),
    },
  }));
};
