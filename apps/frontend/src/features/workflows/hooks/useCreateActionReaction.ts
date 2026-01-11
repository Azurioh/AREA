import type { CreateAction, CreateReaction } from '@area/shared/schemas/actions-reactions.schema';
import { useState } from 'react';
import { toast } from 'sonner';
import { useApp } from '@/hooks/useApp';

export interface ParamOption {
  name: string;
  id: string;
}

export interface ActionReactionParam {
  key: string;
  label: string;
  placeholder: string;
  type: string;
  options?: ParamOption[];
  value: unknown;
}

export const useCreateActionReaction = () => {
  const { actionReactionClient } = useApp();

  const [action, setActionState] = useState<Omit<CreateAction, 'trigger'> | null>(null);
  const [reaction, setReactionState] = useState<Omit<CreateReaction, 'trigger'> | null>(null);
  const [loading, setLoading] = useState(false);

  const [selectedActionService, setSelectedActionService] = useState<string | null>(null);
  const [selectedReactionService, setSelectedReactionService] = useState<string | null>(null);

  const [actionParams, setActionParams] = useState<ActionReactionParam[]>([]);
  const [reactionParams, setReactionParams] = useState<ActionReactionParam[]>([]);

  const setAction = (service: string, actionData: Omit<CreateAction, 'trigger'>, params?: ActionReactionParam[]) => {
    const normalizedActionData = {
      ...actionData,
      service: actionData.service.toLowerCase(),
    };

    setActionState(normalizedActionData);
    setSelectedActionService(service);

    if (params) {
      setActionParams(params);
    }
  };

  const setReaction = (
    service: string,
    reactionData: Omit<CreateReaction, 'trigger'>,
    params?: ActionReactionParam[],
  ) => {
    const normalizedReactionData = {
      ...reactionData,
      service: reactionData.service.toLowerCase(),
    };

    setReactionState(normalizedReactionData);
    setSelectedReactionService(service);

    if (params) {
      setReactionParams(params);
    }
  };

  const createActionReaction = async (
    actionData: Omit<CreateAction, 'trigger'>,
    reactionData: Omit<CreateReaction, 'trigger'>,
  ) => {
    if (!actionData || !actionData.name) {
      toast.error('Please provide an action');
      return;
    }
    if (!reactionData || !reactionData.name) {
      toast.error('Please provide a reaction');
      return;
    }

    try {
      setLoading(true);

      const normalizedAction = {
        ...actionData,
        service: actionData.service.toLowerCase(),
      };

      const normalizedReaction = {
        ...reactionData,
        service: reactionData.service.toLowerCase(),
      };

      await actionReactionClient.createWorkflow({
        action: normalizedAction,
        reaction: normalizedReaction,
      });
      toast.success('Workflow created successfully');

      setActionState(null);
      setReactionState(null);
      setActionParams([]);
      setReactionParams([]);
      setSelectedActionService(null);
      setSelectedReactionService(null);
    } catch (err) {
      console.error(err);
      toast.error('Failed to create workflow.');
    } finally {
      setLoading(false);
    }
  };

  return {
    action,
    reaction,
    setAction,
    setReaction,
    createActionReaction,
    loading,
    selectedActionService,
    setSelectedActionService,
    selectedReactionService,
    setSelectedReactionService,
    actionParams,
    setActionParams,
    reactionParams,
    setReactionParams,
  };
};
