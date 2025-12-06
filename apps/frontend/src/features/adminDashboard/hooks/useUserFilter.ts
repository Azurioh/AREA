import { useState, useMemo } from 'react';

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

export const useUserFilter = (users: User[]) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<'All' | 'Admin' | 'User'>('All');

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const matchesSearch =
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesRole = roleFilter === 'All' || user.role === roleFilter;
      return matchesSearch && matchesRole;
    });
  }, [searchQuery, roleFilter, users]);

  return {
    searchQuery,
    setSearchQuery,
    roleFilter,
    setRoleFilter,
    filteredUsers,
  };
};
