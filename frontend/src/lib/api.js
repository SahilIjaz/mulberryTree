import { API_BASE_URL } from './constants';
import { getAccessToken, refreshToken as doRefresh, clearTokens } from './auth';

async function fetchApi(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;

  const headers = { ...options.headers };
  if (!(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }
  const token = getAccessToken();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const config = {
    ...options,
    headers,
  };

  if (options.body && !(options.body instanceof FormData)) {
    config.body = JSON.stringify(options.body);
  }

  let response = await fetch(url, config);

  // Auto-refresh on 401
  if (response.status === 401 && !endpoint.includes('/auth/refresh')) {
    try {
      await doRefresh();
      const newToken = getAccessToken();
      headers['Authorization'] = `Bearer ${newToken}`;
      response = await fetch(url, { ...config, headers });
    } catch {
      clearTokens();
      window.location.href = '/login';
      throw new Error('Session expired');
    }
  }

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Something went wrong');
  }

  return data;
}

// Recipes
export const getRecipes = (params = '') => fetchApi(`/recipes?${params}`);
export const getRecipeById = (id) => fetchApi(`/recipes/${id}`);
export const createRecipe = (formData) => fetchApi('/recipes', { method: 'POST', body: formData });
export const updateRecipe = (id, formData) => fetchApi(`/recipes/${id}`, { method: 'PUT', body: formData });
export const deleteRecipe = (id) => fetchApi(`/recipes/${id}`, { method: 'DELETE' });
export const rateRecipe = (id, score) => fetchApi(`/recipes/${id}/rate`, { method: 'POST', body: { score } });

// Courses
export const getCourses = (params = '') => fetchApi(`/courses?${params}`);
export const getCourseById = (id) => fetchApi(`/courses/${id}`);
export const createCourse = (formData) => fetchApi('/courses', { method: 'POST', body: formData });
export const updateCourse = (id, formData) => fetchApi(`/courses/${id}`, { method: 'PUT', body: formData });
export const deleteCourse = (id) => fetchApi(`/courses/${id}`, { method: 'DELETE' });
export const enrollInCourse = (id) => fetchApi(`/courses/${id}/enroll`, { method: 'POST' });
export const unenrollFromCourse = (id) => fetchApi(`/courses/${id}/enroll`, { method: 'DELETE' });

// Events
export const getEvents = (params = '') => fetchApi(`/events?${params}`);
export const getEventById = (id) => fetchApi(`/events/${id}`);
export const createEvent = (formData) => fetchApi('/events', { method: 'POST', body: formData });
export const updateEvent = (id, formData) => fetchApi(`/events/${id}`, { method: 'PUT', body: formData });
export const deleteEvent = (id) => fetchApi(`/events/${id}`, { method: 'DELETE' });
export const attendEvent = (id) => fetchApi(`/events/${id}/attend`, { method: 'POST' });
export const unattendEvent = (id) => fetchApi(`/events/${id}/attend`, { method: 'DELETE' });

// Users
export const getUserProfile = (id) => fetchApi(`/users/${id}`);
export const updateUserProfile = (formData) => fetchApi('/users/profile', { method: 'PUT', body: formData });
