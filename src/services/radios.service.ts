import axios from 'axios'
import type { InternalAxiosRequestConfig } from 'axios'
import type { RadioStation } from '../types/radio.stations'

export const radioStationsApi = axios.create({
  baseURL: '/api/stations',
})

// Añade el token de autenticación en el request
radioStationsApi.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    if (!config.headers.Authorization) {
      const token = localStorage.getItem('auth-token')
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

export const searchStations = (limit: number = 2000, offset: number = 0) => {
  return radioStationsApi.get<Array<RadioStation>>(
    `/search?limit=${limit}&offset=${offset}`,
  )
}
