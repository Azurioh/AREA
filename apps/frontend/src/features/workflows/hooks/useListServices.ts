import { useState } from 'react';
import { useApp } from '@/hooks/useApp';

export const useListServices = () => {
  const { servicesClient } = useApp();
  const [services, setServices] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchServices = async () => {
    setLoading(true);
    try {
      const servicesFetched = await servicesClient.listServices();
      if (!servicesFetched) {
        return;
      }

      setServices(servicesFetched);
    } catch {
      // Error handled in the ApiClient
    } finally {
      setLoading(false);
    }
  };

  return {
    services,
    loading,
    fetchServices,
  };
};
