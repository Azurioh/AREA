import React from 'react';
import { useListActions } from './useListActions';
import { useApp } from '@/hooks/useApp';

export const useActionSelector = () => {
  const { servicesClient } = useApp();
  const { actions, loading, fetchActions } = useListActions();

  const [services, setServices] = React.useState<string[]>([]);
  const [selectedService, setSelectedService] = React.useState<string | null>(null);
  const [selectedAction, setSelectedAction] = React.useState<string | null>(null);
  const [params, setParams] = React.useState<any[]>([]);

  React.useEffect(() => {
    servicesClient.listServices().then(setServices);
  }, []);

  const selectService = (srv: string) => {
    setSelectedService(srv);
    setSelectedAction(null);
    fetchActions(srv);
  };

  const selectAction = async (service: string, action: string) => {
    setSelectedAction(action);
    const details = await servicesClient.getActionDetails(service, action);
    setParams(details?.params?.map((p: any) => ({ ...p, value: '' })) ?? []);
  };

  const updateParam = (i: number, value: any) => {
    const newParams = [...params];
    newParams[i].value = value;
    setParams(newParams);
  };

  const toActionData = () => {
    const paramData: Record<string, any> = {};
    for (const p of params) {
      paramData[p.key] = p.value;
    }

    return {
      service: selectedService?.toLowerCase() || '',
      name: selectedAction || '',
      params: paramData,
    };
  };

  return {
    services,
    actions,
    loading,
    selectedService,
    selectedAction,
    params,
    selectService,
    selectAction,
    updateParam,
    toActionData,
  };
};
