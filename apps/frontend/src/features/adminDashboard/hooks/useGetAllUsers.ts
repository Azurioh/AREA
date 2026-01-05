import { useEffect, useState } from 'react';
import { useApp } from '@/hooks/useApp';
import type { GetAllUsers } from '@area/shared/schemas/users.schema';

export const useGetAllUsers = () => {
  const { userAdminManagementClient } = useApp();
  const [users, setUsers] = useState<GetAllUsers>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await userAdminManagementClient.getAllUsers();
      if (response) {
        setUsers(response);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [userAdminManagementClient]);

  return { users, loading, error, refetch: fetchUsers };
};
