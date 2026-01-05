import { useState } from 'react';

export const useDeleteConfirmation = (deleteUser: (userId: string) => Promise<boolean>) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [confirmText, setConfirmText] = useState('');
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  const handleDelete = async () => {
    if (confirmText.toLowerCase() === 'delete' && currentUserId) {
      const success = await deleteUser(currentUserId);
      if (success) {
        setIsDialogOpen(false);
        setConfirmText('');
        setCurrentUserId(null);
      }
    }
  };

  const openDialog = (userId: string) => {
    setCurrentUserId(userId);
    setIsDialogOpen(true);
    setConfirmText('');
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
    setConfirmText('');
    setCurrentUserId(null);
  };

  return { isDialogOpen, confirmText, setConfirmText, handleDelete, openDialog, closeDialog };
};
