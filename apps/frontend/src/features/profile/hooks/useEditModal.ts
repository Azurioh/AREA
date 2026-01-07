import { useEffect, useState } from 'react';

export function useSaveProfile(initialUsername: string, onEdit: (username: string) => void) {
  const [editedUsername, setEditedUsername] = useState(initialUsername);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSave = () => {
    onEdit(editedUsername);
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
