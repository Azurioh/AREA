import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppRoutesPaths } from '@/enums/routes';
import { useApp } from '@/hooks/useApp';

export const useLogin = () => {
  const navigate = useNavigate();
  const { authClient, tokenManager } = useApp();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const formattedEmail = email.toLowerCase().trim();
    const formattedPassword = password.trim();
    const response = await authClient.login({ email: formattedEmail, password: formattedPassword, rememberMe });
    setIsLoading(false);
    if (response !== undefined) {
      await tokenManager.setToken(response.accessToken);
      navigate(AppRoutesPaths.HOME);
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
    handleSubmit,
  };
};
