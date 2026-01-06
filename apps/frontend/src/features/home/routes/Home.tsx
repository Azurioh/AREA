import SideBar from '@/components/SideBar';
import { Card, CardContent } from '@/components/ui/card';
import WorkflowsCard from '@/components/WorkflowsCard';
import StatsCard from '@/features/home/components/StatsCard';
import { useListWorkflows } from '@/features/workflows/hooks/useListWorkflows';
import { MoveRight } from 'lucide-react';

export default function HomePage() {
  const stats = [
    { title: 'Active workflows', value: '12' },
    { title: 'Executions today', value: '847' },
    { title: 'Success rate', value: '100%' },
    { title: 'Errors', value: '3' },
  ];

  const { workflows } = useListWorkflows();
  const latestWorkflows = [...workflows].reverse().slice(0, 3);

  return (
    <div className="flex h-screen bg-background">
      <SideBar />
      <main className="flex-1 ml-24 pr-4 pt-4">
        <Card className="h-full w-full rounded-b-none">
          <CardContent className="p-6 h-full overflow-y-auto">
            <div className="text-center space-y-2 mb-6">
              <h1 className="font-bold tracking-tighter text-primary"> Automate Everything Effortlessly </h1>
              <p className="text-foreground">
                Manage and monitor your workflows all in one place with our intuitive dashboard
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-4">
              {stats.map((stat, i) => (
                <StatsCard key={i} title={stat.title} value={stat.value} />
              ))}
            </div>
            <h1 className="text-4xl mt-28 mb-20 text-center font-button font-bold tracking-tighter text-primary">
              Recents Workflows
            </h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-4 px-4 mb-12">
              {latestWorkflows.map((wf) => (
                <WorkflowsCard
                  key={wf._id}
                  title={wf.action?.service + ' | ' + wf.reaction?.service || 'Unknown'}
                  Description={
                    <span className="inline-flex items-center gap-2">
                      <span>{wf.action?.name || 'Unknown action'}</span>
                      <MoveRight className="h-4 w-4 text-muted-foreground" />
                      <span>{wf.reaction?.name || 'Unknown reaction'}</span>
                    </span>
                  }
                  Value={wf.numberOfExecution}
                  activated={wf.executionState}
                  Service1={`${import.meta.env.VITE_BASE_IMAGE_URL}/${wf.action?.service?.toLowerCase()}.png`}
                  Service2={`${import.meta.env.VITE_BASE_IMAGE_URL}/${wf.reaction?.service?.toLowerCase()}.png`}
                  homePage={true}
                />
              ))}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
