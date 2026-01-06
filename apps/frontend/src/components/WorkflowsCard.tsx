import type { ReactNode } from 'react';
import { Card } from '@/components/ui/card';
import { MoveRight } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { motion } from 'framer-motion';

interface WorkflowsCardProps {
  title: ReactNode;
  Description: ReactNode;
  Value: number | string;
  activated: boolean;
  Service1: string;
  Service2: string;
  onToggle?: (checked: boolean) => void;
  isToggling?: boolean;
  homePage?: boolean;
}

const noop = () => undefined;

export default function WorkflowsCard({
  title,
  Description,
  Value,
  Service1,
  Service2,
  activated,
  onToggle,
  isToggling = false,
  homePage = false,
}: WorkflowsCardProps) {
  const handleToggle = onToggle ?? noop;
  const switchDisabled = isToggling;

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-5xl mx-auto"
    >
      <Card className="relative p-4 flex items-center justify-between max-w-sm rounded-[var(--large-radius)] min-w-96 bg-muted">
        <div className="absolute top-2 right-2 flex items-center space-x-2">
          {!homePage && (
            <Switch
              checked={activated}
              onCheckedChange={handleToggle}
              disabled={switchDisabled}
              className="data-[state=unchecked]:bg-switch-disabled data-[state=unchecked]:border-switch-disabled"
            />
          )}
        </div>

        <div className="flex flex-col">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 flex items-center justify-center p-1">
              <img src={Service1} alt="icon" className="max-h-full max-w-full object-contain" />
            </div>
            <MoveRight className="text-muted-foreground" />
            <div className="w-10 h-10 flex items-center justify-center p-1">
              <img src={Service2} alt="icon" className="max-h-full max-w-full object-contain" />
            </div>
          </div>
          <div className="text-sm text-muted-foreground">{title}</div>
          <div className="text-sm">{Description}</div>
          <p>
            <span className="text-sm">{Value}</span> executions
          </p>
        </div>
      </Card>
    </motion.div>
  );
}
