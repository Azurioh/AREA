import { UserRoles } from '@area/shared/enums/user-enums';
import { Navigate, Outlet } from 'react-router-dom';
import { AppRoutesPaths } from '@/enums/routes';
import { useApp } from '@/hooks/useApp';

export const ProtectedRoute = () => {
  const { authState } = useApp();

  if (!authState.isAuthenticated) {
    return <Navigate to={AppRoutesPaths.LANDING} replace />;
  }

  return <Outlet />;
};

export const AdminProtectedRoute = () => {
  const { authState } = useApp();

  if (!authState.isAuthenticated || authState.user?.role !== UserRoles.ADMIN) {
    return <Navigate to={AppRoutesPaths.HOME} replace />;
  }

  return <Outlet />;
};
