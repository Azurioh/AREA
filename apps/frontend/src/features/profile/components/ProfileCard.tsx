import { motion } from 'framer-motion';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useSaveProfile } from '@/features/profile/hooks/useSaveProfile';

interface ProfileCardProps {
  username: string;
  email: string;
  onEdit: (username: string, email: string) => void;
  onLogout: () => void;
}

const ProfileCard: React.FC<ProfileCardProps> = ({ username, email, onEdit, onLogout }) => {
  const { editedUsername, editedEmail, setEditedUsername, setEditedEmail, handleSave } = useSaveProfile(
    username,
    email,
    onEdit,
  );

  const getInitials = (name: string) => {
    return name.slice(0, 2).toUpperCase();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-5xl mx-auto"
    >
      <Card className="p-6 rounded-[20px] shadow-lg w-full max-w-4xl border-none ring-0 outline-none relative bg-muted">
        <Button
          onClick={onLogout}
          className="absolute top-6 right-6 px-4 py-2 bg-primary text-primary-foreground font-semibold rounded-[10px] font-button text-base"
        >
          Disconnect
        </Button>
        <CardContent className="flex items-center gap-6 p-0 font-text">
          <Avatar className="w-44 h-44 rounded-full">
            <AvatarFallback className="text-7xl font-bold flex items-center justify-center bg-primary text-card">
              {getInitials(username)}
            </AvatarFallback>
          </Avatar>

          <div className="flex flex-col flex-1 text-card-foreground gap-2 justify-center h-28 pt-16">
            <Input
              type="text"
              value={editedUsername}
              onChange={(e) => setEditedUsername(e.target.value)}
              className="outline-none rounded-[10px] w-80 h-10 px-3 font-text border-none !text-xl bg-card"
            />
            <Input
              type="email"
              value={editedEmail}
              onChange={(e) => setEditedEmail(e.target.value)}
              className="outline-none rounded-[10px] w-80 h-10 px-3 font-text border-none !text-xl bg-card"
            />
            <div className="flex gap-4 mt-4">
              <Button
                onClick={handleSave}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-[10px] font-button text-base"
              >
                Save
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ProfileCard;
