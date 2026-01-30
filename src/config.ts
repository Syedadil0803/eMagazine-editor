/**
 * Application Configuration
 * 
 * Centralized configuration for environment variables.
 * Usage: import CONFIG from '@demo/config';
 */

// Check for required environment variables
const AUTH_API_URL = import.meta.env.VITE_AUTH_API_URL as string;
const CONTENT_API_URL = import.meta.env.VITE_CONTENT_API_URL as string;
const EDITOR_API_URL = import.meta.env.VITE_EDITOR_API_URL as string;
const APPROVAL_API_URL = import.meta.env.VITE_APPROVAL_API_URL as string;
const EDITOR_WEBSITE = import.meta.env.VITE_EDITOR_WEBSITE as string;

if (!AUTH_API_URL) {
  console.error('VITE_AUTH_API_URL is not defined in environment variables');
}

if (!CONTENT_API_URL) {
  console.error('VITE_CONTENT_API_URL is not defined in environment variables');
}

if (!EDITOR_API_URL) {
  console.error('VITE_EDITOR_API_URL is not defined in environment variables');
}

if (!APPROVAL_API_URL) {
  console.warn('VITE_APPROVAL_API_URL is not defined in environment variables. Defaulting to http://localhost:3003');
}

if (!EDITOR_WEBSITE) {
  console.warn('VITE_EDITOR_WEBSITE is not defined in environment variables. Defaulting to http://localhost:3001/');
}

const CONFIG = {
  // Auth Backend URL
  AUTH_API_URL,

  // Content Backend URL
  CONTENT_API_URL,

  // Editor Backend URL
  EDITOR_API_URL,

  // Approval Backend URL
  APPROVAL_API_URL: APPROVAL_API_URL || 'http://localhost:3003',

  // Editor Website URL
  EDITOR_WEBSITE: EDITOR_WEBSITE || 'http://localhost:3001/',
};

export default CONFIG;
