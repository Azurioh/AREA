import type { GetServiceActionsResponse } from '@area/shared/schemas/services.schema';
import { useState } from 'react';
import { useApp } from '@/hooks/useApp';

export const useListActions = () => {
  const { servicesClient } = useApp();
  const [actions, setActions] = useState<GetServiceActionsResponse>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchActions = async (serviceName: string) => {
    setLoading(true);
    try {
      const actions = await servicesClient.listServiceActions(serviceName);
      setActions(actions);
    } catch (error) {
      console.error('Error fetching actions:', error);
    } finally {
      setLoading(false);
    }
  };

  return {
    actions,
    loading,
    fetchActions,
  };
};
