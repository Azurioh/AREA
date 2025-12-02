import * as React from "react"
import {
  Card as ShadcnCard,
  CardHeader as ShadcnCardHeader,
  CardFooter as ShadcnCardFooter,
  CardTitle as ShadcnCardTitle,
  CardDescription as ShadcnCardDescription,
  CardContent as ShadcnCardContent,
} from "@/components/ui/card"
import { cn } from "@/lib/utils"

const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <ShadcnCard
    ref={ref}
    className={cn("rounded-[var(--large-radius)]", className)}
    {...props}
  />
))
Card.displayName = "Card"

export { 
  Card,
  ShadcnCardHeader as CardHeader,
  ShadcnCardFooter as CardFooter,
  ShadcnCardTitle as CardTitle,
  ShadcnCardDescription as CardDescription,
  ShadcnCardContent as CardContent
}
