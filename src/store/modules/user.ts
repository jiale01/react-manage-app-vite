import { createSlice } from "@reduxjs/toolkit";
import type { Dispatch } from "@reduxjs/toolkit";
import { getToken, cacheToken, removeToken } from "@/utils";
import { loginApi, registerApi, type LoginFormData, type RegisterFormData, type ApiResponse, type LoginData } from "@/api/user";

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

export { fetchLogin, fetchRegister, setToken };

export default userReducer;