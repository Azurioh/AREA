import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Activity, AlignEndHorizontal, Workflow } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string | number;
  type: 'active' | 'all' | 'actions';
}

export default function StatsCard({ title, value, type }: StatsCardProps) {
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
          {(type === 'active' && <Activity className="h-10 w-10" />) ||
            (type === 'all' && <Workflow className="h-10 w-10" />) ||
            (type === 'actions' && <AlignEndHorizontal className="h-10 w-10" />)}
        </div>
      </Card>
    </motion.div>
  );
}
