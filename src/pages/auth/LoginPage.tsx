// src/pages/auth/LoginPage.tsx
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../../lib/firebase';
import { useAuthStore } from '../../store/authStore';
import type { User } from '../../types/auth.types';

export default function LoginPage() {
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    try {
      const cred = await signInWithEmailAndPassword(auth, email, password);
      const token = await cred.user.getIdToken();

      // Get user data from Firestore
      const userSnap = await getDoc(doc(db, 'users', cred.user.uid));
      let userData: User;

      if (userSnap.exists()) {
        userData = { id: cred.user.uid, ...userSnap.data() } as User;
      } else {
        userData = {
          id: cred.user.uid,
          name: email.split('@')[0],
          email,
          role: 'user',
          status: 'active',
          createdAt: new Date().toISOString(),
        };
      }

      setAuth(userData, token);
      toast.success(`Welcome back, ${userData.name}!`);
      navigate('/home');
    } catch (err: any) {
      console.error(err);
      toast.error(err.code === 'auth/invalid-credential' ? 'Invalid email or password' : 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-950 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white">nexus.io</h1>
          <p className="text-gray-400 mt-2">Sign in to your account</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-gray-900 border border-gray-800 rounded-2xl p-8">
          <div className="space-y-5">
            <div>
              <label className="text-xs text-gray-400 block mb-1">Email Address</label>
              <input name="email" type="email" required className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white" />
            </div>

            <div>
              <label className="text-xs text-gray-400 block mb-1">Password</label>
              <input name="password" type="password" required className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white" />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-violet-600 hover:bg-violet-500 disabled:opacity-50 transition-colors text-white font-medium py-3.5 rounded-xl"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </div>
        </form>

        <p className="text-center text-gray-400 text-sm mt-6">
          Don't have an account?{' '}
          <Link to="/signup" className="text-violet-400 hover:text-violet-300">Sign up</Link>
        </p>
      </div>
    </div>
  );
}