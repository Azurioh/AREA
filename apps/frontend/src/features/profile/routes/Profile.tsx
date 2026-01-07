import type React from 'react';
import { useEffect } from 'react';
import SideBar from '@/components/SideBar';
import { Card, CardContent } from '@/components/wrappers/Card';
import ProfileCard from '@/features/profile/components/ProfileCard';
import { useUserInformation } from '@/shared/hooks/useUserInformation';

const Profile: React.FC = () => {
  const { user } = useUserInformation();

  useEffect(() => {
    console.log('User information:', user);
  }, [user]);

  return (
    <div className="flex h-screen bg-background">
      <SideBar />

      <main className="flex-1 ml-24 pr-4 pt-4">
        <Card className="h-full w-full rounded-b-none">
          <CardContent className="p-6 h-full overflow-y-auto">
            <div className="text-center space-y-2 mb-6">
              <h1 className="font-bold tracking-tighter text-primary">Profile</h1>
              <p className="text-foreground">Manage your profile information and account settings here.</p>
            </div>
            <div className="w-full align-items-center mb-12">
              <ProfileCard
                username={user?.name || ''}
                email={user?.email || ''}
                onEdit={(username) => {
                  console.log('Updated username:', username);
                }}
                onLogout={() => {
                  localStorage.clear();
                  window.location.reload();
                }}
              />
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Profile;
