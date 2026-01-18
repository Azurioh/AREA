import type React from 'react';
import { useOAuthServiceCallback } from '@/features/connections/hooks/useOAuthServiceCallback';

const OAuthServiceCallbackPage: React.FC = () => {
  useOAuthServiceCallback();

  return null;
};

export default OAuthServiceCallbackPage;
