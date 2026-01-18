import { motion } from 'framer-motion';
import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/wrappers/Button';
import { useServiceAuthorization } from '../hooks/useServiceAuthorization';

interface ConnectionCardProps {
  image: string;
  serviceName: string;
  status: boolean;
}

const ConnectionCard: React.FC<ConnectionCardProps> = ({ image, serviceName, status }) => {
  const { handleSubmit } = useServiceAuthorization();

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-5xl mx-auto"
    >
      <Card className="p-3 pr-8 rounded-[var(--large-radius)] shadow-lg border-none bg-muted w-[570px] h-[90px]">
        <CardContent className="flex items-center gap-6 p-0 font-text justify-between">
          <div className="flex items-center gap-5">
            <Avatar className="w-16 h-16">
              <AvatarImage src={image} alt={serviceName} className="w-full h-full object-contain" />
            </Avatar>
            <h1 className="text-[30px]">{serviceName}</h1>
          </div>
          <div>
            {status ? (
              <Button className="text-[20px] bg-destructive hover:bg-destructive/80">Disconnect</Button>
            ) : (
              <Button className="text-[20px]" onClick={() => handleSubmit(serviceName)}>
                Connect
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ConnectionCard;
