import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { AppRoutesPaths } from '@/enums/routes';
import { useApp } from '@/hooks/useApp';

export const useRegister = () => {
  const navigate = useNavigate();
  const { authClient } = useApp();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      setIsLoading(false);
      return;
    }
    const formattedEmail = email.toLowerCase().trim();
    const formattedName = name.trim();
    const formattedPassword = password.trim();
    const response = await authClient.register({
      name: formattedName,
      email: formattedEmail,
      password: formattedPassword,
    });
    setIsLoading(false);

    if (response !== undefined) {
      navigate(AppRoutesPaths.LOGIN);
    }
  };

  return {
    name,
    setName,
    email,
    setEmail,
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    isLoading,
    error,
    handleSubmit,
  };
};
