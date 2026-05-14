/**
 * Frontend configuration constants.
 */

export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_URL || 'http://localhost:5000',
  ENDPOINTS: {
    NOTES: '/notes',
  },
};

export const UI_CONFIG = {
  WINDOW_Z_INDEX: {
    EXPLORER: 20,
    WINAMP: 25,
    EDITOR: 30,
  },
  DEFAULT_VOLUME: 0.7,
};
