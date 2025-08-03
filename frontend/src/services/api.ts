import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
}); 

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: (email: string = 'student@anyware.com', name: string = 'Student') => 
    api.post('/auth/login', { email, name }),
  logout: () => api.post('/auth/logout'),
  getCurrentUser: () => api.get('/auth/me'),
};

// Announcement API
export const announcementAPI = {
  getAnnouncements: (params?: any) => api.get('/announcements', { params }),
  getAnnouncement: (id: string) => api.get(`/announcements/${id}`),
  createAnnouncement: (data: any) => api.post('/announcements', data),
  updateAnnouncement: (id: string, data: any) => api.put(`/announcements/${id}`, data),
  deleteAnnouncement: (id: string) => api.delete(`/announcements/${id}`),
};

// Quiz API
export const quizAPI = {
  getQuizzes: (params?: any) => api.get('/quizzes', { params }),
  getUpcomingQuizzes: () => api.get('/quizzes/upcoming'),
  getQuiz: (id: string) => api.get(`/quizzes/${id}`),
  createQuiz: (data: any) => api.post('/quizzes', data),
  updateQuiz: (id: string, data: any) => api.put(`/quizzes/${id}`, data),
  deleteQuiz: (id: string) => api.delete(`/quizzes/${id}`),
};

export default api; 