import StatsCard from '../components/StatsCard';
import WorkflowsCard from '../../../components/WorkflowsCard';
import { Card, CardContent } from '@/components/ui/card';
import SideBar from '@/components/SideBar';


export default function HomePage() {
  const stats = [
    { title: 'Active workflows', value: '12' },
    { title: 'Executions today', value: '847' },
    { title: 'Success rate', value: '100%' },
    { title: 'Errors', value: '3' },
  ];

  const workflows = [
    {
      title: 'Workflow 1',
      Description: 'Description 1',
      Value: '42',
      Last: '5',
      activated: true,
      Service1: 'https://logos-world.net/wp-content/uploads/2020/12/Discord-Logo.png',
      Service2:
        'https://upload.wikimedia.org/wikipedia/commons/thumb/0/09/YouTube_full-color_icon_%282017%29.svg/512px-YouTube_full-color_icon_%282017%29.svg.png',
    },
    {
      title: 'Workflow 2',
      Description: 'Description 2',
      Value: '123',
      Last: '10',
      activated: false,
      Service1: 'https://logos-world.net/wp-content/uploads/2020/12/Discord-Logo.png',
      Service2:
        'https://upload.wikimedia.org/wikipedia/commons/thumb/0/09/YouTube_full-color_icon_%282017%29.svg/512px-YouTube_full-color_icon_%282017%29.svg.png',
    },
    {
      title: 'Workflow 3',
      Description: 'Description 3',
      Value: '300',
      Last: '60',
      activated: true,
      Service1: 'https://logos-world.net/wp-content/uploads/2020/12/Discord-Logo.png',
      Service2:
        'https://upload.wikimedia.org/wikipedia/commons/thumb/0/09/YouTube_full-color_icon_%282017%29.svg/512px-YouTube_full-color_icon_%282017%29.svg.png',
    },
  ];

  return (
    <div className="flex h-screen bg-background">
      <SideBar />
      <main className="flex-1 ml-24 p-4">
        <Card className="w-full h-full flex flex-col items-center overflow-y-auto rounded-[var(--large-radius)]">
          <h1 className="text-card-foreground text-5xl mt-12 mb-32 font-text text-center !font-text">
            Automate Everything Effortlessly
          </h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, i) => (
              <StatsCard key={i} title={stat.title} value={stat.value} />
            ))}
          </div>
          <h2 className="text-card-foreground text-5xl mt-12 mb-6 text-center font-button">Recents Workflows</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full mt-4 px-4 mb-12">
            {workflows.map((wf, idx) => (
              <WorkflowsCard
                key={idx}
                title={wf.title}
                Description={wf.Description}
                Value={wf.Value}
                Last={wf.Last}
                activated={wf.activated}
                Service1={wf.Service1}
                Service2={wf.Service2}
              />
            ))}
          </div>
        </Card>
      </main>
    </div>
  );
}
