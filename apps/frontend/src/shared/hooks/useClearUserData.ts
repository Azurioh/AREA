import { useEffect } from 'react';

export const useClearUserData = () => {
  useEffect(() => {
    localStorage.removeItem('userInitials');
  }, []);
};
