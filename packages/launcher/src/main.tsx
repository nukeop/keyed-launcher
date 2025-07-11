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
