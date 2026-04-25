import axios from "axios";
import router from "@/router";
import { getToken, removeToken } from "@/utils/token";

const request = axios.create({
  // 开发环境使用相对路径,通过代理转发到后端
  // 生产环境需要修改为实际的后端地址
  baseURL: import.meta.env.MODE === 'production'
    ? 'http://localhost:3000/api' // 生产环境的后端地址
    : '/api', // 开发环境使用空字符串,走代理
  timeout: 5000
});


request.interceptors.request.use(
  config => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

request.interceptors.response.use(
  result => {
    return result.data

  },
  error => {
    // if (error.response?.status === 401) {
    //   removeToken()
    //   router.navigate('/login')
    //   window.location.reload()
    // }
    return Promise.reject(error)
  }
)

export { request }