import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { AppRoutesPaths } from '@/enums/routes';
import { AdminDashboardPage } from '@/features/adminDashboard';
import { LoginPage, RegisterPage } from '@/features/auth';
import { HomePage } from '@/features/home';
import { Profile } from '@/features/profile';
import { AuthProvider } from './contexts/AuthContext';
import { ProtectedRoute } from './contexts/PorectedRoutes';
import { ThemeProvider } from './contexts/ThemeContext';
import { CreateWorkflowsPage } from '@/features/workflows';

export default function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <Routes>
            <Route path={AppRoutesPaths.REGISTER} element={<RegisterPage />} />
            <Route path={AppRoutesPaths.LOGIN} element={<LoginPage />} />
            <Route element={<ProtectedRoute />}>
              <Route path={AppRoutesPaths.ADMIN_DASHBOARD} element={<AdminDashboardPage />} />
              <Route path={AppRoutesPaths.PROFILE} element={<Profile />} />
              <Route path={AppRoutesPaths.HOME} element={<HomePage />} />
              <Route path={AppRoutesPaths.CREATE} element={<CreateWorkflowsPage />} />
            </Route>
          </Routes>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}
