// src/api.js
import axios from 'axios'

// API instansiyasini yaratamiz
const api = axios.create({
  baseURL: 'https://education-backend-jxtk.onrender.com/api',
  // baseURL: 'http://localhost:3000/api',
  timeout: 10000, // maksimal kutish vaqti (10 soniya)
})

// Har bir so‘rovdan oldin tokenni headerga qo‘shamiz
api.interceptors.request.use(
  (config) => {
    const tokenString = sessionStorage.getItem('admin')

    if (tokenString) {
      try {
        // Token obyekt bo‘lsa — parse qilamiz
        const parsed = JSON.parse(tokenString)

        // Agar token mavjud bo‘lsa — headerga qo‘shamiz
        if (parsed?.token) {
          config.headers.Authorization = `Bearer ${parsed.token}`
        }
      } catch (err) {
        // Agar token oddiy string bo‘lsa — to‘g‘ridan-to‘g‘ri qo‘shamiz
        config.headers.Authorization = `Bearer ${tokenString}`
      }
    }

    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

// Javob interceptor (xatoliklarni global tutish uchun)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Agar token muddati tugagan bo‘lsa — logout qilishni ko‘rib chiqish mumkin
    if (error.response?.status === 401) {
      console.warn('Token muddati tugagan yoki noto‘g‘ri')
      // sessionStorage.removeItem('admin')
      // window.location.href = '/login'
    }
    return Promise.reject(error)
  },
)

export default api
