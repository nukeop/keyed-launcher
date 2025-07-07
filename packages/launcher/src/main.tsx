import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { PerformanceMonitor } from './utils/performance';
import { initializePluginSystem } from './plugins/init';
import { loadBundledPlugins } from './plugins/bundled';
import { usePluginRegistry } from './stores/plugins';
import { initializeLauncherAPI } from './plugins/api-bridge';

PerformanceMonitor.startupTimer();

async function initializeApp() {
  try {
    console.log('🔗 Initializing Launcher API bridge...');
    initializeLauncherAPI();

    console.log('🔌 Initializing plugin system...');

    await initializePluginSystem();

    const { loaded, errors } = await loadBundledPlugins();

    console.log(`✅ Loaded ${loaded.length} bundled plugins`);
    if (errors.length > 0) {
      console.warn(`⚠️ ${errors.length} plugin loading errors:`, errors);
    }

    const { registerPlugin } = usePluginRegistry.getState();
    loaded.forEach((plugin) => {
      registerPlugin(plugin);
    });

    console.log('🚀 Plugin system ready');
  } catch (error) {
    console.error('❌ Failed to initialize plugin system:', error);
  }
}

initializeApp().then(() => {
  ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  );
});

document.addEventListener('DOMContentLoaded', () => {
  PerformanceMonitor.endStartupTimer();
  PerformanceMonitor.startFPSMonitoring();

  if (import.meta.env.DEV) {
    setInterval(() => {
      PerformanceMonitor.logMemoryUsage();
    }, 5000);
  }
});
