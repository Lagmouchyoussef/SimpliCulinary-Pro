// Base URL of the Django backend. Override with REACT_APP_API_URL in .env
export const API_URL = process.env.REACT_APP_API_URL || 'http://127.0.0.1:8001';

export const imageUrl = (path) => (path ? (path.startsWith('http') ? path : `${API_URL}${path}`) : null);
