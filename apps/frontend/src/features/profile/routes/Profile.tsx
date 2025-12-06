import type React from 'react';
import SideBar from '@/components/SideBar';
import { Card, CardContent } from '@/components/wrappers/Card';
import ProfileCard from '@/features/profile/components/ProfileCard';

const mockProfile = {
  username: 'Ewan',
  email: 'Ewan@leewan.oui',
};

const Profile: React.FC = () => {
  return (
    <div className="flex h-screen bg-background">
      <SideBar />

      <main className="flex-1 ml-24 pr-4 pt-4">
        <Card className="h-full w-full rounded-b-none">
          <CardContent className="p-8 h-full overflow-y-auto flex flex-col items-center">
            <h1 className="font-bold tracking-tighter text-primary text-center mt-12 mb-12">Profile</h1>

            <div className="w-full max-w-4xl mb-12">
              <ProfileCard
                username={mockProfile.username}
                email={mockProfile.email}
                onEdit={(username, email) => {
                  console.log('Updated username:', username);
                  console.log('Updated email:', email);
                }}
                onLogout={() => console.log('logout')}
              />
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Profile;
