import type { CreateAction, CreateReaction } from '@area/shared/schemas/action-reaction.schema';
import { useState } from 'react';
import { toast } from 'sonner';
import { useApp } from '@/hooks/useApp';

export const useCreateActionReaction = () => {
  const { actionReactionClient } = useApp();

  const [loading, setLoading] = useState<boolean>(false);
  const [action, setAction] = useState<Omit<CreateAction, 'trigger'> | null>(null);
  const [reaction, setReaction] = useState<Omit<CreateReaction, 'trigger'> | null>(null);

  const setActionParams = (params: Record<string, unknown>) => {
    if (action) {
      setAction({ ...action, params });
    }
  };

  const setReactionParams = (params: Record<string, unknown>) => {
    if (reaction) {
      setReaction({ ...reaction, params });
    }
  };

  const createActionReaction = async () => {
    if (!action) {
      toast.error('Please provide an action');
      return;
    }
    if (!reaction) {
      toast.error('Please provide a reaction');
      return;
    }
    try {
      setLoading(true);
      await actionReactionClient.createWorkflow({ action, reaction });
      toast.success('Workflow created successfully');
    } catch (error) {
      toast.error(`Failed to create workflow: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    action,
    reaction,
    setAction,
    setActionParams,
    setReaction,
    setReactionParams,
    createActionReaction,
  };
};
