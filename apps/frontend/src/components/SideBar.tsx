import { useState } from 'react';
import { House, Workflow, Link, LayoutDashboard, Plus } from 'lucide-react';
import { Button } from '@/components/wrappers/Button';
import { useNavigate, useLocation } from 'react-router-dom';
import { AppRoutesPaths } from '@/enums/routes';
import areaLogo from '@/assets/area_logo.png';
import { Avatar } from '@/components/ui/avatar';
import { useUserInitials } from '@/shared/hooks/useUserInitials';
import { useApp } from '@/hooks/useApp';
import { useUserInformation } from '@/shared/hooks/useUserInformation';
import Profile from '@/features/profile/components/ProfileCard';

const SideBar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { authState } = useApp();
  const { user } = useUserInformation();
  const name = useUserInitials();

  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const menuItems = [
    { icon: House, label: 'Home', path: AppRoutesPaths.HOME, name: 'Home' },
    {
      icon: Workflow,
      label: 'Workflows',
      path: AppRoutesPaths.WORKFLOWS,
      name: 'Workflows',
    },
    {
      icon: Link,
      label: 'Connections',
      path: AppRoutesPaths.CONNECTIONS,
      name: 'Connections',
    },
    {
      icon: LayoutDashboard,
      label: 'Dashboard',
      path: AppRoutesPaths.ADMIN_DASHBOARD,
      name: 'Dashboard',
      adminOnly: true,
    },
  ];

  const visibleMenuItems = menuItems.filter((item) => {
    if (item.adminOnly) {
      return authState.user?.role === 1;
    }
    return true;
  });

  return (
    <>
      <nav
        className="fixed left-0 top-0 h-screen w-24 bg-background flex flex-col items-center py-8 gap-4"
        aria-label="Main navigation"
      >
        <div className="mb-4">
          <img src={areaLogo} alt="Area application logo" className="w-16 h-6" />
        </div>

        <div className="flex flex-col items-center pt-6 mb-10">
          <Button
            className="rounded-[30px] w-12 h-12"
            onClick={() => navigate(AppRoutesPaths.CREATE)}
            aria-label="Create new workflow"
          >
            <Plus className="h-16 w-16 scale-[2]" aria-hidden="true" />
          </Button>
          <span className="text-xs mt-1" aria-hidden="true">
            Create
          </span>
        </div>

        <nav className="flex flex-col items-center gap-4" aria-label="Main menu">
          {visibleMenuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <div key={item.label} className="flex flex-col items-center">
                <Button
                  variant="ghost"
                  size="icon"
                  className={`w-10 h-10 rounded-[var(--small-radius)] ${isActive ? 'bg-primary text-primary-foreground hover:bg-primary' : ''}`}
                  onClick={() => navigate(item.path)}
                  aria-label={`Navigate to ${item.label}`}
                  aria-current={isActive ? 'page' : undefined}
                >
                  <item.icon className="h-10 w-10 scale-150" aria-hidden="true" />
                </Button>
                <span className="text-xs mt-1" aria-hidden="true">
                  {item.name}
                </span>
              </div>
            );
          })}
        </nav>

        <div className="mt-auto">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            aria-label={`${isProfileOpen ? 'Close' : 'Open'} user profile menu`}
            aria-expanded={isProfileOpen}
            aria-haspopup="dialog"
            className="rounded-full w-16 h-16 bg-primary hover:bg-primary/90 border-card border-4 p-0"
          >
            <Avatar className="w-10 h-10 flex items-center justify-center">
              <span className="text-2xl text-primary-foreground" aria-hidden="true">
                {name}
              </span>
            </Avatar>
          </Button>
        </div>
      </nav>

      <Profile
        username={user?.name || 'User'}
        email={user?.email || ''}
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        onLogout={() => {
          localStorage.clear();
          window.location.reload();
        }}
        darkMode={user?.darkModeEnabled || false}
        dyslexiaType={user?.dyslexiaEnabled || false}
      />
    </>
  );
};

export default SideBar;
