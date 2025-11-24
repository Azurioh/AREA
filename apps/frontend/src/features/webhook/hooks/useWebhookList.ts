import type { Webhook } from '@area/shared/types/webhook.types';
import { useEffect, useState } from 'react';
import { useApp } from '@/hooks/useApp';

export const useWebhookList = () => {
  const { webhookClient } = useApp();

  const [webhooks, setWebhooks] = useState<Webhook[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchWebhooks = async () => {
      setLoading(true);
      try {
        const webhooks = await webhookClient.listWebhooks();
        setWebhooks(webhooks);
      } catch (error) {
        console.error('Error fetching webhooks:', error);
      } finally {
        await new Promise((resolve) => setTimeout(resolve, 2000));
        setLoading(false);
      }
    };
    fetchWebhooks();
  }, [webhookClient]);

  return {
    webhooks,
    loading,
  };
};
