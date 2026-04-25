import { getToken } from "@/utils";
import { Navigate } from "react-router-dom";
import type { ReactNode } from 'react';

export const AuthRoute = ({ children }: { children: ReactNode }) => {
  if (getToken()) {
    return children;
  } else {
    return <Navigate to="/login" />;
  }
};
