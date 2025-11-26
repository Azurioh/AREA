import React from "react";
import { Card } from '@/components/ui/card';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { motion } from "framer-motion";
import { Search, Trash, Edit2 } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-8">
            <div className="text-center space-y-2 mb-6">
                <h1 className='text-3xl font-bold tracking-tighter'>User Management</h1>
                <p> Manage all users in one place. Control access, assign roles, or delete any users </p>
            </div>
            <div className="flex gap-4 mb-4">
                <div className="relative w-64">
                    <Input type="text" placeholder="Search users..." className="pr-10" />
                    <Button variant="ghost" size="icon" className="absolute right-0 top-0 h-full">
                        <Search className="h-4 w-4" />
                    </Button>
                </div>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline">Filter Users</Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <DropdownMenuItem>All Users</DropdownMenuItem>
                        <DropdownMenuItem>Admins</DropdownMenuItem>
                        <DropdownMenuItem>Users</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className='w-full max-w-5xl'
            >
                <Card className='bg-white p-4 space-y-4'>
                    <div className='bg-gray-200 p-4 rounded-lg'>
                        <div className="grid grid-cols-[10px_1fr_1fr_1fr_1fr] gap-6 items-center">
                            <Checkbox id="select-all" className="ml-4"/>
                            <Label htmlFor="select-all" className="font-semibold ml-12">Name</Label>
                            <h2 className="font-semibold ml-5">Email</h2>
                            <h2 className="font-semibold">Role</h2>
                            <h2 className="font-semibold">Actions</h2>
                        </div>
                    </div>
                    {users.map((user) => (
                        <Card key={user.id} className="bg-gray-100 p-4">
                            <div className="grid grid-cols-[40px_1fr_1fr_1fr_1fr] gap-6 items-center">
                                <Checkbox id={`user-${user.id}`}/>
                                <Label htmlFor={`user-${user.id}`}>{user.name}</Label>
                                <Label htmlFor={`user-${user.id}`}>{user.email}</Label>
                                <Label htmlFor={`user-${user.id}`}>{user.role}</Label>
                                <div className="flex gap-4 ml-4">
                                    <Button className="h-8 px-3">
                                        <Edit2 className="h-4 w-4 mr-2" />
                                        Edit
                                    </Button>
                                    <Button className="h-8 px-3">
                                        <Trash className="h-4 w-4 mr-2" />
                                        Delete
                                    </Button>
                                </div>
                            </div>
                        </Card>
                    ))}
                </Card>
            </motion.div>
        </div>
    );
};

export default AdminDashboardPage;