import { lazy, Suspense } from 'react';
import { BrowserRouter, Outlet, Route, Routes } from 'react-router-dom';
import { Toaster } from 'sonner';
import { ErrorBoundary, RouteErrorBoundary } from '@/components/ErrorBoundary';
import { AppRoutesPaths } from '@/enums/routes';
import { ActionReactionProvider } from '@/features/workflows/context/ActionReactionContext';
import { LoadingScreen } from './components/LoadingScreen';
import { AuthProvider } from './contexts/AuthContext';
import { AdminProtectedRoute, ProtectedRoute } from './contexts/ProtectedRoutes';
import { ThemeProvider } from './contexts/ThemeContext';
import { ReloadProvider } from './contexts/ReloadContext';

const LoginPage = lazy(() => import('@/features/auth/routes/LoginPage'));
const RegisterPage = lazy(() => import('@/features/auth/routes/RegisterPage'));
const LandingPage = lazy(() => import('@/features/landing/routes/LandingPage'));
const HomePage = lazy(() => import('@/features/home/routes/Home'));
const Privacy = lazy(() => import('@/features/privacy/routes/Privacy'));
const Terms = lazy(() => import('@/features/terms/routes/Terms'));
const AdminDashboardPage = lazy(() => import('@/features/adminDashboard/routes/AdminDashboardPage'));
const ConnectionsPage = lazy(() => import('@/features/connections/routes/ConnectionsPage'));
const OAuthServiceCallbackPage = lazy(() => import('@/features/connections/routes/OAuthServiceCallbackPage'));
const OAuthAppCallbackPage = lazy(() => import('@/features/auth/routes/OAuthAppCallbackPage'));
const WorkflowsPage = lazy(() => import('@/features/workflows/routes/WorkflowPage'));
const CreateWorkflowsPage = lazy(() => import('@/features/workflows/routes/CreateWorkflowsPage'));
const ChooseAction = lazy(() => import('@/features/workflows/routes/ChooseAction'));
const ChooseReaction = lazy(() => import('@/features/workflows/routes/ChooseReaction'));

/**
 * Layout component that wraps all protected routes with error boundary
 */
const ProtectedLayout = () => (
  <RouteErrorBoundary>
    <Outlet />
  </RouteErrorBoundary>
);

export default function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <ThemeProvider>
          <AuthProvider>
            <ReloadProvider>
              <Toaster position="top-center" richColors closeButton />
              <Suspense fallback={<LoadingScreen />}>
                <Routes>
                  <Route path={AppRoutesPaths.REGISTER} element={<RegisterPage />} />
                  <Route path={AppRoutesPaths.LOGIN} element={<LoginPage />} />
                  <Route path={AppRoutesPaths.LANDING} element={<LandingPage />} />
                  <Route path={AppRoutesPaths.PRIVACY} element={<Privacy />} />
                  <Route path={AppRoutesPaths.TERMS} element={<Terms />} />
                  <Route path={AppRoutesPaths.OAUTH_CALLBACK_APP} element={<OAuthAppCallbackPage />} />

                  <Route element={<ProtectedRoute />}>
                    <Route element={<ProtectedLayout />}>
                      <Route element={<AdminProtectedRoute />}>
                        <Route path={AppRoutesPaths.ADMIN_DASHBOARD} element={<AdminDashboardPage />} />
                      </Route>

                      <Route path={AppRoutesPaths.HOME} element={<HomePage />} />
                      <Route path={AppRoutesPaths.CONNECTIONS} element={<ConnectionsPage />} />
                      <Route path={AppRoutesPaths.OAUTH_CALLBACK_SERVICE} element={<OAuthServiceCallbackPage />} />

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
                  </Route>
                </Routes>
              </Suspense>
            </ReloadProvider>
          </AuthProvider>
        </ThemeProvider>
      </BrowserRouter>
    </ErrorBoundary>
  );
}
