import * as React from 'react';
import { Button as ShadcnButton, type ButtonProps as ShadcnButtonProps } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export interface ButtonProps extends ShadcnButtonProps {}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(({ className, ...props }, ref) => {
  return <ShadcnButton className={cn('rounded-[var(--small-radius)]', className)} ref={ref} {...props} />;
});
Button.displayName = 'Button';

export { Button };
