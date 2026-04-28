// src/api/usersApi.ts - FINAL DEBUG VERSION
import {
  collection,
  doc,
  getDocs,
  getDoc,
  updateDoc,
  deleteDoc,
  setDoc,
  query,
  where,
} from 'firebase/firestore';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { db, auth } from '../lib/firebase';
import type { GetUsersParams, PaginatedUsers, CreateUserInput, UpdateUserInput } from './usersApi.types';
import type { User } from '../types/auth.types';

const USE_MOCK = false;

export const usersApi = {

  // getAll: async (params: GetUsersParams = {}): Promise<PaginatedUsers> => {
  //   if (!USE_MOCK) {
  //     try {
  //       const snapshot = await getDocs(collection(db, 'users'));
  //       const users: User[] = snapshot.docs.map(d => ({
  //         id: d.id,
  //         ...d.data()
  //       } as User));
  //       console.log('✅ Firestore: Loaded', users.length, 'users');
  //       return applyFiltersAndPaginate(users, params);
  //     } catch (err) {
  //       console.error('❌ Firestore getAll failed:', err);
  //     }
  //   }
  //   console.log('Using mock data');
  //   return applyFiltersAndPaginate([], params);
  // },
  getAll: async (params: GetUsersParams = {}): Promise<PaginatedUsers> => {
    if (!USE_MOCK) {
      try {
        const currentUser = auth.currentUser;
        if (!currentUser) throw new Error('Not authenticated');

        let q = collection(db, 'users');

        // === SECURITY: Only admins see all users ===
        const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
        const isAdmin = userDoc.exists() && userDoc.data().role === 'admin';

        if (!isAdmin) {
          // Regular users can only see themselves
          q = query(q, where('__name__', '==', currentUser.uid)); // or where('id', '==', uid) if you store id separately
        }

        const snapshot = await getDocs(q);
        const users: User[] = snapshot.docs.map(d => ({
          id: d.id,
          ...d.data()
        } as User));

        console.log(`✅ Firestore: Loaded ${users.length} users for ${isAdmin ? 'ADMIN' : 'USER'}`);
        return applyFiltersAndPaginate(users, params);
      } catch (err) {
        console.error('❌ Firestore getAll failed:', err);
      }
    }

    console.log('Using mock data');
    return applyFiltersAndPaginate([], params);
  },

  create: async (data: CreateUserInput): Promise<User> => {
    console.log('🚀 Starting signup for:', data.email);

    if (!USE_MOCK) {
      try {
        // 1. Create in Firebase Auth
        const cred = await createUserWithEmailAndPassword(auth, data.email, data.password);
        console.log('✅ Auth created. UID =', cred.user.uid);

        // 2. Save to Firestore
        const newUserData: Omit<User, 'id'> = {
          name: data.name,
          email: data.email,
          role: data.role,
          status: 'active',
          createdAt: new Date().toISOString(),
          lastLogin: new Date().toISOString(),
        };

        await setDoc(doc(db, 'users', cred.user.uid), newUserData);
        console.log('✅ SUCCESS: User saved in Firestore with ID:', cred.user.uid);

        return { id: cred.user.uid, ...newUserData } as User;
      } catch (err: any) {
        console.error('❌ FAILED during create:', err.code, err.message);
        throw new Error(err.message || 'Failed to create user');
      }
    }

    // Mock fallback
    console.log('Using mock create');
    const newUser: User = {
      id: `mock_${Date.now()}`,
      name: data.name,
      email: data.email,
      role: data.role,
      status: 'active',
      createdAt: new Date().toISOString(),
      lastLogin: new Date().toISOString(),
    };
    return newUser;
  },

  // Other methods (keep simple)
  update: async (id: string, data: UpdateUserInput): Promise<User> => {
    try {
      const ref = doc(db, 'users', id);
      await updateDoc(ref, { ...data, updatedAt: new Date().toISOString() });
      const snap = await getDoc(ref);
      return { id: snap.id, ...snap.data() } as User;
    } catch (err) {
      console.error('Update failed', err);
      throw err;
    }
  },

  delete: async (id: string): Promise<{ message: string }> => {
    try {
      await deleteDoc(doc(db, 'users', id));
      return { message: 'User deleted' };
    } catch (err) {
      console.error('Delete failed', err);
      throw err;
    }
  },
};

function applyFiltersAndPaginate(users: User[], params: GetUsersParams): PaginatedUsers {
  let filtered = [...users];
  if (params.search) {
    const s = params.search.toLowerCase();
    filtered = filtered.filter(u => u.name.toLowerCase().includes(s) || u.email.toLowerCase().includes(s));
  }
  if (params.role && params.role !== 'all') filtered = filtered.filter(u => u.role === params.role);
  if (params.status && params.status !== 'all') filtered = filtered.filter(u => u.status === params.status);

  const total = filtered.length;
  const page = params.page ?? 1;
  const lim = params.limit ?? 10;
  const totalPages = Math.max(1, Math.ceil(total / lim));
  const paged = filtered.slice((page - 1) * lim, page * lim);

  return { users: paged, total, page, totalPages };
}