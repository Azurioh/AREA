import { Navigate } from 'react-router-dom';
import { AppRoutesPaths } from '@/enums/routes';

type ProtectedRouteProps = {
  isAuthenticated: boolean;
  children: React.ReactNode;
};

export const ProtectedRoute = ({ isAuthenticated, children }: ProtectedRouteProps) => {
  if (!isAuthenticated) {
    return <Navigate to={AppRoutesPaths.LOGIN} replace />;
  }

  return <>{children}</>;
};
