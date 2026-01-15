import { Search } from 'lucide-react';
import type React from 'react';
import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import SideBar from '@/components/SideBar';
import WorkflowsCard from '@/components/WorkflowsCard';
import { Button } from '@/components/wrappers/Button';
import { Card, CardContent } from '@/components/wrappers/Card';
import { Input } from '@/components/wrappers/Input';
import { AppRoutesPaths } from '@/enums/routes';
import { useFilter } from '@/features/workflows/hooks/useFilter';
import { useListWorkflows } from '@/features/workflows/hooks/useListWorkflows';
import { useToggleExecutionState } from '@/shared/hooks/useToggleExecutionState';
import { MoveRight } from 'lucide-react';

const WorkflowPage: React.FC = () => {
  const navigate = useNavigate();
  const { workflows, loading, setWorkflows } = useListWorkflows();
  const { toggleExecutionState, isUpdating } = useToggleExecutionState();
  const [search, setSearch] = useState('');
  const filteredWorkflows = useFilter(workflows, search, (workflow) => (workflow.action?.service || '').toLowerCase());

  const handleToggle = useCallback(
    async (workflowId: string, nextState: boolean) => {
      setWorkflows((previous) =>
        previous.map((workflow) =>
          workflow._id === workflowId ? { ...workflow, executionState: nextState } : workflow,
        ),
      );

      try {
        await toggleExecutionState(workflowId, nextState);
      } catch {
        setWorkflows((previous) =>
          previous.map((workflow) =>
            workflow._id === workflowId ? { ...workflow, executionState: !nextState } : workflow,
          ),
        );
        toast.error('Unable to update the state of this workflow.');
      }
    },
    [setWorkflows, toggleExecutionState],
  );

  return (
    <div className="flex h-screen bg-background">
      <SideBar />
      <main className="flex-1 ml-24 pr-4 pt-4" role="main" aria-label="Workflows management">
        <Card className="h-full w-full rounded-b-none flex flex-col items-center justify-start">
          <CardContent className="p-6 h-full w-full overflow-y-auto">
            <div className="text-center space-y-2 mb-6">
              <h1 className="text-3xl font-bold tracking-tighter text-primary">Build &amp; Manage Your Workflows</h1>
              <p className="text-muted-foreground">
                Manage your workflows, activate them, and monitor their performance all in one place.
              </p>
            </div>
            <div className="w-full flex justify-center mb-8">
              <div className="relative w-full max-w-4xl">
                <label htmlFor="search-workflows" className="sr-only">
                  Search workflows
                </label>
                <Input
                  id="search-workflows"
                  placeholder="Search your workflow ..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  aria-label="Search workflows by service name"
                  className="transition-all hover:border-primary"
                />
                <Search
                  size={28}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
                  aria-hidden="true"
                />
              </div>
            </div>
            <div className="w-full flex justify-center">
              <div
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-4 px-4 mb-12"
                role="region"
                aria-label="Workflows list"
                aria-live="polite"
                aria-busy={loading}
              >
                {loading && (
                  <div className="col-span-3 text-center text-lg" role="status">
                    <span>Loading workflows...</span>
                  </div>
                )}
                {!loading && filteredWorkflows.length === 0 && (
                  <div className="col-span-3 text-center text-lg text-muted-foreground" role="status">
                    No workflows found. Create your first workflow to get started!
                  </div>
                )}
                {!loading &&
                  filteredWorkflows.map((wf) => (
                    <WorkflowsCard
                      key={wf._id}
                      workflowId={wf._id}
                      title={wf.action?.service + ' | ' + wf.reaction?.service || 'Unknown'}
                      Description={
                        <span className="inline-flex items-center gap-2">
                          <span>{wf.action?.name || 'Unknown action'}</span>
                          <MoveRight className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                          <span>{wf.reaction?.name || 'Unknown reaction'}</span>
                        </span>
                      }
                      Value={wf.numberOfExecution}
                      activated={wf.executionState}
                      Service1={`${import.meta.env.VITE_BASE_IMAGE_URL}/${wf.action?.service?.toLowerCase()}.png`}
                      Service1Name={wf.action?.service || 'Unknown service'}
                      Service2={`${import.meta.env.VITE_BASE_IMAGE_URL}/${wf.reaction?.service?.toLowerCase()}.png`}
                      Service2Name={wf.reaction?.service || 'Unknown service'}
                      onToggle={(checked) => handleToggle(wf._id, checked)}
                      isToggling={isUpdating(wf._id)}
                    />
                  ))}
              </div>
            </div>
            <div className="w-full flex justify-center">
              <div className="fixed bottom-8">
                <Button
                  size="icon"
                  className="w-60 h-10 rounded-[var(--small-radius)]"
                  onClick={() => navigate(AppRoutesPaths.CREATE)}
                  aria-label="Create a new workflow"
                >
                  <span className="text-lg">Create workflow</span>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default WorkflowPage;
