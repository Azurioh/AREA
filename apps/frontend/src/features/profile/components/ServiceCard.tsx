import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface ServiceCardProps {
  title: string;
  img: string;
  connected: boolean;
  onConnect: () => void;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ title, img, connected, onConnect }) => {
  return (
    <Card className="p-6 rounded-[20px] shadow-lg w-full outline-none border-none h-20 flex items-center bg-muted">
      <CardContent className="flex flex-row items-center gap-4 w-full p-0">
        <img src={img} alt={title} className="w-16 h-16 object-cover" />
        <h3 className="text-lg font-text">{title}</h3>
        <Button
          onClick={onConnect}
          className={`px-4 py-2 rounded-[10px] ml-auto font-button ${
            connected
              ? 'bg-[var(--switch-disabled)] pointer-events-none cursor-default'
              : 'bg-primary text-primary-foreground'
          }`}
        >
          {connected ? 'Connecté' : 'Connexion'}
        </Button>
      </CardContent>
    </Card>
  );
};

export default ServiceCard;
