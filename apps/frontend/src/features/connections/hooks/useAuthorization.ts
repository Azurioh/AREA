import { useState } from 'react';
import { useApp } from '@/hooks/useApp';
import { useReload } from '@/hooks/useReload';

export const useAuthorization = () => {
  const { thirdPartiesInformation } = useApp();
  const { triggerServiceConnectionReload } = useReload();
  const [authorizationState, setAuthorizationState] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (serviceName: string) => {
    setError(null);

    try {
      const response = await thirdPartiesInformation.getAuthorizationUrl(serviceName);

      if (!response) {
        return;
      }

      if (response.url === 'no_oauth') {
        setAuthorizationState('success');
        return;
      }

      const popup = window.open(response.url, '', 'popup');

      window.addEventListener('oauth-ended', async (e: Event) => {
        const customEvent = e as CustomEvent<{ error?: boolean }>;

        setAuthorizationState(customEvent.detail.error ? 'error' : 'success');
        triggerServiceConnectionReload();
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
    error,
    handleSubmit,
  };
};
