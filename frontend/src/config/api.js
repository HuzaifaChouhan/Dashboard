// Central API configuration
// In development: uses localhost:8000
// In production: uses VITE_API_URL environment variable (your Render URL)

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export default API_URL;
