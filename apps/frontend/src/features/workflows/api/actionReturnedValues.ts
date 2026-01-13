import type { ReturnedValue } from '@/features/workflows/hooks/useReturnedValuesTypes';

export async function getActionReturnedValues(service: string, action: string): Promise<ReturnedValue[]> {
  const res = await fetch(
    `${import.meta.env.VITE_BACKEND_URL}/services/v1/${service}/actions/${action}/returned-values`,
  );
  if (!res.ok) {
    return [];
  }
  const data = await res.json();
  return Array.isArray(data) ? data : [];
}
