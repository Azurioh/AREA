import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { AppRoutesPaths } from '@/enums/routes';
import { LoginPage, RegisterPage } from '@/features/auth';
import { Profile } from '@/features/profile';
import { WebhookPage } from '@/features/webhook';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { AdminDashboardPage } from '@/features/adminDashboard';
import { HomePage } from '@/features/home';

export default function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <Routes>
            <Route path={AppRoutesPaths.REGISTER} element={<RegisterPage />} />
            <Route path={AppRoutesPaths.LOGIN} element={<LoginPage />} />
            <Route path={AppRoutesPaths.ADMIN_DASHBOARD} element={<AdminDashboardPage />} />
            <Route path={AppRoutesPaths.PROFILE} element={<Profile />} />
            <Route path={AppRoutesPaths.HOME} element={<HomePage />} />
          </Routes>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}
