import { useEffect } from 'react';

/**
 * @function useClearUserData
 * @description Custom hook to clear user data from localStorage
 */
export const useClearUserData = () => {
  useEffect(() => {
    localStorage.removeItem('userInitials');
  }, []);
};
