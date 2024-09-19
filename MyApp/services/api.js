import axios from 'axios';

const api = axios.create({
  baseURL: 'http://192.168.1.100:8000', // Ensure this is your backend's IP and protocol
  // Add other configurations if needed
});

export const testConnection = async () => {
  try {
    const response = await api.get('/health'); // Ensure you have a `/health` endpoint
    return response.status === 200;
  } catch (error) {
    console.error('Health check failed:', error);
    return false;
  }
};

export default api;

console.log('API Initialized:', api);