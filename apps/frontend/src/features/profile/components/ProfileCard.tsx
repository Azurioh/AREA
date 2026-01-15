import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Avatar } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/wrappers/Input';
import { Settings, LogOut, Moon, Sun, Type } from 'lucide-react';
import { useSaveProfile } from '@/features/profile/hooks/useEditModal';

interface ProfileDropdownProps {
  username: string;
  email: string;
  isOpen: boolean;
  onClose: () => void;
  onLogout: () => void;
  darkMode: boolean;
  dyslexiaType: boolean;
}

const ProfileCard: React.FC<ProfileDropdownProps> = ({
  username,
  email,
  isOpen,
  onClose,
  onLogout,
  darkMode: initialDarkMode,
  dyslexiaType: initialDyslexiaType,
}) => {
  const [isSettingsOpen, setIsSettingsOpen] = React.useState(false);
  const [darkMode, setDarkMode] = React.useState(initialDarkMode);
  const [dyslexiaMode, setDyslexiaMode] = React.useState(initialDyslexiaType);

  const { editedUsername, setEditedUsername, handleModalSave, handleModalCancel } = useSaveProfile(
    username,
    darkMode,
    dyslexiaMode,
  );

  const getInitials = (name: string) => name.slice(0, 2).toUpperCase();

  React.useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  React.useEffect(() => {
    if (dyslexiaMode) {
      document.body.classList.add('theme-dyslexia');
    } else {
      document.body.classList.remove('theme-dyslexia');
    }
  }, [dyslexiaMode]);

  React.useEffect(() => {
    setDarkMode(initialDarkMode);
    setDyslexiaMode(initialDyslexiaType);
  }, [initialDarkMode, initialDyslexiaType]);

  const handleLogout = () => {
    onClose();
    onLogout();
  };

  const handleSaveUsername = () => {
    handleModalSave();
    setIsSettingsOpen(false);
  };

  const handleCancelEdit = () => {
    handleModalCancel();
    setDarkMode(initialDarkMode);
    setDyslexiaMode(initialDyslexiaType);
    setIsSettingsOpen(false);
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40"
            onClick={onClose}
            aria-hidden="true"
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, x: -20, y: 20 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            exit={{ opacity: 0, x: -20, y: 20 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-8 left-28 z-50"
            role="dialog"
            aria-modal="true"
            aria-labelledby="profile-title"
          >
            <Card className="w-80 shadow-xl border-2 border-border">
              <CardContent className="p-0">
                <div className="p-4 border-b border-border bg-muted/50">
                  <div className="flex items-center gap-3">
                    <Avatar className="w-12 h-12 bg-primary" aria-hidden="true">
                      <div className="w-full h-full flex items-center justify-center text-lg font-bold text-primary-foreground">
                        {getInitials(username)}
                      </div>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p id="profile-title" className="font-semibold text-base truncate">{username}</p>
                      <p className="text-sm text-muted-foreground truncate">{email}</p>
                    </div>
                  </div>
                </div>

                <nav className="p-2" aria-label="Profile menu">
                  <Button
                    variant="ghost"
                    onClick={() => setIsSettingsOpen(true)}
                    className="w-full justify-start gap-3 px-3 py-2.5 h-auto font-medium"
                    aria-label="Open settings"
                  >
                    <Settings className="w-5 h-5" aria-hidden="true" />
                    <span>Settings</span>
                  </Button>

                  <Button
                    variant="ghost"
                    onClick={handleLogout}
                    className="w-full justify-start gap-3 px-3 py-2.5 h-auto font-medium text-destructive hover:bg-destructive/10 hover:text-destructive"
                    aria-label="Log out of your account"
                  >
                    <LogOut className="w-5 h-5" aria-hidden="true" />
                    <span>Log Out</span>
                  </Button>
                </nav>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isSettingsOpen && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleCancelEdit}
            role="dialog"
            aria-modal="true"
            aria-labelledby="settings-title"
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
                  <h2 id="settings-title" className="text-xl font-semibold mb-6 text-center">Settings</h2>

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
                        aria-label="Edit username"
                        className="transition-all hover:border-primary"
                      />
                    </div>

                    <div className="flex items-center justify-between p-3 rounded-lg border border-border">
                      <div className="flex items-center gap-3">
                        {darkMode ? <Moon className="w-5 h-5" aria-hidden="true" /> : <Sun className="w-5 h-5" aria-hidden="true" />}
                        <span className="font-medium">Dark Mode</span>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={darkMode}
                          onChange={(e) => setDarkMode(e.target.checked)}
                          className="sr-only peer"
                          aria-label="Toggle dark mode"
                        />
                        <div className="w-11 h-6 bg-muted peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary peer-focus:ring-offset-2 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between p-3 rounded-lg border border-border">
                      <div className="flex items-center gap-3">
                        <Type className="w-5 h-5" aria-hidden="true" />
                        <span className="font-medium">Dyslexia Font</span>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={dyslexiaMode}
                          onChange={(e) => setDyslexiaMode(e.target.checked)}
                          className="sr-only peer"
                          aria-label="Toggle dyslexia-friendly font"
                        />
                        <div className="w-11 h-6 bg-muted peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary peer-focus:ring-offset-2 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                      </label>
                    </div>

                    <div className="pt-4 flex gap-3">
                      <Button className="flex-1" onClick={handleSaveUsername} aria-label="Save settings">
                        Save
                      </Button>
                      <Button variant="outline" onClick={handleCancelEdit} aria-label="Cancel and close settings">
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
    </>
  );
};

export default ProfileCard;
