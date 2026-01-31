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
const PUBLISH_API_URL = import.meta.env.VITE_PUBLISH_API_URL as string;

// Production-ready configuration - no hardcoded fallbacks
const CONFIG = {
  // Auth Backend URL
  AUTH_API_URL,

  // Content Backend URL
  CONTENT_API_URL,

  // Editor Backend URL
  EDITOR_API_URL,

  // Approval Backend URL
  APPROVAL_API_URL,

  // Publish Backend URL
  PUBLISH_API_URL,

  // Editor Website URL
  EDITOR_WEBSITE,
};

export default CONFIG;
