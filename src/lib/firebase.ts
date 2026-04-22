// // src/lib/firebase.ts
// import { initializeApp } from 'firebase/app';
// import { getAuth, GoogleAuthProvider } from 'firebase/auth';
// import { getFirestore } from 'firebase/firestore';
// import { data } from 'react-router-dom';

// const firebaseConfig = {
//   apiKey: "AIzaSyCwiLXa4XiCtPXOY_54SpkgoNpgdsHRWhA",
//   authDomain: "nexusio-66017.firebaseapp.com",
//   projectId: "nexusio-66017",
//   storageBucket: "nexusio-66017.firebasestorage.app",
//   messagingSenderId: "382929500593",
//   appId: "1:382929500593:web:219a3cfe6885451acea590",
//   measurementId: "G-BGQ8R7EF0F",
//   databaseURL: "https://nexusio-66017-default-rtdb.firebaseio.com"
// };

// // Initialize Firebase
// const app = initializeApp(firebaseConfig);

// export const auth = getAuth(app);
// export const db = getFirestore(app);
// export const googleProvider = new GoogleAuthProvider();

// export default app;
// src/lib/firebase.ts
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
  apiKey: "AIzaSyCwiLXa4XiCtPXOY_54SpkgoNpgdsHRWhA",
  authDomain: "nexusio-66017.firebaseapp.com",
  projectId: "nexusio-66017",
  storageBucket: "nexusio-66017.firebasestorage.app",
  messagingSenderId: "382929500593",
  appId: "1:382929500593:web:219a3cfe6885451acea590",
  measurementId: "G-BGQ8R7EF0F",
  databaseURL: "https://nexusio-66017-default-rtdb.firebaseio.com"
};

const app = initializeApp(firebaseConfig);

// ✅ Correct exports
export const auth = getAuth(app);
export const db = getFirestore(app); // Firestore
export const rtdb = getDatabase(app); // Realtime DB
export const googleProvider = new GoogleAuthProvider();

export default app;