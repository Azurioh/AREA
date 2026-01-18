import { useEffect, useRef } from 'react';

export const useOAuthAppCallback = () => {
  const hasRun = useRef(false);

  useEffect(() => {
    if (hasRun.current) {
      return;
    }

    const handleMount = async () => {
      const searchParams = new URLSearchParams(window.location.search);

      if (searchParams.has('state') && searchParams.has('code')) {
        const code = searchParams.get('code');
        const state = searchParams.get('state');

        window.opener.dispatchEvent(new CustomEvent('oauth-app-ended', { detail: { code, state } }));
        hasRun.current = true;
      }
    };

    handleMount();
  }, []);
};
