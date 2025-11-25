import React from "react";
import ProfileCard from "@/features/profile/components/ProfileCard";

const mockProfile = {
  username: "Ewan",
  email: "Ewan@leewan.oui",
  avatar: "https://media.licdn.com/dms/image/v2/D4E35AQHkU_rrU0imDA/profile-framedphoto-shrink_800_800/profile-framedphoto-shrink_800_800/0/1709903949761?e=1764615600&v=beta&t=dpTNX9YmARmCWGUGZ_Y8Fi-uXAden3fp-FQI-Wx3Na0",
};

const Profile: React.FC = () => {
  return (
    <div
      className="min-h-screen w-full flex flex-col items-center justify-center px-6 py-10"
      style={{
        background: "var(--background-gradient)",
      }}
    >
      <div className="container mx-auto flex flex-col justify-center items-center">
        <div className="flex flex-col justify-center items-center w-full">
           <ProfileCard
              username={mockProfile.username}
              email={mockProfile.email}
              img={mockProfile.avatar}
              onEdit={(username, email) => {
                console.log("Updated username:", username);
                console.log("Updated email:", email);
              }}
              onLogout={() => console.log("logout")}
            />
        </div>

        <h2 className="text-card-foreground text-2xl mt-12 mb-6 self-start w-full pl-48" style={{ fontFamily: 'Montserrat-bold' }}>
          Services
        </h2>
      </div>
    </div>
  );
};

export default Profile;
