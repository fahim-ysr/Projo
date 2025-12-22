// Utility functions for making API requests using Axios

import axios from "axios";

// Sets the base URL for API requests
const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api-v1";

// Creates an Axios instance with default headers
const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Attaches JWT token to every request if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// Handles unauthorized responses globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      window.dispatchEvent(new Event("force-logout"));
    }

    return Promise.reject(error);
  }
);

// Helper for POST Operation
const postData = async <T>(url: string, data: unknown): Promise<T> => {
  const response = await api.post(url, data);

  return response.data;
};

// Helper for FETCH Operation
const fetchData = async <T>(url: string): Promise<T> => {
  const response = await api.get(url);

  return response.data;
};

// Helper for UPDATE Operation
const updateData = async <T>(url: string, data: unknown): Promise<T> => {
  const response = await api.put(url, data);

  return response.data;
};

// Helper for DELETE Operation
const deleteData = async <T>(url: string): Promise<T> => {
  const response = await api.delete(url);

  return response.data;
};

export { postData, fetchData, updateData, deleteData };
