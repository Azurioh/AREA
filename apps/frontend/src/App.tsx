import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { WebhookPage } from '@/features/webhook';
import ProfilePage  from '@/features/profile/routes/Profile';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { LoginPage } from '@/features/Auth';

export default function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/" element={<WebhookPage />} />
            <Route path="/profile" element={<ProfilePage />} />
          </Routes>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}
