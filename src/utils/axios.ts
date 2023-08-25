import axios, { InternalAxiosRequestConfig } from 'axios'

export const apiClient = axios.create({
  baseURL: process.env.REACT_APP_API_BASE,
})

apiClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = localStorage.getItem('access_token')
  if (token !== null) {
    config.headers.Authorization = `Bearer ${token}`
  }
  config.headers['Content-Type'] = 'application/json'
  return config
})
