import { BrowserRouter, Route, Routes, Outlet } from 'react-router-dom';
import { Toaster } from 'sonner';
import { AppRoutesPaths } from '@/enums/routes';
import { AdminDashboardPage } from '@/features/adminDashboard';
import { LoginPage, RegisterPage } from '@/features/auth';
import { HomePage } from '@/features/home';
import { Profile } from '@/features/profile';
import { CreateWorkflowsPage, WorkflowsPage, ChooseAction, ChooseReaction } from '@/features/workflows';
import { ActionReactionProvider } from '@/features/workflows/context/ActionReactionContext';
import { AuthProvider } from './contexts/AuthContext';
import { ProtectedRoute, AdminProtectedRoute } from './contexts/PorectedRoutes';
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
            <Route path={AppRoutesPaths.LANDING} element={<LandingPage />} />
            <Route element={<ProtectedRoute />}>
              <Route element={<AdminProtectedRoute />}>
                <Route path={AppRoutesPaths.ADMIN_DASHBOARD} element={<AdminDashboardPage />} />
              </Route>
              <Route path={AppRoutesPaths.ADMIN_DASHBOARD} element={<AdminDashboardPage />} />
              <Route path={AppRoutesPaths.PROFILE} element={<Profile />} />
              <Route path={AppRoutesPaths.HOME} element={<HomePage />} />
              <Route path={AppRoutesPaths.PROFILE} element={<Profile />} />
              <Route path={AppRoutesPaths.HOME} element={<HomePage />} />
              <Route path={AppRoutesPaths.CONNECTIONS} element={<ConnectionsPage />} />
              <Route path={AppRoutesPaths.OAUTH_CALLBACK} element={<OauthCallbackPage />} />
              <Route
                element={
                  <ActionReactionProvider>
                    <Outlet />
                  </ActionReactionProvider>
                }
              >
                <Route path={AppRoutesPaths.WORKFLOWS} element={<WorkflowsPage />} />
                <Route path={AppRoutesPaths.CREATE} element={<CreateWorkflowsPage />} />
                <Route path={AppRoutesPaths.CHOOSEACTION} element={<ChooseAction />} />
                <Route path={AppRoutesPaths.CHOOSEREACTION} element={<ChooseReaction />} />
              </Route>
            </Route>
          </Routes>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}
