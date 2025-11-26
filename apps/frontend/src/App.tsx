import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { WebhookPage } from '@/features/webhook';
import ProfilePage  from '@/features/profile/routes/Profile';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { LoginPage, RegisterPage } from '@/features/Auth';
import { AppRoutesPaths } from '@/enums/routes';

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
