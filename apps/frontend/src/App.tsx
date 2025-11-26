import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { AppRoutesPaths } from '@/enums/routes';
import { LoginPage, RegisterPage } from '@/features/auth';
import ProfilePage from '@/features/profile/routes/Profile';
import { WebhookPage } from '@/features/webhook';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';

export default function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <Routes>
            <Route path={AppRoutesPaths.REGISTER} element={<RegisterPage />} />
            <Route path={AppRoutesPaths.LOGIN} element={<LoginPage />} />
            <Route path={AppRoutesPaths.HOME} element={<WebhookPage />} />
            <Route path={AppRoutesPaths.PROFILE} element={<ProfilePage />} />
          </Routes>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}
