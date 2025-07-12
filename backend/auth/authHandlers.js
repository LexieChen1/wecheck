// src/auth/authHandlers.js
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider, githubProvider } from "../firebase"; 

export const signInWithGoogle = async () => {
  console.log("🧨 realGoogleSignIn CALLED");
  const result = await signInWithPopup(auth, googleProvider);
  console.log("✅ Full userCredential object:", result);
  return result;
};

export const signInWithGithub = async () => {
  try {
    const result = await signInWithPopup(auth, githubProvider);
    console.log("Google signIn result:", result);
    return result; // ✅ Return the full userCredential object
  } catch (error) {
    console.error("Google login failed:", error);
    return null;
  }
}; 

 