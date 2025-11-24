import React from "react";
import { Card, CardContent } from "@/components/ui/card";

interface ProfileCardProps {
  username: string;
  email: string;
  onEdit: () => void;
  onLogout: () => void;
}

const ProfileCard: React.FC<ProfileCardProps> = ({ username, email, onEdit, onLogout }) => {
  return (
    <Card className="bg-[#40464F] p-6 rounded-[20px] shadow-lg w-full max-w-3xl">
      <CardContent className="flex items-center gap-6">
        <img
          src="https://media.licdn.com/dms/image/v2/D4E35AQHkU_rrU0imDA/profile-framedphoto-shrink_800_800/profile-framedphoto-shrink_800_800/0/1709903949761?e=1764615600&v=beta&t=dpTNX9YmARmCWGUGZ_Y8Fi-uXAden3fp-FQI-Wx3Na0"
          alt="Profile"
          className="w-28 h-28 rounded-[20px] object-cover"
        />

        <div className="flex flex-col flex-1 text-white">
          <h2 className="text-2xl font-semibold">{username}</h2>
          <p className="text-sm opacity-80">{email}</p>

          <div className="flex gap-4 mt-4">
            <button
              onClick={onEdit}
              className="px-4 py-2 bg-[#FDC426] text-black font-semibold rounded-[10px]"
            >
              Modifier
            </button>
            <button
              onClick={onLogout}
              className="px-4 py-2 bg-[#FDC426] text-black font-semibold rounded-[10px]"
            >
              Déconnexion
            </button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfileCard;
