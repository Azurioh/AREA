import { Link } from 'react-router-dom';
import { LoadingScreen } from '@/components/LoadingScreen';
import { Button } from '@/components/ui/button';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { Skeleton } from '@/components/ui/skeleton';
import { CarouselItemCard } from '@/features/webhook/components/CarouselItemCard';
import { useWebhookList } from '@/features/webhook/hooks/useWebhookList';
import { AccessibilitySettings } from '../components/AccessibilitySettings';
import { AppRoutesPaths } from '@/enums/routes';

const WebhookPage = () => {
  const { webhooks, loading } = useWebhookList();

  if (loading) {
    return (
      <LoadingScreen message="Loading webhooks...">
        <Skeleton className="h-8 w-[250px] bg-muted" />
        <Skeleton className="h-8 w-[200px] bg-muted" />
        <Skeleton className="h-8 w-[200px] bg-muted" />
        <Skeleton className="h-8 w-[200px] bg-muted" />
        <Skeleton className="h-8 w-[200px] bg-muted" />
        <Skeleton className="h-8 w-[200px] bg-muted" />
        <Skeleton className="h-8 w-[200px] bg-muted" />
        <Skeleton className="h-8 w-[200px] bg-muted" />
      </LoadingScreen>
    );
  }

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
        <Link to={AppRoutesPaths.OTHER}>
          <Button variant="default">Create</Button>
        </Link>
        <AccessibilitySettings />
      </div>
    </div>
  );
};

export default WebhookPage;
