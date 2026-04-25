import { createSlice } from "@reduxjs/toolkit";
import type { Dispatch } from "@reduxjs/toolkit";
import { request } from "@/utils";
import { getToken, cacheToken, removeToken } from "@/utils";

export const userStore = createSlice({
  name: "user",
  initialState: {
    token: getToken() || '',
  },
  reducers: {
    setToken: (state, action) => {
      state.token = action.payload;
      cacheToken(action.payload);
    },
  },
});

const { setToken } = userStore.actions;

const userReducer = userStore.reducer;

// 定义用户相关的类型接口
interface LoginFormData {
  username: string;
  password: string;
}

interface RegisterFormData {
  username: string;
  nickname: string;
  password: string;
}

interface LoginResponse {
  access_token: string;
  user?: any;
}

/**
 * 登录
 * @param loginForm - 登录表单数据 { username, password(已加密) }
 */
const fetchLogin = (loginForm: LoginFormData) => {
  return async (dispatch: Dispatch) => {
    // 后端返回的是 { access_token, user }
    const { data } = await request.post<LoginResponse>('/api_v1/users/login', loginForm);

    // 注意: 后端返回的是 access_token,不是 token
    dispatch(setToken(data.access_token));

    return data;
  }
};

/**
 * 注册
 * @param registerForm - 注册表单数据 { username, nickname, password(已加密) }
 */
const fetchRegister = (registerForm: RegisterFormData) => {
  return async () => {
    // 调用注册接口,后端会解密密码并进行 bcrypt 哈希后存储
    const result = await request.post('/api_v1/users/register', registerForm);
    return result;
  }
};

export { fetchLogin, fetchRegister, setToken };

export default userReducer;