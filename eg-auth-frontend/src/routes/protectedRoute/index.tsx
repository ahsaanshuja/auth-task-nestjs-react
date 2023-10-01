import { FC, ReactNode } from "react";
import { useCookies } from "react-cookie";
import { Navigate } from "react-router-dom";

const ProtectedRoute: FC<{ children: ReactNode }> = ({ children }) => {
  const [cookies] = useCookies(["user"]);

  if (!cookies?.user?.name) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
