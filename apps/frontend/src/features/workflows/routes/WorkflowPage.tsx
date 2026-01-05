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
        toast.error("Impossible de mettre à jour l'état de ce workflow.");
      }
    },
    [setWorkflows, toggleExecutionState],
  );

  return (
    <div className="flex h-screen bg-background">
      <SideBar />
      <main className="flex-1 ml-24 pr-4 pt-4">
        <Card className="h-full w-full rounded-b-none flex flex-col items-center justify-start">
          <CardContent className="p-6 h-full w-full overflow-y-auto">
            <h1 className="text-5xl mt-12 mb-14 font-text text-center !font-text font-bold tracking-tighter text-primary">
              Build &amp; Manage Your Workflows
            </h1>
            <div className="w-full flex justify-center mb-8">
              <div className="relative w-full max-w-4xl">
                <Input
                  id="search-workflows"
                  placeholder="Search your workflow ..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground">
                  <Search size={28} />
                </span>
              </div>
            </div>
            <div className="w-full flex justify-center">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-4 px-4 mb-12">
                {loading && <div className="col-span-3 text-center text-lg">Loading...</div>}
                {!loading && filteredWorkflows.length === 0 && (
                  <div className="col-span-3 text-center text-lg text-muted-foreground">
                    No workflows found. Create your first workflow to get started!
                  </div>
                )}
                {!loading &&
                  filteredWorkflows.map((wf) => (
                    <WorkflowsCard
                      key={wf._id}
                      title={wf.action?.service || 'Unknown'}
                      Description={wf.action?.name || ''}
                      Value={wf.numberOfExecution}
                      Last={wf.action?.params?.last || ''}
                      activated={wf.executionState}
                      Service1={`http://167.86.110.198:8085/images/${wf.action?.service?.toLowerCase()}.png`}
                      Service2={`http://167.86.110.198:8085/images/${wf.reaction?.service?.toLowerCase()}.png`}
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
                  className={`w-60 h-10 rounded-[var(--small-radius)]`}
                  onClick={() => navigate(AppRoutesPaths.CREATE)}
                >
                  <p className="text-2xl"> Create workflow </p>
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
