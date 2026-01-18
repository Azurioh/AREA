import { useCallback, useState } from 'react';
import { useApp } from '@/hooks/useApp';

interface UseDeleteActionReactionResult {
  deleteById: (id?: string) => Promise<void>;
  isLoading: boolean;
  error: unknown;
}

export function useDeleteActionReaction(): UseDeleteActionReactionResult {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<unknown>(null);

  const { actionReactionClient } = useApp();

  const deleteById = useCallback(
    async (id?: string) => {
      if (!id) return;

      setIsLoading(true);
      setError(null);

      try {
        await actionReactionClient.deleteWorkflow(id);
      } catch (err) {
        setError(err);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [actionReactionClient],
  );

  return {
    deleteById,
    isLoading,
    error,
  };
}
