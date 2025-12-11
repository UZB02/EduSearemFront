// src/utils/api.js
import axios from 'axios'

// API instansiyasi
const api = axios.create({
  baseURL : 'https://education-backend-jxtk.onrender.com/api',
  // baseURL: 'http://localhost:3000/api',
  timeout: 10000,
})

// Request interceptor – tokenni har bir so‘rovga qo‘shadi
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error),
)

// Response interceptor – global xatoliklar
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.warn('Token muddati tugagan yoki noto‘g‘ri')
      // bu yerda avtomatik logout qilishingiz mumkin
    }
    return Promise.reject(error)
  },
)

export default api
