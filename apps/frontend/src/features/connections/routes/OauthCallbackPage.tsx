import type React from 'react';
import { useEffect } from 'react';
import { useOauthCallback } from '../hooks/useOauthCallback';

const OauthCallbackPage: React.FC = () => {
  const { handleMount } = useOauthCallback();

  useEffect(() => {
    handleMount();
  }, [handleMount]);

  return null;
};

export default OauthCallbackPage;
