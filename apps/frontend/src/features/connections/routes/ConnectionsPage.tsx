import type React from 'react';
import SideBar from '@/components/SideBar';
import { Card, CardContent } from '@/components/wrappers/Card';
import ConnectionCard from '../components/ConnectionCard';
import { useServicesClient } from '../hooks/useServicesClient';

const ConnectionsPage: React.FC = () => {
  const services = useServicesClient();

  return (
    <div className="flex h-screen bg-background">
      <SideBar />
      <main className="flex-1 ml-24 pr-4 pt-4">
        <Card className="h-full w-full rounded-b-none">
          <CardContent className="p-6 h-full overflow-y-auto">
            <div className="text-center space-y-2 mb-6">
              <h1 className="font-bold tracking-tighter text-primary">Connect to your services</h1>
              <p className="text-foreground">
                Sign in to the services you want to link to your automations
              </p>
            </div>
            <div className="flex w-full justify-center mt-20">
              <div className="grid grid-cols-2 gap-12">
                {services.map((service) => (
                  <ConnectionCard
                    key={service.name}
                    serviceName={service.name}
                    image={`http://167.86.110.198:8085/images/${service.name.toLowerCase()}.png`}
                    status={service.status}
                  />
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default ConnectionsPage;
