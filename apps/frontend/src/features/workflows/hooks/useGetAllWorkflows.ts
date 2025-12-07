import { useEffect, useState, useContext } from 'react';
import type { Workflow } from '../api/AllWorkflowsClient';
import { AllWorkflowsClient } from '../api/AllWorkflowsClient';
import { AuthContext } from '@/contexts/AuthContext';

export function useGetAllWorkflows() {
  const [workflows, setWorkflows] = useState<Workflow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const auth = useContext(AuthContext);

  useEffect(() => {
    if (!auth){
        return;
    }
    const client = new AllWorkflowsClient(import.meta.env.VITE_BACKEND_URL, auth.tokenManager);
    setIsLoading(true);
    client.getAllWorkflows()
      .then(setWorkflows)
      .catch((err) => setError(err instanceof Error ? err.message : 'Unknown error'))
      .finally(() => setIsLoading(false));
  }, [auth]);

  return { workflows, isLoading, error };
}
