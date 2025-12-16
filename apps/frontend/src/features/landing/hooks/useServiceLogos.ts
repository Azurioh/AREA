import { useEffect, useState } from 'react';
import { useApp } from '@/hooks/useApp';

interface ServiceLogo {
  name: string;
  imageUrl: string;
}

const BASE_IMAGE_URL = import.meta.env.VITE_BASE_IMAGE_URL;

export function useServiceLogos() {
  const { servicesClient } = useApp();
  const [services, setServices] = useState<ServiceLogo[]>([]);

  useEffect(() => {
    const fetchServices = async () => {
      const serviceNames = await servicesClient.listServices();
      if (!serviceNames) return;

      const servicesWithImages = serviceNames.map((name: string) => {
        const lowerName = name.toLowerCase();
        return {
          name: lowerName,
          imageUrl: `${BASE_IMAGE_URL}/${lowerName}.png`,
        };
      });

      setServices(servicesWithImages);
    };

    fetchServices();
  }, [servicesClient]);

  return services;
}
