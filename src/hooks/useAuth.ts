// // src/hooks/useAuth.ts
// import { useMutation } from '@tanstack/react-query';
// import { useNavigate } from 'react-router-dom';
// import toast from 'react-hot-toast';
// import { authApi } from '../api/authApi';
// import { useAuthStore } from '../store/authStore';

// export function useLogin() {
//   const setAuth = useAuthStore((s) => s.setAuth);
//   const navigate = useNavigate();

//   return useMutation({
//     mutationFn: authApi.login,
//     onSuccess: ({ user, accessToken }) => {
//       setAuth(user, accessToken);
//       localStorage.setItem('accessToken', accessToken);
//       toast.success(`Welcome back, ${user.name}!`);
//       navigate('/home');                    // ← always go to Home first
//     },
//     onError: (err: any) => {
//       toast.error(err?.message || 'Invalid email or password');
//     },
//   });
// }

// export function useSignup() {
//   const setAuth = useAuthStore((s) => s.setAuth);
//   const navigate = useNavigate();

//   return useMutation({
//     mutationFn: authApi.signup,
//     onSuccess: ({ user, accessToken }) => {
//       setAuth(user, accessToken);
//       localStorage.setItem('accessToken', accessToken);
//       toast.success('Account created successfully!');
//       navigate('/home');                    // ← always go to Home first
//     },
//     onError: (err: any) => {
//       toast.error(err?.message || 'Signup failed');
//     },
//   });
// }

// export function useLogout() {
//   const logout = useAuthStore((s) => s.logout);
//   const navigate = useNavigate();

//   return () => {
//     authApi.logout()
//       .catch(() => { }) // silent fail
//       .finally(() => {
//         logout();
//         localStorage.removeItem('accessToken');
//         navigate('/login');
//         toast.success('Logged out successfully');
//       });
//   };
// }
// src/hooks/useAuth.ts
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { usersApi } from '../api/usersApi';
import { useAuthStore } from '../store/authStore';
import { auth } from '../lib/firebase';
import type { CreateUserInput } from '../api/usersApi.types';

export function useLogin() {
  const setAuth = useAuthStore((s) => s.setAuth);
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (data: { email: string; password: string }) =>
      // Keep using backend for login if you have it, or implement Firebase login later
      fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      }).then(res => res.json()),
    onSuccess: ({ user, accessToken }) => {
      setAuth(user, accessToken);
      localStorage.setItem('accessToken', accessToken);
      toast.success(`Welcome back, ${user.name}!`);
      navigate('/home');
    },
    onError: () => toast.error('Invalid email or password'),
  });
}

export function useSignup() {
  const setAuth = useAuthStore((s) => s.setAuth);
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async (data: CreateUserInput) => {
      // 🔥 Direct Firebase signup (no backend needed)
      const newUser = await usersApi.create(data);
      return { user: newUser, accessToken: await auth.currentUser?.getIdToken() || '' };
    },
    onSuccess: ({ user, accessToken }) => {
      setAuth(user, accessToken);
      localStorage.setItem('accessToken', accessToken);
      toast.success('Account created successfully!');
      navigate('/home');
    },
    onError: (err: any) => {
      toast.error(err.message || 'Signup failed');
    },
  });
}

export function useLogout() {
  const logout = useAuthStore((s) => s.logout);
  const navigate = useNavigate();

  return () => {
    logout();
    localStorage.removeItem('accessToken');
    navigate('/login');
    toast.success('Logged out successfully');
  };
}