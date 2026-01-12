import { X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import SideBar from '@/components/SideBar';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useActionReaction } from '@/features/workflows/context/ActionReactionContext';

export default function CreateWorkflows() {
  const navigate = useNavigate();
  const {
    action,
    reaction,
    setAction,
    setReaction,
    createActionReaction,
    loading: loadingCreation,
    selectedActionService,
    selectedReactionService,
  } = useActionReaction();

  const handleCreateWorkflow = async () => {
    if (!action?.name || !reaction?.name) {
      toast.error('Please select both an action and a reaction');
      return;
    }

    try {
      await createActionReaction(action, reaction);
      toast.success('Workflow created successfully!');
      navigate('/workflows');
    } catch {
      toast.error('Failed to create workflow.');
    }
  };

  const clearAction = () => {
    setAction(selectedActionService || '', { service: '', name: '', params: {} }, []);
  };

  const clearReaction = () => {
    setReaction(selectedReactionService || '', { service: '', name: '', params: {} }, []);
  };

  return (
    <div className="flex h-screen bg-background">
      <SideBar />
      <main className="flex-1 ml-24 pr-4 pt-4">
        <Card className="w-full h-full flex flex-col items-center overflow-y-auto rounded-[var(--large-radius)] rounded-b-none">
          <h1 className="text-5xl mt-12 mb-10 font-text text-center font-bold tracking-tighter text-primary">
            Create Workflow
          </h1>
          <h2 className="text-2xl font-text text-center tracking-tighter">
            Connect actions and reactions to automate your tasks
          </h2>

          <div className="mt-16 flex flex-col items-center justify-center w-full max-w-3xl px-4">
            <div className="w-full h-36 relative">
              <Button
                className="w-full h-full flex items-center justify-center bg-primary rounded-[var(--small-radius)]"
                onClick={() => navigate('/workflows/choose-action')}
              >
                <span className="text-5xl font-bold text-card">{action?.name ? action.name : 'Action'}</span>
              </Button>

              {action?.name && (
                <Button
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-card hover:bg-muted rounded-[var(--small-radius)] w-10 h-10 p-0"
                  onClick={clearAction}
                >
                  <X color="#6B7280" className="w-5 h-5" />
                </Button>
              )}
            </div>

            <div className={`w-4 h-16 ${action?.name ? 'bg-primary' : 'bg-gradient-to-b from-primary to-muted'}`} />

            <div className="w-full h-36 relative">
              <Button
                className={`w-full h-full flex items-center justify-center rounded-[var(--small-radius)] transition-colors ${
                  action?.name ? 'bg-primary' : 'bg-muted cursor-not-allowed'
                }`}
                onClick={() => {
                  if (!action?.name) {
                    return;
                  }
                  navigate('/workflows/choose-reaction');
                }}
                disabled={!action?.name}
              >
                <span className="text-5xl font-bold text-card">{reaction?.name ? reaction.name : 'Reaction'}</span>
              </Button>

              {action?.name && reaction?.name && (
                <Button
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-card hover:bg-muted rounded-[var(--small-radius)] w-10 h-10 p-0"
                  onClick={clearReaction}
                >
                  <X color="#6B7280" className="w-5 h-5" />
                </Button>
              )}
            </div>

            {action?.name && reaction?.name && (
              <Button
                onClick={handleCreateWorkflow}
                className="mt-8 w-full max-w-xs bg-primary text-card p-3 rounded-[var(--large-radius)]  text-xl"
                disabled={loadingCreation}
              >
                {loadingCreation ? 'Creating...' : 'Create Workflow'}
              </Button>
            )}
          </div>
        </Card>
      </main>
    </div>
  );
}
