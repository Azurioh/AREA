import { useEffect } from 'react';

export const useOAuthServiceCallback = () => {
  useEffect(() => {
    const handleMount = async () => {
      const searchParams = new URLSearchParams(window.location.search);

      if (searchParams.has('status')) {
        const status = searchParams.get('status');

        window.opener.dispatchEvent(new CustomEvent('oauth-service-ended', { detail: { error: status === 'error' } }));
      }
    };

    handleMount();
  }, []);
};
