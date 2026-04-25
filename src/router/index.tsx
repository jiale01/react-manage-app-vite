import Layout from "@/pages/Layout";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import Dashboard from "@/pages/Dashboard";
import { createBrowserRouter, type RouteObject } from "react-router-dom";
import { AuthRoute } from "@/components/AuthRoute";

// 定义路由配置类型
const routes: RouteObject[] = [
  {
    path: "/",
    element: <AuthRoute>
      <Layout />
    </AuthRoute>,
    children: [
      {
        index: true,
        element: <Dashboard />,
      },
      {
        path: "dashboard",
        element: <Dashboard />,
      },
      {
        path: "user/list",
        element: <div>用户列表页面</div>,
      },
      {
        path: "user/role",
        element: <div>角色管理页面</div>,
      },
      {
        path: "content",
        element: <div>内容管理页面</div>,
      },
      {
        path: "settings",
        element: <div>系统设置页面</div>,
      },
    ],
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
];

const router = createBrowserRouter(routes);

export default router;
