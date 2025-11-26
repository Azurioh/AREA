import { useState } from "react";

export function useSaveProfile(initialUsername: string, initialEmail: string, onEdit: (username: string, email: string) => void) {
  const [editedUsername, setEditedUsername] = useState(initialUsername);
  const [editedEmail, setEditedEmail] = useState(initialEmail);

  const handleSave = () => {
    onEdit(editedUsername, editedEmail);
  };

  return {
    editedUsername,
    editedEmail,
    setEditedUsername,
    setEditedEmail,
    handleSave,
  };
}
