import type { GetActionReturnedValuesResponse } from '@area/shared/schemas/services.schema';

export async function getActionReturnedValues(
  service: string,
  action: string,
): Promise<GetActionReturnedValuesResponse[]> {
  const res = await fetch(
    `${import.meta.env.VITE_BACKEND_URL}/services/v1/${service}/actions/${action}/returned-values`,
  );
  if (!res.ok) {
    return [];
  }
  const data = await res.json();
  return Array.isArray(data) ? data : [];
}
