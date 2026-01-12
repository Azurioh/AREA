import { useContext } from 'react';
import { AuthContext, type AuthContextType } from '@/contexts/AuthContext';

export const useApp = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AuthProvider');
  }
  return context;
};
