import React from "react";
import { Card } from '@/components/wrappers/Card';
import { Input } from "@/components/wrappers/Input";
import { Button } from "@/components/wrappers/Button";
import { Checkbox } from "@/components/wrappers/CheckBox";
import { Label } from "@/components/ui/label";
import { motion } from "framer-motion";
import { Search } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import UserCard from "../components/UserCard";
import { useUserFilter } from "../hooks/useUserFilter";

const users = [
    { id: 1, name: "John Doe", email: "john.doe@example.com", role: "Admin" },
    { id: 2, name: "Jane Smith", email: "jane.smith@example.com", role: "User" },
    { id: 3, name: "Bob Johnson", email: "bob.johnson@example.com", role: "User" },
    { id: 4, name: "Alice Brown", email: "alice.brown@example.com", role: "Admin" },
    { id: 5, name: "Charlie Davis", email: "charlie.davis@example.com", role: "User" },
    { id: 6, name: "Diana Evans", email: "diana.evans@example.com", role: "User" },
    { id: 7, name: "Frank Miller", email: "frank.miller@example.com", role: "Admin" },
    { id: 8, name: "Grace Wilson", email: "grace.wilson@example.com", role: "User" },
    { id: 9, name: "Henry Taylor", email: "henry.taylor@example.com", role: "User" },
    { id: 10, name: "Ivy Anderson", email: "ivy.anderson@example.com", role: "Admin" },
];

const AdminDashboardPage: React.FC = () => {
    const { searchQuery, setSearchQuery, roleFilter, setRoleFilter, filteredUsers } = useUserFilter(users);

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-background p-8">
            <div className="text-center space-y-2 mb-6">
                <h1 className='font-bold tracking-tighter text-foreground text-primary'>User Management</h1>
                <p className='text-foreground'> Manage all users in one place. Control access, assign roles, or delete any users </p>
            </div>
            <div className="bg-card flex gap-4 mb-4 p-2 rounded-[var(--large-radius)]">
                <div className="relative w-64">
                    <Input
                        type="text"
                        placeholder="Search users..."
                        className="pr-10"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <Button variant="ghost" size="icon" className="absolute right-0 top-0 h-full">
                        <Search className="h-4 w-4" />
                    </Button>
                </div>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline">
                            {roleFilter === "All" ? "Filter Users" : roleFilter}
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <DropdownMenuItem onClick={() => setRoleFilter("All")}>All Users</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setRoleFilter("Admin")}>Admins</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setRoleFilter("User")}>Users</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className='w-full max-w-5xl'
            >
                <Card className='bg-card p-4 space-y-4'>
                    <div className='bg-primary p-4 rounded-t-[var(--large-radius)] -mx-4 -mt-4 mb-4'>
                        <div className="grid grid-cols-[10px_1fr_1fr_1fr_1fr] gap-6 items-center">
                            <Checkbox id="select-all" className="ml-4"/>
                            <h2 className="font-semibold ml-12 text-white text-xl">Name</h2>
                            <h2 className="font-semibold ml-5 text-white text-xl">Email</h2>
                            <h2 className="font-semibold text-white text-xl">Role</h2>
                            <h2 className="font-semibold text-white text-xl">Actions</h2>
                        </div>
                    </div>
                    {filteredUsers.length > 0 ? (
                        filteredUsers.map((user) => (
                            <UserCard key={user.id} user={user} />
                        ))
                    ) : (
                        <div className="text-center py-8 text-muted-foreground">
                            No users found
                        </div>
                    )}
                </Card>
            </motion.div>
        </div>
    );
};

export default AdminDashboardPage;
