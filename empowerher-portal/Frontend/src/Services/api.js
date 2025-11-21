import axios from 'axios';

const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
});

// Add token to requests
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor for handling errors
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  register: (userData) => API.post('/auth/register', userData),
  login: (credentials) => API.post('/auth/login', credentials),
  getMe: () => API.get('/auth/me'),
};

export const resourcesAPI = {
  getAll: (filters) => API.get('/resources', { params: filters }),
  getOne: (id) => API.get(`/resources/${id}`),
  create: (resourceData) => API.post('/resources', resourceData),
  update: (id, resourceData) => API.put(`/resources/${id}`, resourceData),
  delete: (id) => API.delete(`/resources/${id}`),
};

export const mentorsAPI = {
  getAll: (filters) => API.get('/mentors', { params: filters }),
  getOne: (id) => API.get(`/mentors/${id}`),
  apply: (applicationData) => API.post('/mentors/apply', applicationData),
  addReview: (id, reviewData) => API.post(`/mentors/${id}/reviews`, reviewData),
};

export const jobsAPI = {
  getAll: (filters) => API.get('/jobs', { params: filters }),
  getOne: (id) => API.get(`/jobs/${id}`),
  create: (jobData) => API.post('/jobs', jobData),
  update: (id, jobData) => API.put(`/jobs/${id}`, jobData),
  delete: (id) => API.delete(`/jobs/${id}`),
};

export default API;