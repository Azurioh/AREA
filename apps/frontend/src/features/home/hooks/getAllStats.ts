import type { GetMeActionsReactions } from '@area/shared/schemas/actions-reactions.schema';
import { useEffect, useState, useMemo } from 'react';
import { useApp } from '@/hooks/useApp';

export function useListWorkflows() {
  const { actionReactionClient } = useApp();
  const [workflows, setWorkflows] = useState<GetMeActionsReactions>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
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

    fetchWorkflows();
  }, []);

  const stats = useMemo(() => {
    const totalWorkflows = workflows.length;
    const activeWorkflows = workflows.filter((workflow) => workflow.executionState === true).length;
    let totalActions = 0;
    for (const workflow of workflows) {
      totalActions += workflow.numberOfExecution || 0;
    }

    return {
      totalWorkflows,
      activeWorkflows,
      totalActions,
    };
  }, [workflows]);

  return {
    workflows,
    loading,
    setWorkflows,
    stats,
  };
}
