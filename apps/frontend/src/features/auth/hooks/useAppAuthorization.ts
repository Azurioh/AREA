import { useState } from 'react';
import { useApp } from '@/hooks/useApp';
import { AppRoutesPaths } from '@/enums/routes';
import { useNavigate } from 'react-router-dom';

export const useAppAuthorization = () => {
  const navigate = useNavigate();
  const { thirdPartiesInformation, authClient, tokenManager } = useApp();
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (service: string) => {
    setError(null);

    try {
      const response = await thirdPartiesInformation.getAuthorizationUrlApp(service);
      if (!response) {
        return;
      }

      if (response.url === 'no_oauth') {
        return;
      }

      const popup = window.open(response.url, '', 'popup');

      window.addEventListener('oauth-app-ended', async (e: Event) => {
        const customEvent = e as CustomEvent<{ code?: string; state?: string }>;

        if (popup) {
          popup.close();
        }
        if (customEvent.detail.code && customEvent.detail.state) {
          const response = await authClient.loginWithService(
            service.toLowerCase(),
            customEvent.detail.code,
            customEvent.detail.state,
          );

          if (response) {
            await tokenManager.setToken(response.accessToken);
            navigate(AppRoutesPaths.HOME);
          }
        } else {
          navigate(AppRoutesPaths.LOGIN);
        }
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  return {
    error,
    handleSubmit,
  };
};
