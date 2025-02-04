// This code is setting up Firebase in a React application.

import { initializeApp } from "firebase/app"; // The app object returned represents the Firebase instance.
import { getAuth } from "firebase/auth"; // The getAuth() function provides the authentication instance for the app.
import { getFirestore } from "firebase/firestore"; //The getFirestore() function provides the Firestore database instance for performing CRUD operations

const firebaseConfig = {
  apiKey: import.meta.env.VITE_API_KEY,
  authDomain: "folktalk-76037.firebaseapp.com",
  projectId: "folktalk-76037",
  storageBucket: "folktalk-76037.firebasestorage.app",
  messagingSenderId: "874718831387",
  appId: "1:874718831387:web:0d33e786f6c346827ba9be"
};


const app = initializeApp(firebaseConfig);

export const auth = getAuth(app) //auth is exported to be used for authentication operations (like logging in users).

export const db = getFirestore(app) //db is exported to be used for database operations
