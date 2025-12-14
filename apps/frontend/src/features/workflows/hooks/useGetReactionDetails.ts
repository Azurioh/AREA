import type { GetReactionDetailsResponse } from '@area/shared/schemas/services.schema';
import { useState } from 'react';
import { useApp } from '@/hooks/useApp';

export const useGetReactionDetails = () => {
  const { servicesClient } = useApp();
  const [reaction, setReaction] = useState<GetReactionDetailsResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchReactionDetails = async (serviceName: string, reactionName: string) => {
    setLoading(true);
    try {
      const reactionDetails = await servicesClient.getReactionDetails(serviceName, reactionName);

      if (!reactionDetails) {
        return;
      }
      setReaction(reactionDetails);
    } catch (error) {
      console.error('Error fetching reaction details:', error);
    } finally {
      setLoading(false);
    }
  };

  return {
    reaction,
    loading,
    fetchReactionDetails,
  };
};
