import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LoginClient } from '@/features/auth/api/LoginClient';
import { AppRoutesPaths } from '@/enums/routes';
import { useApp } from '@/hooks/useApp';

export const useLogin = () => {
  const navigate = useNavigate();
  const { tokenManager } = useApp();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loginClient = new LoginClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await loginClient.login(email, password, rememberMe);

      if (response.accessToken) {
        const refreshToken = response.refreshToken || response.accessToken;
        tokenManager.setTokens(response.accessToken, refreshToken);

        navigate(AppRoutesPaths.HOME);
      } else {
        setError('No access token received from server');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    email,
    setEmail,
    password,
    setPassword,
    rememberMe,
    setRememberMe,
    isLoading,
    error,
    handleSubmit,
  };
};
