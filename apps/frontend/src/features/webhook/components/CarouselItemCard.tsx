import type { Webhook } from '@area/shared/types/webhook.types';
import { Card, CardContent } from '@/components/ui/card';

export function CarouselItemCard({ item }: { item: Webhook }) {
  return (
    <Card className="w-[250px]">
      <CardContent className="p-4">
        <p className="font-semibold">Repository: {item.githubUrl}</p>
        <p className="text-sm">Actions: {item.actions.join(', ')}</p>
        <p className="text-sm">Discord Webhook: {`${item.discordWebhookUrl.slice(0, 25)}...`}</p>
      </CardContent>
    </Card>
  );
}
