import { useState, useMemo } from 'react';
import type { GetAllUsers } from '@area/shared/schemas/users.schema';

export const useUserFilter = (users: GetAllUsers) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<'All' | 'Admin' | 'User'>('All');

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const matchesSearch =
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (user.email || '').toLowerCase().includes(searchQuery.toLowerCase());

      let matchesRole = true;
      if (roleFilter === 'Admin') {
        matchesRole = String(user.role) === '1';
      } else if (roleFilter === 'User') {
        matchesRole = String(user.role) === '2';
      }

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
