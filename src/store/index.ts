import userReducer from "./modules/user";
import flowReducer from "./modules/flow";
import { configureStore } from "@reduxjs/toolkit";

const store = configureStore({
  reducer: {
    user: userReducer,
    flow: flowReducer,
  },
});

// 导出类型以便在组件中使用
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;