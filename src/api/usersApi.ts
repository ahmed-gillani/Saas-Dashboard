// // // src/api/usersApi.ts
// // import {
// //   collection, doc, getDocs, getDoc, updateDoc, deleteDoc,
// // } from 'firebase/firestore'
// // import { createUserWithEmailAndPassword } from 'firebase/auth'
// // import { db, auth } from '../lib/firebase'
// // import type { GetUsersParams, PaginatedUsers, CreateUserInput, UpdateUserInput } from './usersApi.types'
// // import type { User } from '../types/auth.types'

// // // Mock fallback (same as before, in case Firestore fails)
// // const MOCK_USERS: User[] = [
// //   { id: '1', name: 'Sara Ahmed', email: 'sara@nexus.io', role: 'admin', status: 'active', createdAt: '2024-01-10T00:00:00Z', lastLogin: new Date(Date.now() - 5 * 60000).toISOString() },
// //   { id: '2', name: 'Mohsin Khan', email: 'mohsin@nexus.io', role: 'user', status: 'active', createdAt: '2024-02-15T00:00:00Z', lastLogin: new Date(Date.now() - 2 * 3600000).toISOString() },
// //   { id: '3', name: 'Fatima Raza', email: 'fatima@nexus.io', role: 'user', status: 'inactive', createdAt: '2024-03-01T00:00:00Z', lastLogin: new Date(Date.now() - 7 * 86400000).toISOString() },
// //   { id: '4', name: 'Asad Qureshi', email: 'asad@nexus.io', role: 'admin', status: 'active', createdAt: '2024-03-20T00:00:00Z', lastLogin: new Date(Date.now() - 3600000).toISOString() },
// //   { id: '5', name: 'Zara Baig', email: 'zara@nexus.io', role: 'user', status: 'active', createdAt: '2024-04-05T00:00:00Z', lastLogin: new Date(Date.now() - 30 * 60000).toISOString() },
// //   { id: '6', name: 'Hamza Ali', email: 'hamza@nexus.io', role: 'user', status: 'inactive', createdAt: '2024-04-18T00:00:00Z', lastLogin: new Date(Date.now() - 14 * 86400000).toISOString() },
// //   { id: '7', name: 'Nida Farooq', email: 'nida@nexus.io', role: 'admin', status: 'active', createdAt: '2024-05-02T00:00:00Z', lastLogin: new Date(Date.now() - 20 * 60000).toISOString() },
// //   { id: '8', name: 'Bilal Siddiqui', email: 'bilal@nexus.io', role: 'user', status: 'active', createdAt: '2024-05-14T00:00:00Z', lastLogin: new Date(Date.now() - 4 * 3600000).toISOString() },
// // ]

// // export const usersApi = {
// //   // ── Get All (with client-side filter for mock, server-side for Firestore) ──
// //   getAll: async (params: GetUsersParams = {}): Promise<PaginatedUsers> => {
// //     try {
// //       const usersRef = collection(db, 'users')
// //       const snapshot = await getDocs(usersRef)

// //       // Firestore se saare users lao
// //       let users: User[] = snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as User))

// //       // Client-side filtering (Firestore composite index banana padta for server-side)
// //       if (params.search) {
// //         const s = params.search.toLowerCase()
// //         users = users.filter((u) => u.name.toLowerCase().includes(s) || u.email.toLowerCase().includes(s))
// //       }
// //       if (params.role && params.role !== 'all') {
// //         users = users.filter((u) => u.role === params.role)
// //       }
// //       if (params.status && params.status !== 'all') {
// //         users = users.filter((u) => u.status === params.status)
// //       }

// //       const total = users.length
// //       const page = params.page ?? 1
// //       const lim = params.limit ?? 10
// //       const totalPages = Math.max(1, Math.ceil(total / lim))
// //       const paged = users.slice((page - 1) * lim, page * lim)

