// src/services/api.js
import api from '../api/axios';

// Fetch all issues
export const fetchIssues = async () => {
  const response = await api.get('/issues');
  return response;
};

// Create new issue
export const createIssue = async (issueData) => {
  const response = await api.post('/issues', issueData);
  return response;
};

// Get single issue
export const fetchIssue = async (id) => {
  const response = await api.get(`/issues/${id}`);
  return response;
};

// Update issue
export const updateIssue = async (id, issueData) => {
  const response = await api.put(`/issues/${id}`, issueData);
  return response;
};

// Delete issue
export const deleteIssue = async (id) => {
  const response = await api.delete(`/issues/${id}`);
  return response;
};

// Auth functions
export const login = async (credentials) => {
  const response = await api.post('/auth/login', credentials);
  return response;
};

export const register = async (userData) => {
  const response = await api.post('/auth/register', userData);
  return response;
};

export const logout = async () => {
  const response = await api.post('/auth/logout');
  return response;
};