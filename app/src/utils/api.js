// utils/api.js
import { useState, useCallback } from 'react';

export const useApi = () => {
  const getAuthToken = () => localStorage.getItem('authToken');
  
  const apiCall = useCallback(async (url, options = {}) => {
    const token = getAuthToken();
    const defaultOptions = {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    };

    const response = await fetch(`http://localhost:5000${url}`, {
      ...defaultOptions,
      ...options,
      headers: { ...defaultOptions.headers, ...options.headers }
    });

    if (!response.ok) {
      if (response.status === 401) {
        localStorage.removeItem('authToken');
        throw new Error('Authentication failed');
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.status === 204 ? null : response.json();
  }, []);

  return { apiCall };
};