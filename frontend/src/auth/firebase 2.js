// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { GoogleAuthProvider, GithubAuthProvider } from "firebase/auth";


const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "gameon-d585f.firebaseapp.com",
  projectId: "gameon-d585f",
  storageBucket: "gameon-d585f.firebasestorage.app",
  messagingSenderId: "983456352810",
  appId: "1:983456352810:web:4016471b91c6bada28d153",
  measurementId: "G-ZBYXN97NJP"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const githubProvider = new GithubAuthProvider();
