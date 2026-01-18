import type React from 'react';
import { useOAuthAppCallback } from '@/features/auth/hooks/useOAuthAppCallback';

const OAuthAppCallbackPage: React.FC = () => {
  useOAuthAppCallback();

  return null;
};

export default OAuthAppCallbackPage;
