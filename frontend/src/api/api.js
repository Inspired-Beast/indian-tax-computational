import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// File upload
export const uploadFile = async (file) => {
  const formData = new FormData()
  formData.append('file', file)
  
  const response = await api.post('/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
  return response.data
}

// Download file
export const downloadFile = async (filename) => {
  const response = await api.get(`/download/${filename}`, {
    responseType: 'blob',
  })
  return response.data
}

// Get all files
export const getFiles = async () => {
  const response = await api.get('/files')
  return response.data
}

// Delete file
export const deleteFile = async (filename) => {
  const response = await api.delete(`/files/${filename}`)
  return response.data
}

// Calculate tax
export const calculateTax = async (data) => {
  const response = await api.post('/calculate-tax', data)
  return response.data
}

// Process tax file
export const processTaxFile = async (file) => {
  const formData = new FormData()
  formData.append('file', file)
  
  const response = await api.post('/process-tax-file', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
  return response.data
}

export default api


