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

export const AdminProtectedRoute = () => {
  const { authState } = useApp();

  console.log('Auth State in AdminProtectedRoute:', authState.user?.role);
  if (!authState.isAuthenticated || authState.user?.role !== 1) {
    return <Navigate to={AppRoutesPaths.HOME} replace />;
  }

  return <Outlet />;
}
