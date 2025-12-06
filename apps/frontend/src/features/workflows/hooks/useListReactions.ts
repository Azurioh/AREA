import type { GetServiceReactionsResponse } from '@area/shared/schemas/services.schema';
import { useState } from 'react';
import { useApp } from '@/hooks/useApp';

export const useListReactions = () => {
  const { servicesClient } = useApp();
  const [reactions, setReactions] = useState<GetServiceReactionsResponse>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchReactions = async (serviceName: string) => {
    setLoading(true);
    try {
      const reactions = await servicesClient.listServiceReactions(serviceName);
      setReactions(reactions);
    } catch (error) {
      console.error('Error fetching reactions:', error);
    } finally {
      setLoading(false);
    }
  };

  return {
    reactions,
    loading,
    fetchReactions,
  };
};
