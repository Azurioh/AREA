import type React from 'react';
import { useEffect } from 'react';
import { useOauthCallback } from '../hooks/useOauthCallback';

const OauthCallback: React.FC = () => {
  const { handleMount } = useOauthCallback();

  useEffect(() => {
    handleMount();
  }, []);

  return null;
};

export default OauthCallback;
