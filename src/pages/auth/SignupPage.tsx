
// src/pages/auth/SignupPage.tsx
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../../lib/firebase';
import type { CreateUserInput } from '../../api/usersApi.types';

export default function SignupPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState('');

  const signupMutation = useMutation({
    mutationFn: async (data: CreateUserInput & { confirmPassword: string }) => {
      if (data.password !== data.confirmPassword) throw new Error('Passwords do not match');

      const cred = await createUserWithEmailAndPassword(auth, data.email, data.password);

      const newUserData = {
        name: data.name,
        email: data.email,
        role: data.role,
        status: 'active' as const,
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString(),
      };

      await setDoc(doc(db, 'users', cred.user.uid), newUserData);
      return { id: cred.user.uid, ...newUserData };
    },
    onSuccess: () => {
      toast.success('Account created successfully!');
      navigate('/home');
    },
    onError: (err: any) => {
      const message = err.message.includes('email-already-in-use')
        ? 'This email is already registered'
        : err.message;
      toast.error(message);
      setFormError(message);
    },
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormError('');
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      password: formData.get('password') as string,
      confirmPassword: formData.get('confirmPassword') as string,
      role: formData.get('role') as 'admin' | 'user',
    };

    await signupMutation.mutateAsync(data);
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-950 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white">nexus.io</h1>
          <p className="text-gray-400 mt-2">Create your account</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-gray-900 border border-gray-800 rounded-2xl p-8 space-y-6">
          {/* Name, Email, Role dropdown, Password, Confirm Password - same as before */}
          <div>
            <label className="text-xs text-gray-400 block mb-1">Full Name</label>
            <input name="name" required className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white" placeholder="Enter Your Name" />
          </div>

          <div>
            <label className="text-xs text-gray-400 block mb-1">Email Address</label>
            <input name="email" type="email" required className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white" placeholder="Enter Your Email" />
          </div>

          <div>
            <label className="text-xs text-gray-400 block mb-1">Role</label>
            <select name="role" required className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white">
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <div>
            <label className="text-xs text-gray-400 block mb-1">Password</label>
            <input name="password" type="password" required className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white" placeholder="••••••••" />
          </div>

          <div>
            <label className="text-xs text-gray-400 block mb-1">Confirm Password</label>
            <input name="confirmPassword" type="password" required className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white" placeholder="••••••••" />
          </div>

          {formError && <p className="text-red-400 text-sm text-center">{formError}</p>}

          <button type="submit" disabled={loading} className="w-full bg-violet-600 hover:bg-violet-500 disabled:opacity-50 text-white font-medium py-3.5 rounded-xl">
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <p className="text-center text-gray-400 text-sm mt-6">
          Already have an account? <Link to="/login" className="text-violet-400 hover:text-violet-300">Sign in</Link>
        </p>
      </div>
    </div>
  );
}