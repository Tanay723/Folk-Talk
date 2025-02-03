
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_API_KEY,
  authDomain: "folktalk-76037.firebaseapp.com",
  projectId: "folktalk-76037",
  storageBucket: "folktalk-76037.firebasestorage.app",
  messagingSenderId: "874718831387",
  appId: "1:874718831387:web:0d33e786f6c346827ba9be"
};


const app = initializeApp(firebaseConfig);

export const auth = getAuth(app)
export const db = getFirestore(app)