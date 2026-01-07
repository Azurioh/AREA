import { Card } from '@/components/ui/card';
import { motion } from 'framer-motion';

export default function FloatingCard({
  logo,
  delay,
  offset,
}: {
  logo: string;
  delay: number;
  offset: { x: number; y: number };
}) {
  return (
    <motion.div
      initial={{ y: offset.y, x: offset.x, rotate: -2 }}
      animate={{
        y: [offset.y, offset.y - 20, offset.y - 40, offset.y - 20, offset.y],
        rotate: [-2, 2, -2],
      }}
      transition={{
        duration: 8,
        ease: 'easeInOut',
        repeat: Infinity,
        delay,
      }}
      className="w-24 h-24"
    >
      <Card className="w-full h-full flex items-center justify-center bg-card backdrop-blur-md shadow-xl shadow-primary/10 hover:shadow-primary/50 transition-shadow duration-300 rounded-2xl">
        <img src={logo} alt="service logo" className="w-10 h-10 object-contain" />
      </Card>
    </motion.div>
  );
}
