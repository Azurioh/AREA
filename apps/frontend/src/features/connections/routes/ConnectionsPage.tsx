import type React from 'react';
import SideBar from '@/components/SideBar';
import { Card, CardContent } from '@/components/wrappers/Card';
import ConnectionCard from '../components/ConnectionCard';

const ConnectionsPage: React.FC = () => {
  const services = [
    {
      image: 'https://logos-world.net/wp-content/uploads/2020/12/Discord-Logo.png',
      name: 'discord',
    },
    {
      image: 'https://logos-world.net/wp-content/uploads/2020/11/GitHub-Logo.png',
      name: 'github',
    },
  ];

  return (
    <div className="flex h-screen bg-background">
      <SideBar />

      <main className="flex-1 ml-24 pr-4 pt-4">
        <Card className="h-full w-full rounded-b-none">
          <CardContent className="p-8 h-full overflow-y-auto flex flex-col items-center">
            <h1 className="font-bold tracking-tighter text-primary text-center mt-12 mb-12">Connections</h1>
            {services.map((service) => {
              return <ConnectionCard image={service.image} serviceName={service.name} />;
            })}
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default ConnectionsPage;
