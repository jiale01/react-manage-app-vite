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
const FlowCreate = lazy(() => import("@/pages/Flow/Create"));
const FlowList = lazy(() => import("@/pages/Flow/List"));

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
        path: "article",
        children: [
          {
            index: true,
            element: <Suspense fallback={<div>Loading...</div>}><ArticleList /></Suspense>,
          },
          {
            path: "list",
            element: <Suspense fallback={<div>Loading...</div>}><ArticleList /></Suspense>,
          },
          {
            path: "create",
            element: <Suspense fallback={<div>Loading...</div>}><ArticleCreate /></Suspense>,
          },
        ],
      },
      {
        path: "flow",
        children: [
          {
            index: true,
            element: <Suspense fallback={<div>Loading...</div>}><FlowList /></Suspense>,
          },
          {
            path: "list",
            element: <Suspense fallback={<div>Loading...</div>}><FlowList /></Suspense>,
          },
          {
            path: "create",
            element: <Suspense fallback={<div>Loading...</div>}><FlowCreate /></Suspense>,
          },
        ]
      }
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
