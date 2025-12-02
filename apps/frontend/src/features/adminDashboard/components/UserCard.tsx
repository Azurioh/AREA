import type React from 'react';
import { Button } from '@/components/wrappers/Button';
import { Card } from '@/components/wrappers/Card';
import { Checkbox } from '@/components/wrappers/CheckBox';
import { Label } from '@/components/ui/label';
import { Trash, Edit2 } from 'lucide-react';

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

interface UserCardProps {
  user: User;
}

const UserCard: React.FC<UserCardProps> = ({ user }) => {
    return (
        <Card className="bg-muted p-4">
            <div className="grid grid-cols-[40px_1fr_1fr_1fr_1fr] gap-6 items-center">
                <Checkbox id={`user-${user.id}`}/>
                <Label htmlFor={`user-${user.id}`} className="truncate">{user.name}</Label>
                <Label htmlFor={`user-${user.id}`} className="truncate">{user.email}</Label>
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
    );
};

export default UserCard;
