import axios from 'axios';

// Create axios instance
const api = axios.create({
    baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Auth API instance for file uploads (registration)
export const authAPI = axios.create({
    baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000',
    headers: {
        'Content-Type': 'multipart/form-data', // For file uploads
    },
});

// Auth API instance for JSON requests (login, password reset)
export const authAPIJson = axios.create({
    baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000',
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
            // Token expired or invalid
            localStorage.removeItem('token');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

// Auth API endpoints
export const authEndpoints = {
    login: (data) => {
        // Use the JSON API instance for login
        return authAPIJson.post('/api/auth/login', data);
    },
    register: (data) => {
        // Use the multipart API instance for registration (file uploads)
        return authAPI.post('/api/register', data);
    },
    forgotPassword: (data) => {
        // Use the JSON API instance for password reset
        return authAPIJson.post('/api/forgot-password', data);
    },
    resetPassword: (data) => {
        // Use the JSON API instance for password reset
        return authAPIJson.post('/api/reset-password', data);
    },
    verifyEmail: (params) => {
        // Use the JSON API instance for email verification
        return authAPIJson.get('/api/verify-email', { params });
    },
    getCurrentUser: () => api.get('/api/auth/me'),
};

// User API endpoints
export const userEndpoints = {
    getProfile: (id) => api.get(`/api/users/profile/${id}`),
    updateProfile: (id, data) => api.put(`/api/users/profile/${id}`, data),
    uploadVerificationDocument: (id, documentType, file) => {
        const formData = new FormData();
        formData.append('documentType', documentType);
        formData.append('idCard', file);
        return api.post(`/api/users/${id}/upload-verification`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
    },
    getStudentApplicationHistory: () => api.get('/api/users/student/application-history'),
    getVerifyRequests: () => api.get('/api/users/verify-requests'),
    verifyUser: (id) => api.post(`/api/users/verify/${id}`),
    getAlumni: () => api.get('/api/users/alumni'),
    getStudents: () => api.get('/api/users/students'),
    getRecruiters: () => api.get('/api/users/recruiters'),
    blockUser: (id, data) => api.patch(`/api/users/block/${id}`, data),
    deleteUser: (id) => api.delete(`/api/users/${id}`),
    search: (q, limit) => api.get('/api/users/search', { params: { q, limit } }),
};

// Job API endpoints
export const jobEndpoints = {
    getJobs: (params) => api.get('/api/jobs', { params }),
    getJob: (id) => api.get(`/api/jobs/${id}`),
    createJob: (data) => api.post('/api/jobs', data),
    updateJob: (id, data) => api.put(`/api/jobs/${id}`, data),
    deleteJob: (id) => api.delete(`/api/jobs/${id}`),
    applyForJob: (id, data) => api.post(`/api/jobs/${id}/apply`, data),
    getMyPostings: () => api.get('/api/jobs/my-postings'),
    getMyApplications: () => api.get('/api/jobs/my-applications'),
    getMyApplicationStatus: (jobId) => api.get(`/api/jobs/${jobId}/my-application`),
    updateApplicantStatus: (jobId, applicantId, data) => api.patch(`/api/jobs/${jobId}/applicant-status/${applicantId}`, data),
    getRecruiterStats: () => api.get('/api/jobs/recruiter/summary'),
};

// Referral API endpoints
export const referralEndpoints = {
    requestReferral: (data) => api.post('/api/referrals/request', data),
    getMyRequests: () => api.get('/api/referrals/my-requests'),
    getAlumniReferrals: () => api.get('/api/referrals/alumni'),
    getPendingReferrals: () => api.get('/api/referrals/alumni/pending'),
    approveReferral: (id, data) => api.patch(`/api/referrals/${id}/approve`, data),
    rejectReferral: (id, data) => api.patch(`/api/referrals/${id}/reject`, data),
    getReferral: (id) => api.get(`/api/referrals/${id}`),
    getJobReferrals: (jobId) => api.get(`/api/referrals/job/${jobId}`),
    markAsRead: (id) => api.patch(`/api/referrals/${id}/mark-read`),
    deleteReferral: (id) => api.delete(`/api/referrals/${id}`),
};

// Admin API endpoints
export const adminEndpoints = {
    getDashboard: () => api.get('/api/admin/dashboard'),
    getUsers: (params) => api.get('/api/admin/users', { params }),
    getSpamMonitor: (params) => api.get('/api/admin/spam-monitor', { params }),
    blockUser: (id, data) => api.patch(`/api/admin/block-user/${id}`, data),
    updateSpamScore: (id, data) => api.patch(`/api/admin/update-spam-score/${id}`, data),
    getAllJobs: (params) => api.get('/api/admin/jobs', { params }),
    toggleJob: (id) => api.patch(`/api/admin/toggle-job/${id}`),
    getAllReferrals: (params) => api.get('/api/admin/referrals', { params }),
    deleteJob: (id) => api.delete(`/api/admin/delete-job/${id}`),
    deleteReferral: (id) => api.delete(`/api/admin/delete-referral/${id}`),
    // Alumni verification endpoints
    getPendingAlumniVerifications: (params) => api.get('/api/admin/alumni-verifications', { params }),
    verifyAlumniAccount: (alumniId, data) => api.patch(`/api/admin/verify-alumni/${alumniId}`, data),
    // Student verification endpoints
    getPendingStudentVerifications: (params) => api.get('/api/admin/student-verifications', { params }),
    verifyStudentAccount: (studentId, data) => api.patch(`/api/admin/verify-student/${studentId}`, data),
    // Recruiter verification endpoints
    getPendingRecruiterVerifications: (params) => api.get('/api/admin/recruiter-verifications', { params }),
    verifyRecruiterAccount: (recruiterId, data) => api.patch(`/api/admin/verify-recruiter/${recruiterId}`, data),
};

// Alerts API endpoints
export const alertEndpoints = {
    create: (data) => api.post('/api/alerts/create', data),
    list: () => api.get('/api/alerts'),
    markSeen: (id) => api.patch(`/api/alerts/${id}/mark-seen`),
};

// Messaging API endpoints
export const messageEndpoints = {
    send: (data) => api.post('/api/messages/send', data),
    inbox: () => api.get('/api/messages/inbox'),
    conversation: (userId) => api.get(`/api/messages/conversation/${userId}`),
};

// Q&A Sessions API endpoints
export const qaSessionEndpoints = {
    create: (data) => api.post('/api/qa-sessions/create', data),
    getById: (id) => api.get(`/api/qa-sessions/${id}`),
    markCompleted: (id) => api.patch(`/api/qa-sessions/${id}/mark-completed`),
    getStudentStatus: (id) => api.get(`/api/qa-sessions/student/${id}`),
    list: () => api.get('/api/qa-sessions'),
    submitAnswers: (id, data) => api.post(`/api/qa-sessions/${id}/answers`, data),
    getJobQASessions: (jobId) => api.get(`/api/qa-sessions/job/${jobId}`),
    getRecruiterQASessions: () => api.get('/api/qa-sessions/recruiter/sessions'),
};

// Job FAQ API endpoints
export const jobFAQEndpoints = {
    create: (data) => api.post('/api/job-faq', data),
    getAll: (params) => api.get('/api/job-faq', { params }),
    getById: (id) => api.get(`/api/job-faq/${id}`),
    update: (id, data) => api.put(`/api/job-faq/${id}`, data),
    delete: (id) => api.delete(`/api/job-faq/${id}`),
    markHelpful: (id, data) => api.post(`/api/job-faq/${id}/helpful`, data),
    getCategories: () => api.get('/api/job-faq/categories'),
    getRecruiterFAQs: () => api.get('/api/job-faq/recruiter/my-faqs'),
};

// Resume API endpoints
export const resumeEndpoints = {
    generate: () => api.post('/api/resume/generate'),
};

// Courses API endpoints
export const courseEndpoints = {
    list: (params) => api.get('/api/courses', { params }),
    get: (id) => api.get(`/api/courses/${id}`),
    enroll: (data) => api.post('/api/courses/enroll', data),
    create: (data) => api.post('/api/courses', data),
    delete: (id) => api.delete(`/api/courses/${id}`),
    getProgress: (courseId) => api.get(`/api/courses/${courseId}/progress`),
    completeCheckpoint: (data) => api.post('/api/courses/complete-checkpoint', data),
};

// Connections API endpoints
export const connectionEndpoints = {
    request: (data) => api.post('/api/connections/request', data),
    approve: (id) => api.patch(`/api/connections/${id}/approve`),
    list: () => api.get('/api/connections'),
    incoming: () => api.get('/api/connections/incoming'),
    outgoing: () => api.get('/api/connections/outgoing'),
    status: (targetId) => api.get('/api/connections/status', { params: { targetId } }),
};

// File upload helper
export const uploadFile = async (file, type) => {
    const formData = new FormData();
    formData.append(type, file);

    const response = await api.post('/api/upload', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });

    return response.data;
};

// API utility functions
export const apiUtils = {
    // Handle API errors
    handleError: (error) => {
        if (error.response) {
            // Server responded with error status
            return error.response.data.message || 'An error occurred';
        } else if (error.request) {
            // Request was made but no response received
            return 'Network error. Please check your connection.';
        } else {
            // Something else happened
            return error.message || 'An unexpected error occurred';
        }
    },

    // Create query string from object
    createQueryString: (params) => {
        const searchParams = new URLSearchParams();
        Object.keys(params).forEach(key => {
            if (params[key] !== undefined && params[key] !== null && params[key] !== '') {
                searchParams.append(key, params[key]);
            }
        });
        return searchParams.toString();
    },

    // Format date for API
    formatDate: (date) => {
        if (!date) return null;
        return new Date(date).toISOString();
    },

    // Parse API response
    parseResponse: (response) => {
        return response.data;
    },
};

// Export default api instance
export default api;
