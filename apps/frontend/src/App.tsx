import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Toaster } from 'sonner';
import { AppRoutesPaths } from '@/enums/routes';
import { AdminDashboardPage } from '@/features/adminDashboard';
import { LoginPage, RegisterPage } from '@/features/auth';
import { HomePage } from '@/features/home';
import { Profile } from '@/features/profile';
import { CreateWorkflowsPage, WorkflowsPage } from '@/features/workflows';
import { AuthProvider } from './contexts/AuthContext';
import { ProtectedRoute } from './contexts/PorectedRoutes';
import { ThemeProvider } from './contexts/ThemeContext';
import { ConnectionsPage } from './features/connections/';
import { OauthCallbackPage } from '@/features/connections';
import { LandingPage } from '@/features/landing';

export default function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <Toaster position="top-center" richColors closeButton />
          <Routes>
            <Route path={AppRoutesPaths.REGISTER} element={<RegisterPage />} />
            <Route path={AppRoutesPaths.LOGIN} element={<LoginPage />} />
            <Route element={<ProtectedRoute />}>
              <Route path={AppRoutesPaths.ADMIN_DASHBOARD} element={<AdminDashboardPage />} />
              <Route path={AppRoutesPaths.PROFILE} element={<Profile />} />
              <Route path={AppRoutesPaths.HOME} element={<HomePage />} />
              <Route path={AppRoutesPaths.ADMIN_DASHBOARD} element={<AdminDashboardPage />} />
              <Route path={AppRoutesPaths.PROFILE} element={<Profile />} />
              <Route path={AppRoutesPaths.HOME} element={<HomePage />} />
              <Route path={AppRoutesPaths.WORKFLOWS} element={<WorkflowsPage />} />
              <Route path={AppRoutesPaths.CREATE} element={<CreateWorkflowsPage />} />
              <Route path={AppRoutesPaths.CONNECTIONS} element={<ConnectionsPage />} />
              <Route path={AppRoutesPaths.OAUTH_CALLBACK} element={<OauthCallbackPage />} />
              <Route path={AppRoutesPaths.LANDING} element={<LandingPage />} />
            </Route>
          </Routes>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}
