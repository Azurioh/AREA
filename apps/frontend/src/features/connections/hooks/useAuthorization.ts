import { useState } from 'react';
import { AuthorizationUrl } from '../api/AuthorizationUrl';

export const useAuthorization = () => {
  const [authorizationState, setAuthorizationState] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const authorizationUrl = new AuthorizationUrl();

  const handleSubmit = async (serviceName: string) => {
    setError(null);

    try {
      const response = await authorizationUrl.get(serviceName);

      if (response.url) {
        const popup = window.open(response.url, '', 'popup');

        window.addEventListener('oauth-ended', async (e: Event) => {
          const customEvent = e as CustomEvent<{ error?: boolean }>;

          setAuthorizationState(customEvent.detail.error ? 'error' : 'success');
          if (popup) {
            popup.close();
          }
        });
      }
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
