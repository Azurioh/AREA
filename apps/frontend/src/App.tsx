import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { AppRoutesPaths } from '@/enums/routes';
import { LoginPage, RegisterPage } from '@/features/auth';
import { Profile } from '@/features/profile';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { AdminDashboardPage } from '@/features/adminDashboard';
import { HomePage } from '@/features/home';
import { useApp } from './hooks/useApp';
import { ProtectedRoute } from './contexts/PorectedRoutes';

function AppRoutes() {
  const { authState } = useApp();

  return (
    <Routes>
      <Route path={AppRoutesPaths.REGISTER} element={<RegisterPage />} />
      <Route path={AppRoutesPaths.LOGIN} element={<LoginPage />} />
      <ProtectedRoute isAuthenticated={authState.isAuthenticated}>
        <Route path={AppRoutesPaths.ADMIN_DASHBOARD} element={ <AdminDashboardPage /> } />
        <Route path={AppRoutesPaths.PROFILE} element={ <Profile /> } />
        <Route path={AppRoutesPaths.HOME} element={ <HomePage /> } />
      </ProtectedRoute>
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}
