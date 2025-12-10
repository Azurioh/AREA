import { useState } from 'react';
import { useApp } from '@/hooks/useApp';

export const useAuthorization = () => {
  const { authorizationUrl } = useApp();
  const [authorizationState, setAuthorizationState] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (serviceName: string) => {
    setError(null);

    try {
      console.log('Starting authorization for service:', serviceName);
      const response = await authorizationUrl.getAuthorizationUrl(serviceName);
      console.log(response);
      if (!response) {
        return;
      }

      const popup = window.open(response.url, '', 'popup');

      window.addEventListener('oauth-ended', async (e: Event) => {
        const customEvent = e as CustomEvent<{ error?: boolean }>;

        setAuthorizationState(customEvent.detail.error ? 'error' : 'success');
        if (popup) {
          popup.close();
        }
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  return {
    authorizationState,
    setAuthorizationState,
    error,
    handleSubmit,
  };
};
