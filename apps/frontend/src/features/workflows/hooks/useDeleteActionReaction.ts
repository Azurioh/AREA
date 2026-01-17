import { useCallback, useState } from 'react';
import { deleteActionReaction } from '@/features/workflows/api/deleteActionReaction';

interface UseDeleteActionReactionResult {
  deleteById: (id?: string) => Promise<void>;
  isLoading: boolean;
  error: unknown;
}

export function useDeleteActionReaction(): UseDeleteActionReactionResult {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<unknown>(null);

  const deleteById = useCallback(async (id?: string) => {
    if (!id) return;

    setIsLoading(true);
    setError(null);

    try {
      await deleteActionReaction(id);
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    deleteById,
    isLoading,
    error,
  };
}
