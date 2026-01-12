import { useMemo } from 'react';

const BASE_IMAGE_URL = import.meta.env.VITE_BASE_IMAGE_URL;

interface ServiceLogo {
  name: string;
  imageUrl: string;
}

export function useServiceLogo(serviceName?: string) {
  const logo = useMemo<ServiceLogo | null>(() => {
    if (!serviceName) {
      return null;
    }

    const lowerName = serviceName.toLowerCase();

    return {
      name: lowerName,
      imageUrl: `${BASE_IMAGE_URL}/${lowerName}.png`,
    };
  }, [serviceName]);

  return logo;
}
