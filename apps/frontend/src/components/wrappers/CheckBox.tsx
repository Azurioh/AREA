import * as React from "react"
import { Checkbox as ShadcnCheckbox } from "@/components/ui/checkbox"
import { cn } from "@/lib/utils"
import type { CheckboxProps as ShadcnCheckboxProps } from "@radix-ui/react-checkbox"

export interface CheckboxProps extends ShadcnCheckboxProps {}

const Checkbox = React.forwardRef<
  React.ElementRef<typeof ShadcnCheckbox>,
  CheckboxProps
>(({ className, ...props }, ref) => {
  return (
    <ShadcnCheckbox
      className={cn(
        "bg-white border-primary data-[state=checked]:bg-primary",
        className
      )}
      ref={ref}
      {...props}
    />
  )
})
Checkbox.displayName = "Checkbox"

export { Checkbox }
