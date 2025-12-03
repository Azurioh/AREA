import { House, Workflow, Link, LayoutDashboard, Plus } from "lucide-react"
import { Button } from "@/components/wrappers/Button"
import { useNavigate, useLocation } from "react-router-dom"
import { AppRoutesPaths } from "@/enums/routes"
import areaLogo from "@/assets/area_logo.png"
import { Avatar} from "@/components/ui/avatar"
import { useUserInformation } from "@/shared/hooks/useUserInformation"
import { useEffect } from "react"

const SideBar = () => {
    const navigate = useNavigate()
    const location = useLocation()
    const { getInitials } = useUserInformation()
    const name = localStorage.getItem('userInitials') || getInitials()

    useEffect(() => {
      localStorage.setItem('userInitials', name);
    }, []);

    const menuItems = [
        { icon: House, label: "Home", path: AppRoutesPaths.HOME, name: "Home" },
        { icon: Workflow, label: "Workflows", path: "/test", name: "Workflows" },
        { icon: Link, label: "Connections", path: "/test", name: "Connections" },
        { icon: LayoutDashboard, label: "Dashboard", path: AppRoutesPaths.ADMIN_DASHBOARD, name: "Dashboard" },
    ]

  return (
    <aside className="fixed left-0 top-0 h-screen w-24 bg-background flex flex-col items-center py-8 gap-4">
      <div>
        <img src={areaLogo} alt="Area Logo" className="w-16 h-6" />
      </div>
      <div className="flex flex-col items-center pt-6 mb-10">
        <Button className="rounded-[30px] w-12 h-12">
          {' '}
          <Plus className="h-16 w-16 scale-[2]" />
        </Button>
        <p className="text-xs"> Create </p>
      </div>
      {menuItems.map((item) => {
        const isActive = location.pathname === item.path;
        return (
          <div key={item.label} className="flex flex-col items-center">
            <Button
              variant="ghost"
              size="icon"
              className={`w-10 h-10 rounded-[var(--small-radius)] ${isActive ? 'bg-primary text-primary-foreground hover:bg-primary' : ''}`}
              onClick={() => navigate(item.path)}
              title={item.label}
            >
              <item.icon className="h-10 w-10 scale-150" />
            </Button>
            <p className="text-xs">{item.name}</p>
          </div>
        );
      })}
      <div className="mt-auto bg-primary p-1 rounded-full hover:bg-bordered-foreground cursor-pointer group border-card border-4">
        <Button
          variant="ghost"
          size="icon"
          title="avatar"
          onClick={() => navigate(AppRoutesPaths.PROFILE)}
          className=" rounded-[30px] w-16 h-16 flex items-center justify-center"
        >
          <Avatar className="w-10 h-10 p-0.5 scale-125 items-center justify-center">
            <p className="text-2xl text-primary-foreground group-hover:text-foreground">{name}</p>
          </Avatar>
        </Button>
      </div>
    </aside>
  );
}

export default SideBar
