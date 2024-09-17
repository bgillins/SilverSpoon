import axios from 'axios';
import { Platform } from 'react-native';

const getApiUrl = () => {
  if (__DEV__) {
    if (Platform.OS === 'android') {
      return 'http://10.0.2.2:8000/api/';
    } else {
      return 'http://127.0.0.1:8000/api/';
    }
  }
  // For production, you would return your actual API URL
  return 'https://your-production-api.com/api/';
};

const API_URL = getApiUrl();

export const login = async (username: string, password: string) => {
  const response = await axios.post(`${API_URL}token/`, { username, password });
  return response.data;
};

export const register = async (username: string, email: string, password: string) => {
  const response = await axios.post(`${API_URL}register/`, { username, email, password });
  return response.data;
};

// Add other API functions as needed
