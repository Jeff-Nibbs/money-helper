const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

/**
 * Get the authentication token from localStorage
 */
export const getToken = () => {
  return localStorage.getItem('token');
};

/**
 * Set the authentication token in localStorage
 */
export const setToken = (token) => {
  localStorage.setItem('token', token);
};

/**
 * Remove the authentication token from localStorage
 */
export const removeToken = () => {
  localStorage.removeItem('token');
};

/**
 * Make an authenticated API request
 */
export const apiRequest = async (endpoint, options = {}) => {
  const token = getToken();
  
  const config = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
  };

  const response = await fetch(`${API_URL}${endpoint}`, config);
  
  // Handle 401 Unauthorized - token expired or invalid
  if (response.status === 401) {
    removeToken();
    // Redirect to login if not already there
    if (!window.location.pathname.includes('/auth')) {
      window.location.href = '/auth';
    }
    throw new Error('Authentication required');
  }

  // Handle other errors
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ detail: 'An error occurred' }));
    throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
  }

  // Return JSON data if response has content
  const contentType = response.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    return await response.json();
  }
  
  return response;
};

/**
 * Auth API endpoints
 */
export const authAPI = {
  register: async (name, email, password) => {
    const data = await apiRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password }),
    });
    return data;
  },

  login: async (email, password) => {
    const data = await apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    return data;
  },

  googleLogin: () => {
    // Redirect to backend Google OAuth endpoint
    window.location.href = `${API_URL}/auth/google`;
  },
};

/**
 * Goals API endpoints
 */
export const goalsAPI = {
  getAll: async () => {
    return await apiRequest('/goals');
  },

  create: async (goalData) => {
    return await apiRequest('/goals', {
      method: 'POST',
      body: JSON.stringify(goalData),
    });
  },

  update: async (goalId, goalData) => {
    return await apiRequest(`/goals/${goalId}`, {
      method: 'PUT',
      body: JSON.stringify(goalData),
    });
  },

  delete: async (goalId) => {
    return await apiRequest(`/goals/${goalId}`, {
      method: 'DELETE',
    });
  },
};

/**
 * Plaid API endpoints
 */
export const plaidAPI = {
  createLinkToken: async () => {
    return await apiRequest('/plaid/create-link-token', {
      method: 'POST',
    });
  },

  exchangeToken: async (publicToken) => {
    return await apiRequest('/plaid/exchange-token', {
      method: 'POST',
      body: JSON.stringify({ public_token: publicToken }),
    });
  },

  getAccounts: async () => {
    return await apiRequest('/plaid/accounts');
  },

  syncTransactions: async () => {
    return await apiRequest('/plaid/sync-transactions', {
      method: 'POST',
    });
  },

  disconnectAccount: async (accountId) => {
    return await apiRequest(`/plaid/accounts/${accountId}`, {
      method: 'DELETE',
    });
  },
};

/**
 * Insights API endpoints
 */
export const insightsAPI = {
  generate: async () => {
    return await apiRequest('/insights/generate', {
      method: 'POST',
    });
  },

  getLatest: async () => {
    return await apiRequest('/insights/latest');
  },
};

