import React from 'react';
import { useListReactions } from './useListReactions';
import { useApp } from '@/hooks/useApp';

export const useReactionSelector = () => {
  const { servicesClient } = useApp();
  const { reactions, loading, fetchReactions } = useListReactions();

  const [services, setServices] = React.useState<string[]>([]);
  const [selectedService, setSelectedService] = React.useState<string | null>(null);
  const [selectedReaction, setSelectedReaction] = React.useState<string | null>(null);
  const [params, setParams] = React.useState<any[]>([]);

  React.useEffect(() => {
    servicesClient.listServices().then(setServices);
  }, []);

  const selectService = (srv: string) => {
    setSelectedService(srv);
    setSelectedReaction(null);
    fetchReactions(srv);
  };

  const selectReaction = async (service: string, r: string) => {
    setSelectedReaction(r);
    const details = await servicesClient.getReactionDetails(service, r);
    setParams(details?.params?.map((p: any) => ({ ...p, value: '' })) ?? []);
  };

  const updateParam = (i: number, value: any) => {
    const newParams = [...params];
    newParams[i].value = value;
    setParams(newParams);
  };

  const toReactionData = () => {
    const paramData: Record<string, any> = {};
    for (const p of params) {
      paramData[p.key] = p.value;
    }

    return {
      service: selectedService?.toLowerCase() || '',
      name: selectedReaction || '',
      params: paramData,
    };
  };

  return {
    services,
    reactions,
    loading,
    selectedService,
    selectedReaction,
    params,
    selectService,
    selectReaction,
    updateParam,
    toReactionData,
  };
};
