import { createSlice } from "@reduxjs/toolkit";
import type { Dispatch } from "@reduxjs/toolkit";
import { getToken, cacheToken, removeToken } from "@/utils";
import { loginApi, registerApi, getUserInfoApi, type LoginFormData, type RegisterFormData, type ApiResponse, type LoginData } from "@/api/user";

export interface UserInfo {
  id: number;
  username: string;
  nickname: string;
  avatar?: string;
  email?: string;
  phone?: string;
  [key: string]: any;
}

export const userStore = createSlice({
  name: "user",
  initialState: {
    token: getToken() || '',
    userInfo: null as UserInfo | null,
  },
  reducers: {
    setToken: (state, action) => {
      state.token = action.payload;
      cacheToken(action.payload);
    },
    setUserInfo: (state, action) => {
      state.userInfo = action.payload;
    },
    clearUserInfo: (state) => {
      state.token = '';
      state.userInfo = null;
      removeToken();
    },
  },
});

const { setToken, setUserInfo, clearUserInfo } = userStore.actions;

const userReducer = userStore.reducer;

/**
 * 登录
 * @param loginForm - 登录表单数据 { username, password(已加密) }
 */
const fetchLogin = (loginForm: LoginFormData) => {
  return async (dispatch: Dispatch) => {
    // 调用登录 API，返回格式为 ApiResponse<LoginData>
    const response: ApiResponse<LoginData> = await loginApi(loginForm);

    // 从统一返回格式中获取 data，再获取 access_token
    dispatch(setToken(response.data.access_token));

    return response;
  }
};

/**
 * 注册
 * @param registerForm - 注册表单数据 { username, nickname, password(已加密) }
 */
const fetchRegister = (registerForm: RegisterFormData) => {
  return async () => {
    // 调用注册 API，返回格式为 ApiResponse
    const result: ApiResponse<any> = await registerApi(registerForm);
    return result;
  }
};

/**
 * 获取用户信息
 */
const fetchUserInfo = () => {
  return async (dispatch: Dispatch) => {
    try {
      // 调用获取用户信息 API
      const response: ApiResponse<UserInfo> = await getUserInfoApi();
      
      // 将用户信息存储到 store
      dispatch(setUserInfo(response.data));
      
      return response.data;
    } catch (error) {
      console.error('获取用户信息失败:', error);
      throw error;
    }
  }
};

export { fetchLogin, fetchRegister, fetchUserInfo, setToken, setUserInfo, clearUserInfo };

export default userReducer;