// //       return { users: paged, total, page, totalPages }
// //     } catch (err) {
// //       console.warn('Firestore getAll failed, using mock data:', err)
// //       // Mock fallback
// //       let users = [...MOCK_USERS]
// //       if (params.search) {
// //         const s = params.search.toLowerCase()
// //         users = users.filter((u) => u.name.toLowerCase().includes(s) || u.email.toLowerCase().includes(s))
// //       }
// //       if (params.role && params.role !== 'all') users = users.filter((u) => u.role === params.role)
// //       if (params.status && params.status !== 'all') users = users.filter((u) => u.status === params.status)

// //       const total = users.length
// //       const page = params.page ?? 1
// //       const lim = params.limit ?? 10
// //       return { users: users.slice((page - 1) * lim, page * lim), total, page, totalPages: Math.max(1, Math.ceil(total / lim)) }
// //     }
// //   },

// //   // ── Get One ───────────────────────────────────────────────────────────────
// //   getById: async (id: string): Promise<User> => {
// //     const snap = await getDoc(doc(db, 'users', id))
// //     if (!snap.exists()) throw new Error('User not found')
// //     return { id: snap.id, ...snap.data() } as User
// //   },

// //   // ── Create (Firebase Auth + Firestore) ────────────────────────────────────
// //   create: async (data: CreateUserInput): Promise<User> => {
// //     try {
// //       // Firebase Auth mein account banao
// //       const cred = await createUserWithEmailAndPassword(auth, data.email, data.password)

// //       const newUser: Omit<User, 'id'> = {
// //         name: data.name,
// //         email: data.email,
// //         role: data.role,
// //         status: 'active',
// //         createdAt: new Date().toISOString(),
// //         lastLogin: new Date().toISOString(),
// //       }

// //       // Firestore mein save karo (uid as document id)
// //       await updateDoc(doc(db, 'users', cred.user.uid), newUser).catch(() =>
// //         // agar doc exist nahi karta to set karo
// //         import('firebase/firestore').then(({ setDoc }) =>
// //           setDoc(doc(db, 'users', cred.user.uid), newUser)
// //         )
// //       )

// //       return { id: cred.user.uid, ...newUser }
// //     } catch (err: any) {
// //       if (err.code === 'auth/email-already-in-use') {
// //         throw new Error('This email is already registered')
// //       }
// //       throw new Error(err.message || 'Failed to create user')
// //     }
// //   },

// //   // ── Update ────────────────────────────────────────────────────────────────
// //   update: async (id: string, data: UpdateUserInput): Promise<User> => {
// //     try {
// //       const ref = doc(db, 'users', id)
// //       await updateDoc(ref, { ...data, updatedAt: new Date().toISOString() })
// //       const updated = await getDoc(ref)
// //       return { id: updated.id, ...updated.data() } as User
// //     } catch (err: any) {
// //       // Mock fallback — update in-memory
// //       const idx = MOCK_USERS.findIndex((u) => u.id === id)
// //       if (idx === -1) throw new Error('User not found')
// //       MOCK_USERS[idx] = { ...MOCK_USERS[idx], ...data }
// //       return MOCK_USERS[idx]
// //     }
// //   },

// //   // ── Delete ────────────────────────────────────────────────────────────────
// //   delete: async (id: string): Promise<{ message: string }> => {
// //     try {
// //       await deleteDoc(doc(db, 'users', id))
// //       return { message: 'User deleted successfully' }
// //     } catch (err) {
// //       // Mock fallback
// //       const idx = MOCK_USERS.findIndex((u) => u.id === id)
// //       if (idx !== -1) MOCK_USERS.splice(idx, 1)
// //       return { message: 'User deleted successfully' }
// //     }
// //   },

// //   // ── Own profile ───────────────────────────────────────────────────────────
// //   updateProfile: async (data: Partial<UpdateUserInput>): Promise<User> => {
// //     const user = auth.currentUser
// //     if (!user) throw new Error('Not authenticated')
// //     await updateDoc(doc(db, 'users', user.uid), data)
// //     const snap = await getDoc(doc(db, 'users', user.uid))
// //     return { id: snap.id, ...snap.data() } as User
// //   },
// // }


