import type React from 'react';
import { Button } from '@/components/wrappers/Button';
import { Card } from '@/components/wrappers/Card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/wrappers/Input';
import { Trash, X } from 'lucide-react';
import { useDeleteUser } from '../hooks/useDeleteUser';
import { useDeleteConfirmation } from '../hooks/useDeleteConfirmation';
import { enums } from '@area/shared';

interface User {
  _id: string;
  name: string;
  email: string;
  role: enums.userEnums.UserRoles;
}

interface UserCardProps {
  user: User;
}

const UserCard: React.FC<UserCardProps> = ({ user }) => {
  const { deleteUser } = useDeleteUser();
  const { isDialogOpen, confirmText, setConfirmText, handleDelete, openDialog, closeDialog } = useDeleteConfirmation(deleteUser);

  return (
    <>
      <Card className="bg-muted p-4">
        <div className="grid grid-cols-[minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)] gap-32 items-center">
          <Label htmlFor={`user-${user._id}`} className="truncate text-sm">
            {user.name}
          </Label>
          <Label htmlFor={`user-${user._id}`} className="truncate text-sm">
            {user.email}
          </Label>
          <Label htmlFor={`user-${user._id}`} className="truncate text-sm">
            {user.role === enums.userEnums.UserRoles.ADMIN ? 'Admin' : 'User'}
          </Label>
          <div className="flex ">
            <Button className="h-8 px-2 md:px-3 truncate bg-destructive/80 hover:bg-destructive/50 text-xs md:text-sm" onClick={() => openDialog(user._id)}>
              <Trash className="h-4 w-4 md:mr-2" />
              <span className="hidden md:inline">Delete</span>
            </Button>
          </div>
        </div>
      </Card>

      {isDialogOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={closeDialog}>
          <div className="bg-card p-6 rounded-lg shadow-lg max-w-md w-full mx-4" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-primary">Confirm Deletion</h2>
              <Button variant="ghost" size="icon" onClick={closeDialog} className="h-8 w-8">
                <X className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-foreground mb-4">
              To delete the user <span className="font-semibold text-primary">{user.name}</span>, write "delete" in the text field below:
            </p>
            <Input
              type="text"
              placeholder="Type 'delete' to confirm"
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              className="mb-4 bg-card"
            />
            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={closeDialog} className='bg-primary hover:bg-primary/80 text-card'>
                Cancel
              </Button>
              <Button
                className="bg-destructive hover:bg-destructive/80"
                onClick={handleDelete}
                disabled={confirmText.toLowerCase() !== 'delete'}
              >
                Delete User
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default UserCard;
