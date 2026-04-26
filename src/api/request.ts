import axios from "axios";
import router from "@/router";
import { getToken, removeToken } from "@/utils/token";

const request = axios.create({
  // 从环境变量中读取 API 基础路径
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
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