import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface ProfileCardProps {
  username: string;
  img: string;
  email: string;
  onEdit: (username: string, email: string) => void;
  onLogout: () => void;
}

const ProfileCard: React.FC<ProfileCardProps> = ({ username, email, img, onEdit, onLogout }) => {
  const [editedUsername, setEditedUsername] = useState(username);
  const [editedEmail, setEditedEmail] = useState(email);

  const handleSave = () => {
    onEdit(editedUsername, editedEmail);
  };

  return (
    <Card className="bg-card p-6 rounded-[20px] shadow-lg w-full max-w-4xl border-none ring-0 outline-none relative">
      <Button
        onClick={onLogout}
        className="absolute top-6 right-6 px-4 py-2 bg-primary text-primary-foreground font-semibold rounded-[10px]"
        style={{ fontFamily: 'Poppins-medium' }}
      >
        Disconnect
      </Button>
      <CardContent className="flex items-center gap-6 p-0" style={{ fontFamily: 'Montserrat-medium' }}>
        <img
          src={img}
          alt="Profile"
          className="w-40 h-48 rounded-[20px] object-cover"
        />
        <div className="flex flex-col flex-1 text-card-foreground gap-2 justify-center h-28">
          <input
            type="text"
            value={editedUsername}
            onChange={(e) => setEditedUsername(e.target.value)}
            className="bg-[var(--input-background)] outline-none rounded-[10px] shadow-[inset_0_0_12px_rgba(0,0,0,0.6)] w-80 h-10 px-3"
            style={{ fontFamily: 'Montserrat-medium' }}
          />
          <input
            type="email"
            value={editedEmail}
            onChange={(e) => setEditedEmail(e.target.value)}
            className="bg-[var(--input-background)] outline-none rounded-[10px] shadow-[inset_0_0_12px_rgba(0,0,0,0.6)] w-80 h-10 px-3"
            style={{ fontFamily: 'Montserrat-medium' }}
          />
          <div className="flex gap-4 mt-4">
            <Button
              onClick={handleSave}
              className="px-4 py-2 bg-primary text-primary-foreground font-semibold rounded-[10px]"
              style={{ fontFamily: 'Poppins-medium' }}
            >
              save
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfileCard;
