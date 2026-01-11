/**
 * API Configuration
 * Centralized API base URL from environment variables
 */

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://api.gecestays.com';

// Alias for backward compatibility
export const BACKEND_URL = API_BASE_URL;
