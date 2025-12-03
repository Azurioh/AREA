import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { AppRoutesPaths } from '@/enums/routes';
import { LoginPage, RegisterPage } from '@/features/auth';
import { Profile } from '@/features/profile';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { AdminDashboardPage } from '@/features/adminDashboard';
import { HomePage } from '@/features/home';
import { useApp } from './hooks/useApp';

function AppRoutes() {
  const { authState } = useApp();

  return (
    <Routes>
      <Route path={AppRoutesPaths.REGISTER} element={<RegisterPage />} />
      <Route path={AppRoutesPaths.LOGIN} element={<LoginPage />} />
      <Route
        path={AppRoutesPaths.ADMIN_DASHBOARD}
        element={authState.isAuthenticated ? <AdminDashboardPage /> : <LoginPage />}
      />
      <Route
        path={AppRoutesPaths.PROFILE}
        element={authState.isAuthenticated ? <Profile /> : <LoginPage />}
      />
      <Route
        path={AppRoutesPaths.HOME}
        element={authState.isAuthenticated ? <HomePage /> : <LoginPage />}
      />
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
