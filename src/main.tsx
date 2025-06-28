import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { PerformanceMonitor } from './utils/performance';

PerformanceMonitor.startupTimer();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);

document.addEventListener('DOMContentLoaded', () => {
  PerformanceMonitor.endStartupTimer();
  PerformanceMonitor.startFPSMonitoring();

  if (import.meta.env.DEV) {
    setInterval(() => {
      PerformanceMonitor.logMemoryUsage();
    }, 5000);
  }
});
