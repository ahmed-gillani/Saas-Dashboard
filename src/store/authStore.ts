// // import { create } from 'zustand'
// // import { persist, createJSONStorage } from 'zustand/middleware'
// // import type { User } from '../types/auth.types'

// // interface AuthState {
// //   user: User | null
// //   accessToken: string | null
// //   isAuthenticated: boolean
// //   isLoading: boolean

// //   // Actions
// //   setAuth: (user: User, token: string) => void
// //   setLoading: (v: boolean) => void
// //   logout: () => void
// //   updateUser: (partial: Partial<User>) => void
// // }

// // export const useAuthStore = create<AuthState>()(
// //   persist(
// //     (set) => ({
// //       user: null,
// //       accessToken: null,
// //       isAuthenticated: false,
// //       isLoading: true,

// //       setAuth: (user, accessToken) =>
// //         set({ user, accessToken, isAuthenticated: true, isLoading: false }),

// //       setLoading: (isLoading) => set({ isLoading }),

// //       logout: () =>
// //         set({ user: null, accessToken: null, isAuthenticated: false }),

// //       updateUser: (partial) =>
// //         set((state) => ({
// //           user: state.user ? { ...state.user, ...partial } : null,
// //         })),
// //     }),
// //     {
// //       name: 'auth',                          // localStorage key
// //       storage: createJSONStorage(() => localStorage),
// //       partialize: (state) => ({              // sirf yeh save karo
// //         user: state.user,
// //         accessToken: state.accessToken,
// //         isAuthenticated: state.isAuthenticated,
// //       }),
// //     }
// //   )
// // )

// // src/store/authStore.ts
// import { create } from 'zustand';
// import { persist, createJSONStorage } from 'zustand/middleware';
// import type { User } from '../types/auth.types';

// interface AuthState {
//   user: User | null;
//   accessToken: string | null;
//   isAuthenticated: boolean;
//   isLoading: boolean;

//   setAuth: (user: User, token: string) => void;
//   setLoading: (v: boolean) => void;
//   logout: () => void;
//   updateUser: (partial: Partial<User>) => void;
// }

// export const useAuthStore = create<AuthState>()(
//   persist(
//     (set) => ({
//       user: null,
//       accessToken: null,
//       isAuthenticated: false,
//       isLoading: true,

//       setAuth: (user, accessToken) =>
//         set({ 
//           user, 
//           accessToken, 
//           isAuthenticated: true, 
//           isLoading: false 
//         }),

//       setLoading: (isLoading) => set({ isLoading }),

//       logout: () =>
//         set({ 
//           user: null, 
//           accessToken: null, 
//           isAuthenticated: false,
//           isLoading: false 
//         }),

//       updateUser: (partial) =>
//         set((state) => ({
//           user: state.user ? { ...state.user, ...partial } : null,
//         })),
//     }),
//     {
//       name: 'auth-storage',
//       storage: createJSONStorage(() => localStorage),
//       partialize: (state) => ({
//         user: state.user,
//         accessToken: state.accessToken,
//         isAuthenticated: state.isAuthenticated,
//       }),
//     }
//   )
// );


// src/store/authStore.ts
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { User } from '../types/auth.types';

interface AuthState {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  setAuth: (user: User, token: string) => void;
  setLoading: (v: boolean) => void;
  logout: () => void;
  updateUser: (partial: Partial<User>) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      isAuthenticated: false,
      // Start as false — Firebase's onAuthStateChanged will set it to true
      // while resolving, then back to false. This prevents the infinite spinner
      // on page load when persisted auth state already exists in localStorage.
      isLoading: false,

      setAuth: (user, accessToken) =>
        set({
          user,
          accessToken,
          isAuthenticated: true,
          isLoading: false,
        }),

      setLoading: (isLoading) => set({ isLoading }),

      logout: () =>
        set({
          user: null,
          accessToken: null,
          isAuthenticated: false,
          isLoading: false,
        }),

      updateUser: (partial) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...partial } : null,
        })),
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        isAuthenticated: state.isAuthenticated,
        // NOTE: isLoading is intentionally NOT persisted.
        // It must always rehydrate as false so the UI renders immediately
        // from cached credentials while Firebase re-validates in the background.
      }),
    }
  )
);