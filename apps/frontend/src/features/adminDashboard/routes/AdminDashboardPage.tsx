import React from "react";
import { Card, CardContent } from '@/components/wrappers/Card';
import { Input } from "@/components/wrappers/Input";
import { Button } from "@/components/wrappers/Button";
import { motion } from "framer-motion";
import { Search } from "lucide-react";
import SideBar from '@/components/SideBar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import UserCard from '../components/UserCard';
import { useUserFilter } from '../hooks/useUserFilter';
import { useGetAllUsers } from '../hooks/useGetAllUsers';

const AdminDashboardPage: React.FC = () => {
  const { users, loading, error } = useGetAllUsers();
  const { searchQuery, setSearchQuery, roleFilter, setRoleFilter, filteredUsers } = useUserFilter(users);

  return (
    <div className="flex h-screen bg-background">
      <SideBar />
      <main className="flex-1 ml-24 pr-4 pt-4" role="main" aria-label="User management dashboard">
        <Card className="h-full w-full rounded-b-none">
          <CardContent className="p-6 h-full overflow-y-auto">
            <div className="text-center space-y-2 mb-6">
              <h1 className="text-3xl font-bold tracking-tighter text-primary">User Management</h1>
              <p className="text-muted-foreground">
                Manage all users in one place. Control access, assign roles, or delete any users
              </p>
            </div>
            <div className="flex gap-4 mb-4 max-w-5xl mx-auto" role="search" aria-label="User search and filter">
              <div className="relative w-64">
                <label htmlFor="search-users" className="sr-only">
                  Search users by name or email
                </label>
                <Input
                  id="search-users"
                  type="text"
                  placeholder="Search users..."
                  className="pr-10 transition-all hover:border-primary"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  aria-label="Search users by name or email"
                />
                <Search 
                  className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" 
                  aria-hidden="true"
                />
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" aria-label="Filter users by role">
                    {roleFilter === 'All' ? 'Filter Users' : roleFilter}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start">
                  <DropdownMenuItem onClick={() => setRoleFilter('All')}>All Users</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setRoleFilter('Admin')}>Admin</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setRoleFilter('User')}>User</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="w-full max-w-5xl mx-auto"
            >
              <div className="lg:block bg-primary p-4 rounded-[var(--large-radius)] mb-4" role="row">
                <div className="grid grid-cols-[200px_1fr_1fr_1fr] gap-20 items-center">
                  <h2 className="font-semibold text-white text-xl">Name</h2>
                  <h2 className="font-semibold text-white text-xl">Email</h2>
                  <h2 className="font-semibold text-white text-xl">Role</h2>
                  <h2 className="font-semibold text-white text-xl">Actions</h2>
                </div>
              </div>
              <div 
                className="flex flex-col gap-3" 
                role="region" 
                aria-label="Users list" 
                aria-live="polite"
                aria-busy={loading}
              >
                {loading ? (
                  <div className="text-center py-8 text-muted-foreground" role="status">
                    <span>Loading users...</span>
                  </div>
                ) : error ? (
                  <div className="text-center py-8 text-destructive" role="alert">
                    Error loading users: {error}
                  </div>
                ) : filteredUsers.length > 0 ? (
                  filteredUsers.map((user) => <UserCard key={user._id} user={user} />)
                ) : (
                  <div className="text-center py-8 text-muted-foreground" role="status">
                    No users found
                  </div>
                )}
              </div>
            </motion.div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default AdminDashboardPage;
