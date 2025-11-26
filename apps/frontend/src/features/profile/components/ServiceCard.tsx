import React from "react";
import { Card, CardContent } from "@/components/ui/card";

interface ServiceCardProps {
  title: string;
  img: string;
  connected: boolean;
  onConnect: () => void;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ title, img, connected, onConnect }) => {
  return (
    <Card className="bg-card p-6 rounded-[20px] shadow-lg w-full outline-none border-none h-28 flex items-center">
      <CardContent className="flex flex-row items-center gap-4 w-full p-0">
        <img src={img} alt={title} className="w-20 h-20 object-cover" />
        <h3 className="text-lg font-text">{title}</h3>
        <button
          onClick={onConnect}
          className={`px-4 py-2 rounded-[10px] ml-auto font-button ${
            connected ? "bg-[var(--input-background)]" : "bg-primary text-primary-foreground"
          }`}
        >
          {connected ? "Connecté" : "Connexion"}
        </button>
      </CardContent>
    </Card>
  );
};

export default ServiceCard;
