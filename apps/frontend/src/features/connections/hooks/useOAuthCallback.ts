import { useEffect } from 'react';

export const useOAuthCallback = () => {
  useEffect(() => {
    const handleMount = async () => {
      const searchParams = new URLSearchParams(window.location.search);

      if (searchParams.has('status')) {
        const status = searchParams.get('status');

        window.opener.dispatchEvent(new CustomEvent('oauth-ended', { detail: { error: status === 'error' } }));
      }
    };

    handleMount();
  }, []);
};
