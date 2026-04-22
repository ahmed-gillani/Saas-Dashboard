// import type { Notification } from '../types/auth.types'

// // ── Mock notification data ────────────────────────────────────────────────────
// let mockNotifications: Notification[] = [
//   {
//     id: '1',
//     title: 'New User',
//     message: 'Sara Ahmed just signed up.',
//     type: 'success',
//     isRead: false,
//     createdAt: new Date(Date.now() - 5 * 60000).toISOString(),
//   },
//   {
//     id: '2',
//     title: 'Warning',
//     message: 'Server CPU usage is above 80%.',
//     type: 'warning',
//     isRead: false,
//     createdAt: new Date(Date.now() - 30 * 60000).toISOString(),
//   },
//   {
//     id: '3',
//     title: 'Payment',
//     message: 'Monthly invoice has been paid successfully.',
//     type: 'info',
//     isRead: true,
//     createdAt: new Date(Date.now() - 2 * 3600000).toISOString(),
//   },
//   {
//     id: '4',
//     title: 'Error',
//     message: 'Failed to send email to mohsin@nexus.io.',
//     type: 'error',
//     isRead: true,
//     createdAt: new Date(Date.now() - 5 * 3600000).toISOString(),
//   },
// ]

// function delay(ms = 300) {
//   return new Promise((res) => setTimeout(res, ms))
// }

// export const notificationsApi = {
//   getAll: async (): Promise<Notification[]> => {
//     await delay()
//     return [...mockNotifications]
//   },

//   markAsRead: async (id: string): Promise<Notification> => {
//     await delay(200)
//     const n = mockNotifications.find((n) => n.id === id)
//     if (!n) throw new Error('Notification not found')
//     n.isRead = true
//     return { ...n }
//   },

//   markAllAsRead: async (): Promise<{ message: string }> => {
//     await delay(200)
//     mockNotifications = mockNotifications.map((n) => ({ ...n, isRead: true }))
//     return { message: 'All notifications marked as read' }
//   },

//   delete: async (id: string): Promise<{ message: string }> => {
//     await delay(200)
//     mockNotifications = mockNotifications.filter((n) => n.id !== id)
//     return { message: 'Notification deleted' }
//   },
// }

// src/api/notificationsApi.ts
import {
  collection,
  query,
  orderBy,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  getDoc,
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import type { Notification } from '../types/auth.types';

export const notificationsApi = {
  getAll: async (): Promise<Notification[]> => {
    const q = query(collection(db, 'notifications'), orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as Notification));
  },

  markAsRead: async (id: string) => {
    await updateDoc(doc(db, 'notifications', id), { isRead: true });
    const docSnap = await getDoc(doc(db, 'notifications', id));
    return { id, ...docSnap.data() } as Notification;
  },

  markAllAsRead: async () => {
    const q = query(collection(db, 'notifications'));
    const snapshot = await getDocs(q);
    const batchPromises = snapshot.docs.map((d) =>
      updateDoc(doc(db, 'notifications', d.id), { isRead: true })
    );
    await Promise.all(batchPromises);
    return { message: 'All notifications marked as read' };
  },

  delete: async (id: string) => {
    await deleteDoc(doc(db, 'notifications', id));
    return { message: 'Notification deleted' };
  },
};