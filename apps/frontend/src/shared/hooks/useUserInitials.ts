import { useEffect } from 'react';
import { useUserInformation } from './useUserInformation';

export const useUserInitials = () => {
  const { getInitials, user } = useUserInformation();
  const initials = localStorage.getItem('userInitials') || getInitials();

  useEffect(() => {
    if (user?.name) {
      const userInitials = user.name.substring(0, 2).toUpperCase();
      localStorage.setItem('userInitials', userInitials);
    }
  }, [user]);

  return initials;
};
