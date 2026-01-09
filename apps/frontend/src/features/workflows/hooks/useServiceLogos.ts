import { useEffect, useState } from 'react';

const BASE_IMAGE_URL = import.meta.env.VITE_BASE_IMAGE_URL;

interface ServiceLogo {
  name: string;
  imageUrl: string;
}

export function useServiceLogo(serviceName?: string) {
  const [logo, setLogo] = useState<ServiceLogo | null>(null);

  useEffect(() => {
    if (!serviceName) {
      setLogo(null);
      return;
    }

    const lowerName = serviceName.toLowerCase();

    setLogo({
      name: lowerName,
      imageUrl: `${BASE_IMAGE_URL}/${lowerName}.png`,
    });
  }, [serviceName]);

  return logo;
}
