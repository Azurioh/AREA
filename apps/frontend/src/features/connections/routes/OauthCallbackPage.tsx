import type React from 'react';
import { useOAuthCallback } from '@/features/connections/hooks/useOAuthCallback';

const OAuthCallbackPage: React.FC = () => {
  useOAuthCallback();

  return null;
};

export default OAuthCallbackPage;
