import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/wrappers/Button';
import { useAuthorization } from '../hooks/useAuthorization';

interface ConnectionCardProps {
  image: string;
  serviceName: string;
}

const ConnectionCard: React.FC<ConnectionCardProps> = ({ image, serviceName }) => {
  const { handleSubmit } = useAuthorization();

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-5xl mx-auto"
    >
      <Card className="p-6 rounded-[20px] shadow-lg w-full max-w-4xl border-none ring-0 outline-none relative bg-muted mb-5">
        <CardContent className="flex items-center gap-6 p-0 font-text justify-between">
          <div className="flex items-center gap-5">
            <img src={image} alt={serviceName} className="h-20 max-w-full object-contain" />
            <h1 className="text-[30px]">{serviceName}</h1>
          </div>
          <div>
            <Button className="text-[20px]" onClick={() => handleSubmit(serviceName)}>
              Connect
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ConnectionCard;
