// src/api/dowryApi.ts
import {
    collection,
    addDoc,
    getDocs,
    query,
    orderBy,
    serverTimestamp,
} from 'firebase/firestore';
import { db } from '../lib/firebase';

export interface DowryEntry {
    id: string;
    name: string;
    age: number;
    contactNo: string;
    gender: 'male' | 'female' | 'other';
    salary: number;
    profession: string;
    submittedBy: string;           // customer UID
    submittedAt: string;
    submittedByName?: string;      // for display
}

export const dowryApi = {
    // Customer submits new entry
    submit: async (data: Omit<DowryEntry, 'id' | 'submittedAt'>): Promise<DowryEntry> => {
        const docRef = await addDoc(collection(db, 'dowryInfo'), {
            ...data,
            submittedAt: serverTimestamp(),
        });

        return {
            id: docRef.id,
            ...data,
            submittedAt: new Date().toISOString(),
        };
    },

    // Admin gets all entries
    getAll: async (): Promise<DowryEntry[]> => {
        const q = query(collection(db, 'dowryInfo'), orderBy('submittedAt', 'desc'));
        const snapshot = await getDocs(q);

        return snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        } as DowryEntry));
    },
};