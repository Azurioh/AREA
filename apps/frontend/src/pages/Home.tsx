import { useEffect, useState } from "react"
import { fetchData, DataItem } from "@/lib/api"
import { Button } from "@/components/ui/button"
import {Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious,} from "@/components/ui/carousel"
import { CarouselItemCard } from "@/components/CarouselItemCard"
import { Link } from "react-router-dom"

export default function Home() {
  const [items, setItems] = useState<DataItem[]>([])

  useEffect(() => {
    fetchData(100).then(setItems).catch(console.error)
  }, [])

  return (
    <div className="flex items-center justify-center min-h-screen w-full">
      <div className="flex flex-col items-center justify-center gap-8 w-full px-10">
        <h1 className="text-3xl font-bold text-center">Home</h1>
        <Carousel className="w-full max-w-4xl">
          <CarouselContent className="-ml-1">
            {items.map((item) => (
              <CarouselItem
                key={item.id}
                className="pl-1 md:basis-1/2 lg:basis-1/3 flex-shrink-0"
              >
                <div className="p-1">
                  <CarouselItemCard item={item} />
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
  )
}