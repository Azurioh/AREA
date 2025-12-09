import type React from 'react';
import { motion } from 'framer-motion';
import SideBar from '@/components/SideBar';
import { Card, CardContent } from '@/components/wrappers/Card';
import { Button } from '@/components/wrappers/Button';
import { toast } from 'sonner';

import { useCreateActionReaction } from '@/features/workflows/hooks/useCreateActionReaction';
import { useActionSelector } from '@/features/workflows/hooks/useActionSelector';
import { useReactionSelector } from '@/features/workflows/hooks/useReactionSelector';

import ActionSelector from '@/features/workflows/components/ActionSelector';
import ReactionSelector from '@/features/workflows/components/ReactionSelector';

const CreateWorkflows: React.FC = () => {
  const action = useActionSelector();
  const reaction = useReactionSelector();

  const { createActionReaction, setAction, setReaction, loading } = useCreateActionReaction();

  const handleCreate = async () => {
    if (!action.selectedAction || !reaction.selectedReaction) return;

    setAction(action.toActionData());
    setReaction(reaction.toReactionData());

    await createActionReaction(action.toActionData(), reaction.toReactionData());
    toast.success('Workflow created successfully!');
  };

  return (
    <div className="flex h-screen bg-background">
      <SideBar />
      <main className="flex-1 ml-24 pr-4 pt-4">
        <Card className="h-full w-full rounded-b-none">
          <CardContent className="p-6 h-full overflow-y-auto">
            <div className="text-center space-y-2 mb-6">
              <h1 className="font-bold tracking-tighter text-primary">Create Workflow</h1>
              <p className="text-foreground">Connect actions and reactions to automate your tasks</p>
            </div>

            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="w-full max-w-3xl mx-auto space-y-6"
            >
              <ActionSelector {...action} />

              <div className="flex justify-center">
                <div className="bg-primary rounded-full p-3">
                  <svg className="w-6 h-6 text-card" fill="none" stroke="currentColor" viewBox="0 0 24 24" role="img">
                    <title>Down arrow icon</title>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                  </svg>
                </div>
              </div>

              <ReactionSelector {...reaction} />

              <div className="flex justify-center pt-4 pb-6">
                <Button
                  onClick={handleCreate}
                  disabled={!action.selectedAction || !reaction.selectedReaction || loading}
                  className="w-full max-w-xs"
                >
                  {loading ? 'Creating...' : 'Create Workflow'}
                </Button>
              </div>
            </motion.div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default CreateWorkflows;
