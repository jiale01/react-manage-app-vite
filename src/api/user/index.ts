import { request } from '../request';

// 后端统一返回格式
export interface ApiResponse<T = any> {
  code: number;
  message: string;
  data: T;
  timestamp: number;
}

// 定义用户相关的类型接口
export interface LoginFormData {
  username: string;
  password: string;
}

export interface RegisterFormData {
  username: string;
  nickname: string;
  password: string;
}

export interface LoginData {
  access_token: string;
  user?: any;
}

/**
 * 用户登录
 * @param loginForm - 登录表单数据 { username, password(已加密) }
 */
export const loginApi = (loginForm: LoginFormData) => {
  return request.post<ApiResponse<LoginData>>('/api_v1/users/login', loginForm) as unknown as ApiResponse<LoginData>;
};

/**
 * 用户注册
 * @param registerForm - 注册表单数据 { username, nickname, password(已加密) }
 */
export const registerApi = (registerForm: RegisterFormData) => {
  return request.post<ApiResponse<any>>('/api_v1/users/register', registerForm) as unknown as ApiResponse<any>;
};
