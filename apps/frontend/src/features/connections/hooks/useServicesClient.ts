import { useEffect, useState } from 'react';
import { useApp } from '@/hooks/useApp';

interface Service {
  name: string;
  status: boolean;
}

export function useServicesClient() {
  const { servicesClient, thirdPartiesInformation } = useApp();
  const [services, setServices] = useState<Service[]>([]);

  useEffect(() => {
    const fetchServices = async () => {
      const response = await servicesClient.listServices();
      if (!response) {
        return;
      }

      const servicesWithStatus = await Promise.all(
        response.map(async (serviceName: string) => {
          const statusResponse = await thirdPartiesInformation.getConnectionStatus(serviceName);

          return {
            name: serviceName,
            status: Boolean(statusResponse?.connected),
          };
        }),
      );

      setServices(servicesWithStatus);
    };

    fetchServices();
  }, [servicesClient, thirdPartiesInformation]);

  return services;
}
