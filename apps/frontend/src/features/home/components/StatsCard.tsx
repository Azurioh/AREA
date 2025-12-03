import { Card, CardContent } from "@/components/ui/card";
import organizationIcon from '@/assets/organization.png';
import { motion } from 'framer-motion';

interface StatsCardProps {
  title: string;
  value: string | number;
}

export default function StatsCard({ title, value }: StatsCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-5xl mx-auto"
    >
      <Card className="p-4 flex items-center justify-between rounded-[var(--large-radius)] bg-muted min-w-[18rem]">
        <div className="flex flex-col">
          <span className="text-muted-foreground whitespace-nowrap">{title}</span>
          <span className="text-3xl whitespace-nowrap">{value}</span>
        </div>

        <div className="h-full flex items-center">
          <img src={organizationIcon} alt="icon" className="h-full object-contain" />
        </div>
      </Card>
    </motion.div>
  );
}
