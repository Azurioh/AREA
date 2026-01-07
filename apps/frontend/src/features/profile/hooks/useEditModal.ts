import { useEffect, useState } from 'react';
import { useApp } from '@/hooks/useApp';
import type { DysType } from '@area/shared/enums/user-enums';

export function useSaveProfile(initialUsername: string, darkMode: boolean, dyslexiaType: DysType) {
  const [editedUsername, setEditedUsername] = useState(initialUsername);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { updateUser } = useApp();

  const handleSave = () => {
    updateUser.updateExecutionState(editedUsername, darkMode, dyslexiaType);
    setTimeout(() => {
      window.location.reload();
    }, 500);
  };

  const openModal = () => {
    setEditedUsername(initialUsername);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleModalSave = () => {
    handleSave();
    closeModal();
  };

  const handleModalCancel = () => {
    setEditedUsername(initialUsername);
    closeModal();
  };

  useEffect(() => {
    setEditedUsername(initialUsername);
  }, [initialUsername]);

  return {
    editedUsername,
    setEditedUsername,
    isModalOpen,
    openModal,
    handleModalSave,
    handleModalCancel,
  };
}
