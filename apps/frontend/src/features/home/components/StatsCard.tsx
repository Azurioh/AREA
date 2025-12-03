import { Card, CardContent } from "@/components/ui/card";
import organizationIcon from '@/assets/organization.png';

interface StatsCardProps {
  title: string;
  value: string | number;
}

export default function StatsCard({ title, value }: StatsCardProps) {
  return (
    <Card className="p-4 flex items-center justify-between  rounded-[var(--large-radius)]">
      <div className="flex flex-col">
        <span className="text-muted-foreground">{title}</span>
        <span className="text-3xl">{value}</span>
      </div>

      <div className="h-full flex items-center">
        <img src={organizationIcon} alt="icon" className="h-full object-contain" />
      </div>
    </Card>
  );
}
