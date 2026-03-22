import { API_BASE_URL } from './constants';

async function authFetch(endpoint, options = {}) {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    headers: { 'Content-Type': 'application/json', ...options.headers },
    credentials: 'include',
    ...options,
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Authentication failed');
  }

  return data;
}

export const login = (email, password) =>
  authFetch('/auth/login', { method: 'POST', body: { email, password } });

export const register = (userData) =>
  authFetch('/auth/register', { method: 'POST', body: userData });

export const logout = () =>
  authFetch('/auth/logout', { method: 'POST' });

export const refreshToken = () =>
  authFetch('/auth/refresh', { method: 'POST' });

export const getCurrentUser = () =>
  authFetch('/auth/me');
