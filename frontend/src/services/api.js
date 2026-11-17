import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to attach JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to catch unauthorized 401
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Don't auto-redirect on login failure itself
      if (!window.location.pathname.includes('/login')) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// Auth Services
export const authService = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
};

// Student Services
export const studentService = {
  getProfile: (id) => api.get(`/students/${id}/profile`),
  updateProfile: (id, data) => api.put(`/students/${id}`, data),
  updateSkills: (id, skills) => api.put(`/students/${id}/skills`, skills),
  getAllStudents: (params) => api.get('/students', { params }),
};

// Job Services
export const jobService = {
  getAll: (params) => api.get('/jobs', { params }),
  getById: (id, studentId) => api.get(`/jobs/${id}`, { params: { studentId } }),
  getRecommended: (studentId) => api.get('/jobs/recommended', { params: { studentId } }),
  create: (jobData) => api.post('/jobs', jobData),
  update: (id, jobData) => api.put(`/jobs/${id}`, jobData),
  delete: (id) => api.delete(`/jobs/${id}`),
};

// Application Services
export const applicationService = {
  apply: (studentId, jobId) => api.post('/applications', { studentId, jobId }),
  getByStudent: (studentId) => api.get(`/applications/student/${studentId}`),
  getByJob: (jobId) => api.get(`/applications/job/${jobId}`),
  getAll: () => api.get('/applications'),
  updateStatus: (id, data) => api.put(`/applications/${id}/status`, data),
};

// Resume Services
export const resumeService = {
  upload: (studentId, file, targetJobRole) => {
    const formData = new FormData();
    formData.append('studentId', studentId);
    formData.append('file', file);
    if (targetJobRole) formData.append('targetJobRole', targetJobRole);
    return api.post('/resumes/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  getLatest: (studentId, targetJobRole) =>
    api.get(`/resumes/latest/${studentId}`, { params: { targetJobRole } }),
};

// AI Services
export const aiService = {
  analyzeResume: (payload) => api.post('/ai/analyze-resume', payload),
  getCareerRecommendations: (studentId) => api.post('/ai/recommend-career', { studentId }),
  generateInterviewQuestions: (jobRole, category, count = 5) =>
    api.post('/ai/generate-interview', { jobRole, category, count }),
  evaluateAnswer: (payload) => api.post('/ai/evaluate-answer', payload),
};

// Analytics Services
export const analyticsService = {
  getStudentStats: (studentId) => api.get(`/analytics/student/${studentId}`),
  getAdminStats: () => api.get('/analytics/admin'),
};

export default api;

