import React from 'react';
import type { ReturnedValue } from '@/features/workflows/hooks/useReturnedValuesTypes';
import { getActionReturnedValues } from '@/features/workflows/api/actionReturnedValues';

export function useActionReturnedValues(service?: string, action?: string) {
  const [values, setValues] = React.useState<ReturnedValue[]>([]);
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    if (!service || !action) {
      setValues([]);
      return;
    }

    const fetchValues = async () => {
      try {
        setLoading(true);
        const data = await getActionReturnedValues(service, action);
        setValues(data);
      } finally {
        setLoading(false);
      }
    };

    fetchValues();
  }, [service, action]);

  return { values, loading };
}
