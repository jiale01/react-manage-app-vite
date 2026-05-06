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
const Flow = lazy(() => import("@/pages/Flow"));
const UserList = lazy(() => import("@/pages/User/List"));
const BlogList = lazy(() => import("@/pages/Blog/List"));
const BlogDetail = lazy(() => import("@/pages/Blog/Detail"));

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
        element: <Suspense fallback={<div>Loading...</div>}><Flow /></Suspense>,
      },
      {
        path: "user",
        children: [
          {
            index: true,
            element: <Suspense fallback={<div>Loading...</div>}><UserList /></Suspense>,
          },
          {
            path: "list",
            element: <Suspense fallback={<div>Loading...</div>}><UserList /></Suspense>,
          },
        ],
      }
    ],
  },
  {
    path: "/blog",
    element: <Suspense fallback={<div className="flex items-center justify-center h-screen"><div className="animate-pulse text-gray-400">Loading...</div></div>}><BlogList /></Suspense>,
  },
  {
    path: "/blog/:id",
    element: <Suspense fallback={<div className="flex items-center justify-center h-screen"><div className="animate-pulse text-gray-400">Loading...</div></div>}><BlogDetail /></Suspense>,
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
