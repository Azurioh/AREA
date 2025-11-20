import type { Webhook } from '@area/shared/types/webhook.types';
import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { CarouselItemCard } from '@/components/CarouselItemCard';
import { Button } from '@/components/ui/button';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { useApi } from '@/hooks/useApiHook';

export default function Home() {
  const { webhookService } = useApi();
  const [webhooks, setWebhooks] = useState<Webhook[]>([]);

  const loadWebhooks = useCallback(async () => {
    const response = await webhookService.listWebhooks();
    setWebhooks(response);
  }, []);

  useEffect(() => {
    loadWebhooks();
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen w-full">
      <div className="flex flex-col items-center justify-center gap-8 w-full px-10">
        <h1 className="text-3xl font-bold text-center">Home</h1>
        <Carousel className="w-full max-w-4xl">
          <CarouselContent className="-ml-1">
            {webhooks.map((webhook) => (
              <CarouselItem key={webhook.uuid} className="pl-1 md:basis-1/2 lg:basis-1/3 flex-shrink-0">
                <div className="p-1">
                  <CarouselItemCard item={webhook} />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
        <Link to="/other">
          <Button variant="default">Create</Button>
        </Link>
      </div>
    </div>
  );
}
