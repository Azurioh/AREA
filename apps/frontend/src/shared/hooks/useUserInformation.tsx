import type { GetUserMeResponse } from '@area/shared/schemas/user.schema';
import { useEffect, useState } from 'react';
import { useApp } from '@/hooks/useApp';

/**
 * @function useUserInformation
 * @description Custom hook to fetch and manage user information
 */
export const useUserInformation = () => {
  const { userInformationClient } = useApp();
  const [user, setUser] = useState<GetUserMeResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      const data = await userInformationClient.getUserInformation();

      if (data === undefined) {
        setLoading(false);
        return;
      }
      localStorage.setItem('userInitials', data.name.substring(0, 2).toUpperCase());
      setUser(data);
      setLoading(false);
    };

    fetchUser();
  }, [userInformationClient]);

  const getInitials = () => {
    if (!user?.name) {
      return '??';
    }
    return user.name.substring(0, 2).toUpperCase();
  };

  return { user, loading, getInitials };
};