// // src/api/usersApi.ts
// import {
//   collection, doc, getDocs, getDoc, updateDoc, deleteDoc, setDoc,
// } from 'firebase/firestore'
// import { createUserWithEmailAndPassword } from 'firebase/auth'
// import { db, auth } from '../lib/firebase'
// import type { GetUsersParams, PaginatedUsers, CreateUserInput, UpdateUserInput } from './usersApi.types'
// import type { User } from '../types/auth.types'

// // ── In-memory store (acts as real DB when Firestore fails) ────────────────────
// // Export karo taaki React Query invalidate hone pe fresh data mile
// export let MOCK_USERS: User[] = [
//   { id: '1', name: 'Sara Ahmed',     email: 'sara@nexus.io',   role: 'admin', status: 'active',   createdAt: '2024-01-10T00:00:00Z', lastLogin: new Date(Date.now() - 5*60000).toISOString() },
//   { id: '2', name: 'Mohsin Khan',    email: 'mohsin@nexus.io', role: 'user',  status: 'active',   createdAt: '2024-02-15T00:00:00Z', lastLogin: new Date(Date.now() - 2*3600000).toISOString() },
//   { id: '3', name: 'Fatima Raza',    email: 'fatima@nexus.io', role: 'user',  status: 'inactive', createdAt: '2024-03-01T00:00:00Z', lastLogin: new Date(Date.now() - 7*86400000).toISOString() },
//   { id: '4', name: 'Asad Qureshi',   email: 'asad@nexus.io',   role: 'admin', status: 'active',   createdAt: '2024-03-20T00:00:00Z', lastLogin: new Date(Date.now() - 3600000).toISOString() },
//   { id: '5', name: 'Zara Baig',      email: 'zara@nexus.io',   role: 'user',  status: 'active',   createdAt: '2024-04-05T00:00:00Z', lastLogin: new Date(Date.now() - 30*60000).toISOString() },
//   { id: '6', name: 'Hamza Ali',      email: 'hamza@nexus.io',  role: 'user',  status: 'inactive', createdAt: '2024-04-18T00:00:00Z', lastLogin: new Date(Date.now() - 14*86400000).toISOString() },
//   { id: '7', name: 'Nida Farooq',    email: 'nida@nexus.io',   role: 'admin', status: 'active',   createdAt: '2024-05-02T00:00:00Z', lastLogin: new Date(Date.now() - 20*60000).toISOString() },
//   { id: '8', name: 'Bilal Siddiqui', email: 'bilal@nexus.io',  role: 'user',  status: 'active',   createdAt: '2024-05-14T00:00:00Z', lastLogin: new Date(Date.now() - 4*3600000).toISOString() },
// ]

// function makeMockId() {
//   return `mock_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`
// }

// // ── USE_MOCK flag — true jab Firestore available nahi ─────────────────────────
// const USE_MOCK = false   // Firebase Firestore setup hone ke baad false kar dena

// export const usersApi = {

//   getAll: async (params: GetUsersParams = {}): Promise<PaginatedUsers> => {
//     // Try Firestore
//     if (!USE_MOCK) {
//       try {
//         const snapshot = await getDocs(collection(db, 'users'))
//         let users: User[] = snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as User))
//         return applyFiltersAndPaginate(users, params)
//       } catch (err) {
//         console.warn('Firestore failed, using mock')
//       }
//     }
//     // Mock
//     return applyFiltersAndPaginate([...MOCK_USERS], params)
//   },

//   getById: async (id: string): Promise<User> => {
//     if (!USE_MOCK) {
//       try {
//         const snap = await getDoc(doc(db, 'users', id))
//         if (snap.exists()) return { id: snap.id, ...snap.data() } as User
//       } catch {}
//     }
//     const u = MOCK_USERS.find((u) => u.id === id)
//     if (!u) throw new Error('User not found')
//     return u
//   },

