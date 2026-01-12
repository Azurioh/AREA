import { useCallback, useState } from 'react';
import { useApp } from '@/hooks/useApp';

type PendingStates = Record<string, boolean>;

export const useToggleExecutionState = () => {
  const { executionStateClient } = useApp();
  const [pending, setPending] = useState<PendingStates>({});

  const toggleExecutionState = useCallback(
    async (workflowId: string, nextState: boolean) => {
      setPending((prev) => ({ ...prev, [workflowId]: true }));

      try {
        await executionStateClient.updateExecutionState(workflowId, nextState);
      } finally {
        setPending((prev) => {
          const rest = { ...prev };
          delete rest[workflowId];
          return rest;
        });
      }
    },
    [executionStateClient],
  );

  const isUpdating = useCallback((workflowId: string) => Boolean(pending[workflowId]), [pending]);

  return { toggleExecutionState, isUpdating };
};
