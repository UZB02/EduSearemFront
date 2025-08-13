// src/api.js
import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:3000/api',
})

api.interceptors.request.use((config) => {
  const token = sessionStorage.getItem('admin')
  if (token) {
    config.headers.Authorization = `Bearer ${token.token}`
  }
  return config
})

export default api
