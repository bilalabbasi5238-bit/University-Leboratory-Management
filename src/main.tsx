// Ensure window.fetch has both a getter and setter in iframe environments to prevent
// "TypeError: Cannot set property fetch of #<Window> which has only a getter"
try {
  if (typeof window !== 'undefined' && typeof window.fetch === 'function') {
    let _activeFetch = window.fetch;
    const desc = Object.getOwnPropertyDescriptor(window, 'fetch');
    if (!desc || (desc.get && !desc.set)) {
      Object.defineProperty(window, 'fetch', {
        get() {
          return _activeFetch;
        },
        set(fn) {
          _activeFetch = fn;
        },
        configurable: true,
        enumerable: true,
      });
    }
  }
} catch {
  // Silent fallback
}

import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(<App />);
