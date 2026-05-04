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

export interface UserItem {
  id: number;
  username: string;
  nickname: string;
  email?: string;
  phone?: string;
  status: number; // 0-禁用 1-启用
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateUserDto {
  username: string;
  nickname: string;
  password: string;
  email?: string;
  phone?: string;
}

export interface UpdateUserDto {
  nickname?: string;
  email?: string;
  phone?: string;
  status?: number;
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

/**
 * 获取用户信息
 */
export const getUserInfoApi = () => {
  return request.get<ApiResponse<any>>('/api_v1/users/profile') as unknown as ApiResponse<any>;
};

/**
 * 获取用户列表（分页）
 * @param params - 查询参数 { page, size, username? }
 */
export const getUserList = (params: { page: number; size: number; username?: string }) => {
  return request.get<ApiResponse<{ list: UserItem[]; total: number }>>('/api_v1/users', { params }) as unknown as ApiResponse<{ list: UserItem[]; total: number }>;
};

/**
 * 获取单个用户详情
 * @param id - 用户ID
 */
export const getUserDetail = (id: number) => {
  return request.get<ApiResponse<UserItem>>(`/api_v1/users/${id}`) as unknown as ApiResponse<UserItem>;
};

/**
 * 创建用户
 * @param data - 用户数据
 */
export const createUser = (data: CreateUserDto) => {
  return request.post<ApiResponse<UserItem>>('/api_v1/users', data) as unknown as ApiResponse<UserItem>;
};

/**
 * 更新用户
 * @param id - 用户ID
 * @param data - 更新数据
 */
export const updateUser = (id: number, data: UpdateUserDto) => {
  return request.patch<ApiResponse<UserItem>>(`/api_v1/users/${id}`, data) as unknown as ApiResponse<UserItem>;
};

/**
 * 删除用户
 * @param id - 用户ID
 */
export const deleteUser = (id: number) => {
  return request.delete<ApiResponse<void>>(`/api_v1/users/${id}`) as unknown as ApiResponse<void>;
};
