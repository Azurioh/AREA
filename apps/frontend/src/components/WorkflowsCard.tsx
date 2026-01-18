import { useState } from 'react';
import { formatActionReactionName } from '@/lib/utils';
import type { ReactNode } from 'react';
import { Card } from '@/components/ui/card';
import { MoveRight, Trash2, X } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { motion, AnimatePresence } from 'framer-motion';
import { Label } from '@/components/ui/label';
import { useDeleteActionReaction } from '@/features/workflows/hooks/useDeleteActionReaction';

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
  const { deleteById, isLoading } = useDeleteActionReaction();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const handleDelete = async () => {
    try {
      await deleteById(workflowId);
      window.location.reload();
    } catch (error) {
      console.error('Error deleting workflow:', error);
    }
  };

  return (
    <>
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
            <button
              type="button"
              onClick={() => setShowDeleteDialog(true)}
              aria-label="Delete workflow"
              className="p-1 rounded hover:bg-destructive/10 text-destructive transition-colors"
              disabled={isLoading}
            >
              <Trash2 size={18} />
            </button>
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
            <div className="text-sm text-muted-foreground mt-2">
              {typeof title === 'string' ? formatActionReactionName(title) : title}
            </div>
            <div className="text-sm mt-1">
              {typeof Description === 'string' ? formatActionReactionName(Description) : Description}
            </div>
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

      <AnimatePresence>
        {showDeleteDialog && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/50"
              onClick={() => !isLoading && setShowDeleteDialog(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              <Card className="relative z-10 p-6 max-w-md mx-4 bg-background">
                <button
                  type="button"
                  onClick={() => !isLoading && setShowDeleteDialog(false)}
                  className="absolute top-4 right-4 p-1 rounded hover:bg-muted transition-colors"
                  disabled={isLoading}
                  aria-label="Fermer"
                >
                  <X size={18} />
                </button>
                <h2 className="text-lg font-semibold mb-2">Are you sure?</h2>
                <p className="text-sm text-muted-foreground mb-6">
                  This action is irreversible. The workflow will be permanently deleted.
                </p>
                <div className="flex gap-3 justify-end">
                  <button
                    type="button"
                    onClick={() => setShowDeleteDialog(false)}
                    disabled={isLoading}
                    className="px-4 py-2 text-sm rounded-md border border-input bg-background hover:bg-accent hover:text-accent-foreground transition-colors disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleDelete}
                    disabled={isLoading}
                    className="px-4 py-2 text-sm rounded-md bg-destructive text-destructive-foreground hover:bg-destructive/90 transition-colors disabled:opacity-50"
                  >
                    {isLoading ? 'Suppression...' : 'Delete'}
                  </button>
                </div>
              </Card>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