//   create: async (data: CreateUserInput): Promise<User> => {
//     if (!USE_MOCK) {
//       try {
//         const cred = await createUserWithEmailAndPassword(auth, data.email, data.password)
//         const newUser: Omit<User, 'id'> = {
//           name: data.name, email: data.email, role: data.role,
//           status: 'active', createdAt: new Date().toISOString(), lastLogin: new Date().toISOString(),
//         }
//         await setDoc(doc(db, 'users', cred.user.uid), newUser)
//         return { id: cred.user.uid, ...newUser }
//       } catch (err: any) {
//         if (err.code === 'auth/email-already-in-use') throw new Error('Email already registered')
//         throw new Error(err.message || 'Failed to create user')
//       }
//     }
//     // ── Mock create ──
//     if (MOCK_USERS.find((u) => u.email === data.email)) {
//       throw new Error('This email is already registered')
//     }
//     const newUser: User = {
//       id: makeMockId(),
//       name: data.name, email: data.email, role: data.role,
//       status: 'active', createdAt: new Date().toISOString(), lastLogin: new Date().toISOString(),
//     }
//     MOCK_USERS = [...MOCK_USERS, newUser]   // new array → React Query re-renders
//     return newUser
//   },

//   update: async (id: string, data: UpdateUserInput): Promise<User> => {
//     if (!USE_MOCK) {
//       try {
//         const ref = doc(db, 'users', id)
//         await updateDoc(ref, { ...data, updatedAt: new Date().toISOString() })
//         const updated = await getDoc(ref)
//         return { id: updated.id, ...updated.data() } as User
//       } catch {}
//     }
//     // ── Mock update ──
//     const idx = MOCK_USERS.findIndex((u) => u.id === id)
//     if (idx === -1) throw new Error('User not found')
//     const updated = { ...MOCK_USERS[idx], ...data }
//     MOCK_USERS = MOCK_USERS.map((u) => (u.id === id ? updated : u))  // new array
//     return updated
//   },

//   delete: async (id: string): Promise<{ message: string }> => {
//     if (!USE_MOCK) {
//       try {
//         await deleteDoc(doc(db, 'users', id))
//         return { message: 'User deleted' }
//       } catch {}
//     }
//     // ── Mock delete ──
//     MOCK_USERS = MOCK_USERS.filter((u) => u.id !== id)  // new array
//     return { message: 'User deleted' }
//   },

//   updateProfile: async (data: Partial<UpdateUserInput>): Promise<User> => {
//     const user = auth.currentUser
//     if (!USE_MOCK && user) {
//       await updateDoc(doc(db, 'users', user.uid), data)
//       const snap = await getDoc(doc(db, 'users', user.uid))
//       return { id: snap.id, ...snap.data() } as User
//     }
//     throw new Error('Not available in mock mode')
//   },
// }

// // ── Helper ────────────────────────────────────────────────────────────────────
// function applyFiltersAndPaginate(users: User[], params: GetUsersParams): PaginatedUsers {
//   if (params.search) {
//     const s = params.search.toLowerCase()
//     users = users.filter((u) => u.name.toLowerCase().includes(s) || u.email.toLowerCase().includes(s))
//   }
//   if (params.role   && params.role   !== 'all') users = users.filter((u) => u.role   === params.role)
//   if (params.status && params.status !== 'all') users = users.filter((u) => u.status === params.status)

//   const total      = users.length
//   const page       = params.page  ?? 1
//   const lim        = params.limit ?? 10
//   const totalPages = Math.max(1, Math.ceil(total / lim))
//   const paged      = users.slice((page - 1) * lim, page * lim)

//   return { users: paged, total, page, totalPages }
// }
// src/api/usersApi.ts - FINAL DEBUG VERSION
import {
  collection,
  doc,
  getDocs,
  getDoc,
  updateDoc,
  deleteDoc,
  setDoc,
} from 'firebase/firestore';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { db, auth } from '../lib/firebase';
import type { GetUsersParams, PaginatedUsers, CreateUserInput, UpdateUserInput } from './usersApi.types';
import type { User } from '../types/auth.types';

const USE_MOCK = false;

export const usersApi = {

  getAll: async (params: GetUsersParams = {}): Promise<PaginatedUsers> => {
    if (!USE_MOCK) {
      try {
        const snapshot = await getDocs(collection(db, 'users'));
        const users: User[] = snapshot.docs.map(d => ({
          id: d.id,
          ...d.data()
        } as User));
        console.log('✅ Firestore: Loaded', users.length, 'users');
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