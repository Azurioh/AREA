import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface ProfileCardProps {
  username: string;
  img: string;
  email: string;
  onEdit: () => void;
  onLogout: () => void;
}

const ProfileCard: React.FC<ProfileCardProps> = ({ username, email, img, onEdit, onLogout }) => {
  return (
    <Card className="bg-card p-6 rounded-[20px] shadow-lg w-full max-w-3xl border-none ring-0 outline-none relative">
      <Button
        onClick={onEdit}
        className="absolute top-6 right-6 px-4 py-2 bg-primary text-primary-foreground font-semibold rounded-[10px]"
        style={{ fontFamily: 'Poppins-medium' }}
      >
        Modifier
      </Button>
      <CardContent className="flex items-center gap-6 p-0" style={{ fontFamily: 'Montserrat-medium' }}>
        <img
          src={img}
          alt="Profile"
          className="w-28 h-28 rounded-[20px] object-cover"
        />
        <div className="flex flex-col flex-1 text-card-foreground gap-2 justify-center h-28">
          <h2 className="text-2xl font-semibold">{username}</h2>
          <p className="text-sm opacity-80">{email}</p>
          <div className="flex gap-4 mt-4">
            <Button
              onClick={onLogout}
              className="px-4 py-2 bg-primary text-primary-foreground font-semibold rounded-[10px]"
              style={{ fontFamily: 'Poppins-medium' }}
            >
              Déconnexion
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfileCard;