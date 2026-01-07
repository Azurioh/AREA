import { useState } from 'react';
import { useApp } from '@/hooks/useApp';

export const useDeleteUser = () => {
  const { userAdminManagementClient } = useApp();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const deleteUser = async (userId: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      await userAdminManagementClient.deleteUser(userId);
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { deleteUser, loading, error };
};
