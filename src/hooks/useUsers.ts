// src/hooks/useUsers.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { usersApi } from '../api/usersApi';
import type { 
  GetUsersParams, 
  CreateUserInput, 
  UpdateUserInput 
} from '../api/usersApi.types';
import { useAuthStore } from '../store/authStore';

// ── Query Keys ───────────────────────────────────────────────────────────────
// export const userKeys = {
//   all: ['users'] as const,
//   list: (params: GetUsersParams) => ['users', 'list', params] as const,
// };

// // ── Get Users with filters & pagination ─────────────────────────────────────
// export function useUsers(params: GetUsersParams = {}) {
//   return useQuery({
//     queryKey: userKeys.list(params),
//     queryFn: () => usersApi.getAll(params),
//     staleTime: 30 * 1000,           // 30 seconds
//   });
// }
export const userKeys = {
  all: ['users'] as const,
  list: (params: GetUsersParams, userId?: string) => ['users', 'list', params, userId] as const,
};

export function useUsers(params: GetUsersParams = {}) {
  const { user } = useAuthStore();

  return useQuery({
    queryKey: userKeys.list(params, user?.id),
    queryFn: () => usersApi.getAll(params),
    staleTime: 30 * 1000,
    enabled: !!user,
  });
}

// ── Create New User ─────────────────────────────────────────────────────────
export function useCreateUser() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateUserInput) => usersApi.create(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: userKeys.all });
      toast.success('User created successfully!');
    },
    onError: (err: any) => {
      const message = err?.message || 'Failed to create user';
      toast.error(message);
    },
  });
}

// ── Update User ─────────────────────────────────────────────────────────────
export function useUpdateUser() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateUserInput }) =>
      usersApi.update(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: userKeys.all });
      toast.success('User updated successfully!');
    },
    onError: (err: any) => {
      const message = err?.message || 'Failed to update user';
      toast.error(message);
    },
  });
}

// ── Delete User ─────────────────────────────────────────────────────────────
export function useDeleteUser() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => usersApi.delete(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: userKeys.all });
      toast.success('User deleted successfully');
    },
    onError: (err: any) => {
      const message = err?.message || 'Failed to delete user';
      toast.error(message);
    },
  });
}

// ── Filter State Hook ───────────────────────────────────────────────────────
export function useUserFilters() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [role, setRole] = useState<'all' | 'admin' | 'user'>('all');
  const [status, setStatus] = useState<'all' | 'active' | 'inactive'>('all');

  const reset = () => {
    setPage(1);
    setSearch('');
    setRole('all');
    setStatus('all');
  };

  return { 
    page, 
    setPage, 
    search, 
    setSearch, 
    role, 
    setRole, 
    status, 
    setStatus, 
    reset 
  };
}