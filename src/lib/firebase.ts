import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDDH7mrgXb2IA9TRPF-KG57f8TP270IEvI",
  authDomain: "hw25-72543.firebaseapp.com",
  projectId: "hw25-72543",
  storageBucket: "hw25-72543.firebasestorage.app",
  messagingSenderId: "320341353186",
  appId: "1:320341353186:web:5223b8e822f0f8469774bb"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();
