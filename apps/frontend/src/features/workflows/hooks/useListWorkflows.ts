import type { GetMeActionsReactions } from '@area/shared/schemas/actions-reactions.schema';
import { useState } from 'react';
import { useApp } from '@/hooks/useApp';

export function useListWorkflows() {
  const { actionReactionClient } = useApp();
  const [workflows, setWorkflows] = useState<GetMeActionsReactions>([]);
  const [loading, setLoading] = useState(false);

  const fetchWorkflows = async () => {
    try {
      setLoading(true);
      const response = await actionReactionClient.getAllWorkflows();

      if (!response) {
        return;
      }
      setWorkflows(response);
    } catch {
      // Error handled in ApiClient
    } finally {
      setLoading(false);
    }
  };

  return { workflows, loading, fetchWorkflows };
}
