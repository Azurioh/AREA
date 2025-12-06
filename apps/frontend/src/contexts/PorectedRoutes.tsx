import { Navigate, Outlet } from 'react-router-dom';
import { AppRoutesPaths } from '@/enums/routes';
import { useApp } from '@/hooks/useApp';

export const ProtectedRoute = () => {
  const { authState } = useApp();

  if (!authState.isAuthenticated) {
    return <Navigate to={AppRoutesPaths.LOGIN} replace />;
  }

  return <Outlet />;
};
