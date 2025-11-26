import React from "react";
import ProfileCard from "@/features/profile/components/ProfileCard";
import ServiceCard from "@/features/profile/components/ServiceCard";

const mockProfile = {
  username: "Ewan",
  email: "Ewan@leewan.oui",
  avatar: "https://media.licdn.com/dms/image/v2/D4E35AQHkU_rrU0imDA/profile-framedphoto-shrink_800_800/profile-framedphoto-shrink_800_800/0/1709903949761?e=1764615600&v=beta&t=dpTNX9YmARmCWGUGZ_Y8Fi-uXAden3fp-FQI-Wx3Na0",
};

const mockServices = [
  { id: 1, title: "Service 1", img: mockProfile.avatar, connected: true },
  { id: 2, title: "Service 2", img: mockProfile.avatar, connected: false },
  { id: 3, title: "Service 3", img: mockProfile.avatar, connected: false },
  { id: 4, title: "Service 4", img: mockProfile.avatar, connected: true },
  { id: 5, title: "Service 5", img: mockProfile.avatar, connected: true },
  { id: 6, title: "Service 6", img: mockProfile.avatar, connected: false },
];

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

        <h2 className="text-card-foreground text-2xl mt-12 mb-6 font-text self-start md:ml-0 lg:ml-48">
          Services
        </h2>
          <div className="grid grid-cols-2 gap-10 w-full max-w-4xl">
          {mockServices.map((service) => (
              <ServiceCard
              key={service.id}
              title={service.title}
              img={service.img}
              connected={service.connected}
              onConnect={() =>
                  console.log(
                  service.connected
                      ? `disconnect ${service.title}`
                      : `connect ${service.title}`
                  )
              }
              />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Profile;
