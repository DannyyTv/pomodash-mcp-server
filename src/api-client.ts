import axios from 'axios';

const API_BASE_URL = process.env.POMODASH_API_URL || 'https://mcp.pomodash.mindsnapz.de';
const API_KEY = process.env.POMODASH_API_KEY;

if (!API_KEY) {
  throw new Error('POMODASH_API_KEY environment variable is required');
}

// Create separate clients for each endpoint
export const tasksClient = axios.create({
  baseURL: `${API_BASE_URL}/tasks`,
  headers: {
    'Authorization': `Bearer ${API_KEY}`,
    'Content-Type': 'application/json'
  }
});

export const notesClient = axios.create({
  baseURL: `${API_BASE_URL}/notes`,
  headers: {
    'Authorization': `Bearer ${API_KEY}`,
    'Content-Type': 'application/json'
  }
});

export const categoriesClient = axios.create({
  baseURL: `${API_BASE_URL}/categories`,
  headers: {
    'Authorization': `Bearer ${API_KEY}`,
    'Content-Type': 'application/json'
  }
});

// Default export for backward compatibility
const apiClient = tasksClient;
export default apiClient;