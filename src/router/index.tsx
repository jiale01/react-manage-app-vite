import Layout from "@/pages/Layout";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import { createBrowserRouter, type RouteObject } from "react-router-dom";

// 定义路由配置类型
const routes: RouteObject[] = [
  {
    path: "/",
    element: <Layout />,
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
