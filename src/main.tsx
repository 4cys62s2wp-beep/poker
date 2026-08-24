import React from 'react';
import ReactDOM from 'react-dom/client';
import { HashRouter } from 'react-router-dom';
import { App } from './App';
import { AppStateProvider } from './state/AppState';
import { CloudProvider } from './lib/cloud/CloudProvider';
import { restoreFromMirrorIfNeeded } from './lib/storage';
import '@fontsource-variable/fraunces';
import '@fontsource-variable/manrope';
import './styles/global.css';

function render() {
  ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
      <HashRouter>
        <AppStateProvider>
          <CloudProvider>
            <App />
          </CloudProvider>
        </AppStateProvider>
      </HashRouter>
    </React.StrictMode>,
  );
}

// Falls localStorage geleert wurde: Daten aus dem IndexedDB-Spiegel
// wiederherstellen, BEVOR die App startet.
restoreFromMirrorIfNeeded()
  .catch(() => false)
  .finally(render);

// PWA: Service Worker nur im normalen Build registrieren
if (!__SINGLE__ && 'serviceWorker' in navigator && !location.hostname.includes('localhost')) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js').catch(() => {
      // Offline-Modus optional – Fehler still ignorieren
    });
  });
}
