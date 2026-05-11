import axios from "axios"

const API_ORIGIN = import.meta.env.VITE_API_ORIGIN ?? "http://localhost:5000"
const API_BASE_PATH = import.meta.env.VITE_API_BASE_PATH ?? "/api/v1"

const api = axios.create({
  baseURL: `${API_ORIGIN}${API_BASE_PATH}`,
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken")
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})

export default api
export { API_BASE_PATH, API_ORIGIN }
