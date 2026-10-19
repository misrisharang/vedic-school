import { createRoot } from 'react-dom/client';
import { polyfillCountryFlagEmojis } from 'country-flag-emoji-polyfill';

import App from './App';

import './index.css';

// Windows/Chromium can't draw flag emoji (shows letters like "CA"); load a self-hosted flag font there.
polyfillCountryFlagEmojis('Twemoji Country Flags', `${import.meta.env.BASE_URL}fonts/TwemojiCountryFlags.woff2`);

const container = document.getElementById('root');

if (container) {
  createRoot(container).render(<App />);
}


