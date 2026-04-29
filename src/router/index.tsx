import Layout from "@/pages/Layout";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
// import Dashboard from "@/pages/Dashboard";
// import ArticleCreate from "@/pages/Article/Create";
// import ArticleList from "@/pages/Article/List";
import { createBrowserRouter, type RouteObject } from "react-router-dom";
import { AuthRoute } from "@/components/AuthRoute";
import { lazy, Suspense } from "react";

const Dashboard = lazy(() => import("@/pages/Dashboard"));
const ArticleCreate = lazy(() => import("@/pages/Article/Create"));
const ArticleList = lazy(() => import("@/pages/Article/List"));

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
        element: <Suspense fallback={<div>Loading...</div>}><Dashboard /></Suspense>,
      },
      {
        path: "dashboard",
        element: <Suspense fallback={<div>Loading...</div>}><Dashboard /></Suspense>,
      },
      {
        path: "/article/list",
        element: <Suspense fallback={<div>Loading...</div>}><ArticleList /></Suspense>,
      },
      {
        path: "/article/create",
        element: <Suspense fallback={<div>Loading...</div>}><ArticleCreate /></Suspense>,
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
