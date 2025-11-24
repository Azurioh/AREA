import React from "react";
import ProfileCard from "@/components/ProfileCard";

const mockProfile = {
  username: "Ewan",
  email: "Ewan@leewan.oui",
  avatar: "https://media.licdn.com/dms/image/v2/D4E35AQHkU_rrU0imDA/profile-framedphoto-shrink_800_800/profile-framedphoto-shrink_800_800/0/1709903949761?e=1764615600&v=beta&t=dpTNX9YmARmCWGUGZ_Y8Fi-uXAden3fp-FQI-Wx3Na0",
};

const Profile: React.FC = () => {
  return (
    <div
      className="min-h-screen w-full flex flex-col items-center px-6 py-10"
      style={{
        background: "linear-gradient(135deg, #373C41 0%, #1B1F24 100%)",
      }}
    >
      <ProfileCard
        username={mockProfile.username}
        email={mockProfile.email}
        onEdit={() => console.log("edit")}
        onLogout={() => console.log("logout")}
      />

      <h2 className="text-white text-2xl font-bold mt-12 mb-6">Services</h2>
    </div>
  );
};

export default Profile;