import App from './App';
import React from 'react';
import ReactDOM from 'react-dom/client';

import './index.css';

import { initializeLauncherAPI } from './plugins/api-bridge';
import { loadBundledPlugins } from './plugins/bundled';
import { initializePluginSystem } from './plugins/init';
import { usePluginRegistry } from './stores/plugins';
import { PerformanceMonitor } from './utils/performance';

PerformanceMonitor.startupTimer();

async function initializeApp() {
  try {
    initializeLauncherAPI();
    await initializePluginSystem();
    const { loaded, errors } = await loadBundledPlugins();
    if (errors.length > 0) {
      console.warn(`⚠️ ${errors.length} plugin loading errors:`, errors);
    }

    const { registerPlugin } = usePluginRegistry.getState();
    loaded.forEach((plugin) => {
      registerPlugin(plugin);
    });
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
