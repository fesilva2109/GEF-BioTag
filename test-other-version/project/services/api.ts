import axios from 'axios';

// Base URL would typically come from environment variables
const BASE_URL = 'https://api.example.com';

export const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to add auth token
api.interceptors.request.use(
  async (config) => {
    // In a real app, you would get the token from storage
    // const token = await AsyncStorage.getItem('@GEFBioTag:token');
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error('API Error:', error.response.data);
      
      if (error.response.status === 401) {
        // Handle unauthorized error
        // In a real app, you might redirect to login or refresh token
      }
    } else if (error.request) {
      // The request was made but no response was received
      console.error('Network Error:', error.request);
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error('Request Error:', error.message);
    }
    
    return Promise.reject(error);
  }
);

// Example API functions
export const victimApi = {
  getAll: () => api.get('/victims'),
  getById: (id: string) => api.get(`/victims/${id}`),
  create: (data: any) => api.post('/victims', data),
  update: (id: string, data: any) => api.put(`/victims/${id}`, data),
  delete: (id: string) => api.delete(`/victims/${id}`),
  
  // In a real app, you might have more specific endpoints
  syncOfflineData: (data: any) => api.post('/victims/sync', data),
};