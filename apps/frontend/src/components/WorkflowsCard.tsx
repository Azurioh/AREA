import { Card } from '@/components/ui/card';
import { MoveRight, Ellipsis } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { useActionsModal } from '@/shared/hooks/useActionsModal';
import { Button } from '@/components/wrappers/Button';
import { motion } from 'framer-motion';

interface StatsCardProps {
  title: string;
  Description: string;
  Value: number | string;
  Last: number | string;
  activated: boolean;
  Service1: string;
  Service2: string;
  onToggle?: (checked: boolean) => void;
  isToggling?: boolean;
}

const noop = () => undefined;

export default function WorkflowsCard({
  title,
  Description,
  Value,
  Last,
  Service1,
  Service2,
  activated,
  onToggle,
  isToggling = false,
}: StatsCardProps) {
  const { isModalOpen, openModal, closeModal, modalRef, buttonRef } = useActionsModal();
  const handleToggle = onToggle ?? noop;
  const switchDisabled = isToggling || !onToggle;

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-5xl mx-auto"
    >
      <Card className="relative p-4 flex items-center justify-between max-w-sm rounded-[var(--large-radius)] min-w-96 bg-muted">
        <div className="absolute top-2 right-2 flex items-center space-x-2">
          <Switch
            checked={activated}
            onCheckedChange={handleToggle}
            disabled={switchDisabled}
            className="data-[state=unchecked]:bg-switch-disabled data-[state=unchecked]:border-switch-disabled"
          />
          <div className="relative">
            <Button
              variant="ghost"
              ref={buttonRef}
              onClick={() => openModal()}
              className="hover:bg-transparent hover:text-inherit focus:bg-transparent active:bg-transparent"
            >
              <Ellipsis />
            </Button>
            {isModalOpen && (
              <div
                ref={modalRef}
                className="absolute top-0 right-full mr-2 bg-card text-card-foreground p-4 rounded-[var(--large-radius)] shadow-lg font-sans z-10"
              >
                <Button
                  className="mb-2 w-full text-left hover:bg-transparent hover:text-inherit focus:bg-transparent active:bg-transparent"
                  variant="ghost"
                  onClick={() => closeModal()}
                >
                  Edit
                </Button>
                <Button
                  className="w-full text-left text-destructive hover:bg-transparent hover:text-destructive focus:bg-transparent active:bg-transparent"
                  variant="ghost"
                  onClick={() => closeModal()}
                >
                  Delete
                </Button>
              </div>
            )}
          </div>
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
          <span className="text-sm text-muted-foreground">{title}</span>
          <span className="text-sm">{Description}</span>
          <p>
            <span className="text-sm">{Value}</span> executions
          </p>
          <p>
            Last run: <span className="text-sm ">{Last}</span> minutes ago
          </p>
        </div>
      </Card>
    </motion.div>
  );
}
