import type { ReactNode } from 'react';
import { Card } from '@/components/ui/card';
import { MoveRight } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { motion } from 'framer-motion';
import { Label } from '@/components/ui/label';

interface WorkflowsCardProps {
  workflowId?: string;
  title: ReactNode;
  Description: ReactNode;
  Value: number | string;
  activated: boolean;
  Service1: string;
  Service1Name?: string;
  Service2: string;
  Service2Name?: string;
  onToggle?: (checked: boolean) => void;
  isToggling?: boolean;
  homePage?: boolean;
}

const noop = () => undefined;

export default function WorkflowsCard({
  workflowId,
  title,
  Description,
  Value,
  Service1,
  Service1Name = 'Service 1',
  Service2,
  Service2Name = 'Service 2',
  activated,
  onToggle,
  isToggling = false,
  homePage = false,
}: WorkflowsCardProps) {
  const handleToggle = onToggle ?? noop;
  const switchDisabled = isToggling;
  const switchId = workflowId ? `workflow-switch-${workflowId}` : undefined;

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-5xl mx-auto"
    >
      <Card
        className="relative p-4 flex items-center justify-between max-w-sm rounded-[var(--large-radius)] min-w-96 bg-muted"
        role="article"
        aria-label={`Workflow: ${typeof title === 'string' ? title : 'Workflow card'}`}
      >
        <div className="absolute top-2 right-2 flex items-center space-x-2">
          {!homePage && (
            <div className="flex items-center gap-2">
              <Label htmlFor={switchId} className="sr-only">
                {activated ? 'Deactivate' : 'Activate'} workflow
              </Label>
              <Switch
                id={switchId}
                checked={activated}
                onCheckedChange={handleToggle}
                disabled={switchDisabled}
                aria-label={`${activated ? 'Deactivate' : 'Activate'} workflow`}
                aria-checked={activated}
                className="data-[state=unchecked]:bg-switch-disabled data-[state=unchecked]:border-switch-disabled"
              />
            </div>
          )}
        </div>

        <div className="flex flex-col">
          <fieldset className="flex items-center space-x-2" aria-label="Workflow services">
            <div className="w-10 h-10 flex items-center justify-center p-1">
              <img src={Service1} alt={`${Service1Name} logo`} className="max-h-full max-w-full object-contain" />
            </div>
            <MoveRight className="text-muted-foreground" aria-hidden="true" />
            <div className="w-10 h-10 flex items-center justify-center p-1">
              <img src={Service2} alt={`${Service2Name} logo`} className="max-h-full max-w-full object-contain" />
            </div>
          </fieldset>
          <div className="text-sm text-muted-foreground mt-2">{title}</div>
          <div className="text-sm mt-1">{Description}</div>
          <p className="mt-2">
            <span className="text-sm font-medium">{Value}</span>
            <span className="text-sm text-muted-foreground">
              {' '}
              execution{typeof Value === 'number' && Value !== 1 ? 's' : ''}
            </span>
          </p>
        </div>
      </Card>
    </motion.div>
  );
}
