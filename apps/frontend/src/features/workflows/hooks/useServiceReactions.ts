import { useState, useEffect } from 'react';
import { useApp } from '@/hooks/useApp';

interface ServiceReactionsData {
  [serviceName: string]: any[];
}

export function useServiceReactions(services: string[]) {
  const { servicesClient } = useApp();

  const [serviceReactions, setServiceReactions] = useState<ServiceReactionsData>({});
  const [loadingServices, setLoadingServices] = useState<string[]>([]);
  const [selectedReaction, setSelectedReaction] = useState<{ service: string; reaction: string } | null>(null);
  const [reactionParams, setReactionParams] = useState<any[]>([]);
  const [loadingParams, setLoadingParams] = useState(false);

  useEffect(() => {
    const fetchAllReactions = async () => {
      for (const service of services) {
        if (!serviceReactions[service]) {
          setLoadingServices((prev) => [...prev, service]);
          try {
            const reactions = await servicesClient.listServiceReactions(service);
            if (reactions) setServiceReactions((prev) => ({ ...prev, [service]: reactions }));
          } catch (error) {
            console.error(error);
          } finally {
            setLoadingServices((prev) => prev.filter((s) => s !== service));
          }
        }
      }
    };

    if (services.length > 0) fetchAllReactions();
  }, [services]);

  const selectReaction = async (service: string, reactionName: string) => {
    setSelectedReaction({ service, reaction: reactionName });
    setLoadingParams(true);
    try {
      const details = await servicesClient.getReactionDetails(service, reactionName);
      setReactionParams(details?.params?.map((p: any) => ({ ...p, value: '' })) ?? []);
    } catch {
      setReactionParams([]);
    } finally {
      setLoadingParams(false);
    }
  };

  const updateParam = (index: number, value: any) => {
    const newParams = [...reactionParams];
    newParams[index].value = value;
    setReactionParams(newParams);
  };

  return {
    serviceReactions,
    loadingServices,
    selectedReaction,
    reactionParams,
    loadingParams,
    selectReaction,
    updateParam,
    setSelectedReaction,
  };
}
