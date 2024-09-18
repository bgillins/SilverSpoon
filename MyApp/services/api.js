// services/api.js

import axios from 'axios';

// Replace with your Django backend URL
const API_BASE_URL = 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
});

export default api;
