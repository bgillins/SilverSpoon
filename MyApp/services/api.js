// services/api.js

import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// // Replace '192.168.1.100' with your actual computer's IP address
// const API_BASE_URL = 'http://192.168.68.70:8000/api/';

// const api = axios.create({
//   baseURL: API_BASE_URL,
// });

const api = axios.create({
  baseURL: 'http://192.168.68.70:8000/api/',
  timeout: 10000, // 10 seconds timeout
});

// Add a request interceptor to include the token in headers
api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error);
    if (error.response) {
      console.error('Response data:', error.response.data);
      console.error('Response status:', error.response.status);
    } else if (error.request) {
      console.error('No response received:', error.request);
    } else {
      console.error('Error setting up request:', error.message);
    }
    return Promise.reject(error);
  }
);

export default api;
