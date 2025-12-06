import type { GetActionDetailsResponse } from '@area/shared/schemas/services.schema';
import { useState } from 'react';
import { useApp } from '@/hooks/useApp';

export const useGetActionDetails = () => {
  const { servicesClient } = useApp();
  const [action, setAction] = useState<GetActionDetailsResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchActionDetails = async (serviceName: string, actionName: string) => {
    setLoading(true);
    try {
      const actionDetails = await servicesClient.getActionDetails(serviceName, actionName);
      setAction(actionDetails);
    } catch (error) {
      console.error('Error fetching action details:', error);
    } finally {
      setLoading(false);
    }
  };

  return {
    action,
    loading,
    fetchActionDetails,
  };
};
