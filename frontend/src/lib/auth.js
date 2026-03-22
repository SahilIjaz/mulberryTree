import { API_BASE_URL } from './constants';

function getAccessToken() {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('accessToken');
  }
  return null;
}

function getRefreshTokenValue() {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('refreshToken');
  }
  return null;
}

function setTokens(accessToken, refreshToken) {
  if (typeof window !== 'undefined') {
    localStorage.setItem('accessToken', accessToken);
    if (refreshToken) localStorage.setItem('refreshToken', refreshToken);
  }
}

function clearTokens() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  }
}

async function authFetch(endpoint, options = {}) {
  const headers = { 'Content-Type': 'application/json', ...options.headers };
  const token = getAccessToken();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Authentication failed');
  }

  return data;
}

export const login = async (email, password) => {
  const data = await authFetch('/auth/login', { method: 'POST', body: { email, password } });
  setTokens(data.accessToken, data.refreshToken);
  return data;
};

export const register = async (userData) => {
  const data = await authFetch('/auth/register', { method: 'POST', body: userData });
  setTokens(data.accessToken, data.refreshToken);
  return data;
};

export const logout = async () => {
  const refreshToken = getRefreshTokenValue();
  try {
    await authFetch('/auth/logout', { method: 'POST', body: { refreshToken } });
  } catch {
    // continue logout even if API fails
  }
  clearTokens();
};

export const refreshToken = async () => {
  const token = getRefreshTokenValue();
  const data = await authFetch('/auth/refresh', { method: 'POST', body: { refreshToken: token } });
  setTokens(data.accessToken, data.refreshToken);
  return data;
};

export const getCurrentUser = () => authFetch('/auth/me');

export { getAccessToken, clearTokens };
