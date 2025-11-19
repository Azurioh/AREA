import { Card, CardContent } from "@/components/ui/card"
import { DataItem } from "@/lib/api"

export function CarouselItemCard({ item }: { item: DataItem }) {
  return (
    <Card className="w-[250px]">
      <CardContent className="p-4">
        <p className="font-semibold">ID: {item.id}</p>
        <p className="text-sm">Value: {item.value}</p>
        <p className="text-xs text-muted-foreground">Type: {item.type}</p>
      </CardContent>
    </Card>
  )
}