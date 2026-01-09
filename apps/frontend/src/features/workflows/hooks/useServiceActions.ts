import { useEffect, useState } from 'react';
import { useApp } from '@/hooks/useApp';

interface ServiceActionsData {
  [serviceName: string]: unknown[];
}

export function useServiceActions(services: string[]) {
  const { servicesClient } = useApp();

  const [serviceActions, setServiceActions] = useState<ServiceActionsData>({});
  const [loadingServices, setLoadingServices] = useState<string[]>([]);
  const [selectedAction, setSelectedAction] = useState<{ service: string; action: string } | null>(null);
  const [actionParams, setActionParams] = useState<Record<string, unknown>[]>([]);
  const [loadingParams, setLoadingParams] = useState(false);

  useEffect(() => {
    const fetchAllActions = async () => {
      for (const service of services) {
        if (!serviceActions[service]) {
          setLoadingServices((prev) => [...prev, service]);
          try {
            const actions = await servicesClient.listServiceActions(service);
            if (actions) {
              setServiceActions((prev) => ({ ...prev, [service]: actions }));
            }
          } catch (error) {
            console.error(error);
          } finally {
            setLoadingServices((prev) => prev.filter((s) => s !== service));
          }
        }
      }
    };

    if (services.length > 0) {
      fetchAllActions();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [services]);

  const selectAction = async (service: string, actionName: string) => {
    setSelectedAction({ service, action: actionName });
    setLoadingParams(true);

    try {
      const details = await servicesClient.getActionDetails(service, actionName);
      setActionParams(details?.params?.map((p: Record<string, unknown>) => ({ ...p, value: '' })) ?? []);
    } catch {
      setActionParams([]);
    } finally {
      setLoadingParams(false);
    }
  };

  const updateParam = (index: number, value: unknown) => {
    const newParams = [...actionParams];
    newParams[index].value = value;
    setActionParams(newParams);
  };

  return {
    serviceActions,
    loadingServices,
    selectedAction,
    actionParams,
    loadingParams,
    selectAction,
    updateParam,
    setSelectedAction,
  };
}
