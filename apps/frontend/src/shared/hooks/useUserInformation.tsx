import { useState, useEffect } from 'react';
import { UserInformationClient } from '../api/UserInformation';

/**
 * @function useUserInformation
 * @description Custom hook to fetch and manage user information
 *
 * @returns {object} User information, loading state, and initials getter
 */
export const useUserInformation = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const client = new UserInformationClient();
        const data = await client.getUserInformation();
        localStorage.setItem('userInitials', data.name.substring(0, 2).toUpperCase());
        setUser(data);
      } catch (error) {
        console.error('Failed to fetch user:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const getInitials = () => {
    if (!user?.name) {
        return '??';
    }
    return user.name.substring(0, 2).toUpperCase();
  };

  return { user, loading, getInitials };
};
