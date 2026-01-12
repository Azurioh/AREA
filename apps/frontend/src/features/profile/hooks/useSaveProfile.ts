import { useEffect, useState } from 'react';

export function useSaveProfile(
  initialUsername: string,
  initialEmail: string,
  onEdit: (username: string, email: string) => void,
) {
  const [editedUsername, setEditedUsername] = useState(initialUsername);
  const [editedEmail, setEditedEmail] = useState(initialEmail);

  const handleSave = () => {
    onEdit(editedUsername, editedEmail);
  };

  const resetChanges = () => {
    setEditedUsername(initialUsername);
    setEditedEmail(initialEmail);
  };

  useEffect(() => {
    setEditedUsername(initialUsername);
    setEditedEmail(initialEmail);
  }, [initialUsername, initialEmail]);

  return {
    editedUsername,
    editedEmail,
    setEditedUsername,
    setEditedEmail,
    handleSave,
    resetChanges,
  };
}
