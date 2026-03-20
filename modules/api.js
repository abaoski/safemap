/**
 * SafeMap-PH API Module
 * Frontend communication with Flask backend
 */

// API Base URL - update this to match your Flask server
const API_BASE_URL = 'http://localhost:5000/api';

// Helper function to make API requests
async function apiRequest(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const defaultOptions = {
        headers: {
            'Content-Type': 'application/json',
            ...options.headers
        }
    };
    
    // Add auth token if available
    const token = localStorage.getItem('access_token');
    if (token) {
        defaultOptions.headers['Authorization'] = `Bearer ${token}`;
    }
    
    const config = { ...defaultOptions, ...options };
    
    try {
        const response = await fetch(url, config);
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.error || 'API request failed');
        }
        
        return data;
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
}

// ==================== Auth API ====================

export const auth = {
    async login(username, password) {
        const data = await apiRequest('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ username, password })
        });
        
        if (data.access_token) {
            localStorage.setItem('access_token', data.access_token);
            localStorage.setItem('refresh_token', data.refresh_token);
            localStorage.setItem('user', JSON.stringify(data.user));
        }
        
        return data;
    },
    
    async register(username, email, password, fullName = null, phone = null) {
        const data = await apiRequest('/auth/register', {
            method: 'POST',
            body: JSON.stringify({
                username,
                email,
                password,
                full_name: fullName,
                phone
            })
        });
        
        if (data.access_token) {
            localStorage.setItem('access_token', data.access_token);
            localStorage.setItem('refresh_token', data.refresh_token);
            localStorage.setItem('user', JSON.stringify(data.user));
        }
        
        return data;
    },
    
    async logout() {
        try {
            await apiRequest('/auth/logout', { method: 'POST' });
        } finally {
            localStorage.removeItem('access_token');
            localStorage.removeItem('refresh_token');
            localStorage.removeItem('user');
        }
    },
    
    async refreshToken() {
        const data = await apiRequest('/auth/refresh', { method: 'POST' });
        
        if (data.access_token) {
            localStorage.setItem('access_token', data.access_token);
        }
        
        return data;
    },
    
    async verifyToken() {
        return await apiRequest('/auth/verify');
    },
    
    getCurrentUser() {
        const userStr = localStorage.getItem('user');
        return userStr ? JSON.parse(userStr) : null;
    },
    
    isAuthenticated() {
        return !!localStorage.getItem('access_token');
    }
};

// ==================== Reports API ====================

export const reports = {
    async getAll(params = {}) {
        const queryString = new URLSearchParams(params).toString();
        const endpoint = queryString ? `/reports?${queryString}` : '/reports';
        return await apiRequest(endpoint);
    },
    
    async getById(id) {
        return await apiRequest(`/reports/${id}`);
    },
    
    async create(reportData) {
        return await apiRequest('/reports', {
            method: 'POST',
            body: JSON.stringify(reportData)
        });
    },
    
    async update(id, reportData) {
        return await apiRequest(`/reports/${id}`, {
            method: 'PUT',
            body: JSON.stringify(reportData)
        });
    },
    
    async delete(id) {
        return await apiRequest(`/reports/${id}`, {
            method: 'DELETE'
        });
    },
    
    async getStats() {
        return await apiRequest('/reports/stats');
    },
    
    async getMyReports() {
        return await apiRequest('/users/me/reports');
    }
};

// ==================== Locations API ====================

export const locations = {
    async getAll(params = {}) {
        const queryString = new URLSearchParams(params).toString();
        const endpoint = queryString ? `/locations?${queryString}` : '/locations';
        return await apiRequest(endpoint);
    },
    
    async getById(id) {
        return await apiRequest(`/locations/${id}`);
    },
    
    async getNearby(latitude, longitude, radius = 5) {
        return await apiRequest(
            `/locations/nearby?latitude=${latitude}&longitude=${longitude}&radius=${radius}`
        );
    },
    
    async create(locationData) {
        return await apiRequest('/locations', {
            method: 'POST',
            body: JSON.stringify(locationData)
        });
    },
    
    async update(id, locationData) {
        return await apiRequest(`/locations/${id}`, {
            method: 'PUT',
            body: JSON.stringify(locationData)
        });
    },
    
    async delete(id) {
        return await apiRequest(`/locations/${id}`, {
            method: 'DELETE'
        });
    },
    
    async getTypes() {
        return await apiRequest('/locations/types');
    }
};

// ==================== Users API ====================

export const users = {
    async getAll(params = {}) {
        const queryString = new URLSearchParams(params).toString();
        const endpoint = queryString ? `/users?${queryString}` : '/users';
        return await apiRequest(endpoint);
    },
    
    async getById(id) {
        return await apiRequest(`/users/${id}`);
    },
    
    async update(id, userData) {
        return await apiRequest(`/users/${id}`, {
            method: 'PUT',
            body: JSON.stringify(userData)
        });
    },
    
    async delete(id) {
        return await apiRequest(`/users/${id}`, {
            method: 'DELETE'
        });
    },
    
    async getProfile() {
        return await apiRequest('/users/me');
    }
};

// ==================== Chatbot API ====================

export const chatbot = {
    async query(message, context = {}) {
        return await apiRequest('/chatbot/query', {
            method: 'POST',
            body: JSON.stringify({ message, context })
        });
    },
    
    async getSuggestions() {
        return await apiRequest('/chatbot/suggestions');
    },
    
    async getHistory() {
        return await apiRequest('/chatbot/history');
    },
    
    async clearHistory() {
        return await apiRequest('/chatbot/history', {
            method: 'DELETE'
        });
    }
};

// ==================== Health Check ====================

export async function checkHealth() {
    try {
        const response = await fetch('http://localhost:5000/health');
        return await response.json();
    } catch (error) {
        return { status: 'unhealthy', error: error.message };
    }
}

export default {
    auth,
    reports,
    locations,
    users,
    chatbot,
    checkHealth
};
