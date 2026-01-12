import { motion, AnimatePresence } from 'framer-motion';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/wrappers/Input';
import { useSaveProfile } from '@/features/profile/hooks/useEditModal';
import type {} from '@area/shared/enums/user-enums';

interface ProfileCardProps {
  username: string;
  email: string;
  onLogout: () => void;
  darkMode: boolean;
  dyslexia: boolean;
}

const ProfileCard: React.FC<ProfileCardProps> = ({ username, email, onLogout, darkMode, dyslexia }) => {
  const { editedUsername, setEditedUsername, isModalOpen, openModal, handleModalSave, handleModalCancel } =
    useSaveProfile(username, darkMode, dyslexia);

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
          className="absolute top-6 right-6 px-4 py-2 bg-destructive hover:bg-destructive/80 text-primary-foreground font-semibold font-button text-base"
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
            <p className="font-semibold text-3xl"> {username}</p>
            <p className="text-lg"> {email}</p>
            <div className="flex gap-4 mt-4">
              <Button
                onClick={openModal}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-[10px] font-button text-base"
              >
                Edit
              </Button>
            </div>
          </div>
        </CardContent>

        <AnimatePresence>
          {isModalOpen && (
            <motion.div
              className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleModalCancel}
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="w-full max-w-md mx-4"
                onClick={(e) => e.stopPropagation()}
              >
                <Card className="border-primary overflow-hidden">
                  <CardContent className="p-6">
                    <h3 className="text-xl font-semibold mb-4 text-center">Edit Profile</h3>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label htmlFor="username" className="text-sm font-medium">
                          Username
                        </label>
                        <Input
                          id="username"
                          value={editedUsername}
                          onChange={(e) => setEditedUsername(e.target.value)}
                          placeholder="Enter username"
                        />
                      </div>
                      <div className="pt-4 flex gap-3">
                        <Button className="flex-1" onClick={handleModalSave}>
                          Save
                        </Button>
                        <Button variant="outline" onClick={handleModalCancel}>
                          Cancel
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>
    </motion.div>
  );
};

export default ProfileCard;
