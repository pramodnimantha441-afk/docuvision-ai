import axios from 'axios';
import { auth } from '../config/firebase';

const api = axios.create({
  baseURL: 'http://localhost:8000/api',
});

// Request interceptor to add the Firebase ID token or demo token
api.interceptors.request.use(async (config) => {
  try {
    if (auth.currentUser) {
      const token = await auth.currentUser.getIdToken();
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      // Guest / Demo token fallback
      config.headers.Authorization = 'Bearer demo-token';
    }
  } catch (error) {
    config.headers.Authorization = 'Bearer demo-token';
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export const transcribeImage = async (imageFile, mode) => {
  const formData = new FormData();
  formData.append('image', imageFile);
  formData.append('mode', mode || 'transcription');

  const response = await api.post('/transcribe', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const summarizeText = async (text) => {
  const response = await api.post('/summarize', { text });
  return response.data;
};

export const getUserDocuments = async () => {
  const response = await api.get('/documents');
  return response.data;
};

export const saveDocument = async (docData) => {
  const response = await api.post('/documents/save', docData);
  return response.data;
};

export const updateDocument = async (docId, data) => {
  const response = await api.put(`/documents/${docId}`, data);
  return response.data;
};

export const deleteDocument = async (docId) => {
  const response = await api.delete(`/documents/${docId}`);
  return response.data;
};

export const exportDocxFile = async (payload) => {
  const response = await api.post('/documents/export-docx', payload, {
    responseType: 'blob'
  });
  return response.data;
};

export default api;
