import Layout from "@/pages/Layout";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import Dashboard from "@/pages/Dashboard";
import ArticleCreate from "@/pages/Article/Create";
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
        path: "/article/list",
        element: <div>文章列表</div>,
      },
      {
        path: "/article/add",
        element: <ArticleCreate />,
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
