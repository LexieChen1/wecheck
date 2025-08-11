<<<<<<< HEAD
import { auth } from "./firebase";
import {
  GoogleAuthProvider,
  GithubAuthProvider,
  signInWithPopup,
} from "firebase/auth";

import { api } from "../api";


const googleProvider = new GoogleAuthProvider();
const githubProvider = new GithubAuthProvider();

async function upsertUser(user, firstName, lastName) {
  const res = await api.post("/api/users/ensure", {
    uid: user.uid,
    email: user.email,
    first_name: firstName ?? "",
    last_name: lastName ?? "",
    avatar_url: user.photoURL || "",
  });
  if (res.status !== 204) throw new Error(`Upsert failed: ${res.status}`);
}

export const signInWithGoogle = async (firstName, lastName) => {
  const { user } = await signInWithPopup(auth, googleProvider);
  console.log("Google login success:", user);
  await upsertUser(user, firstName, lastName);
  return user;
};

export const signInWithGithub = async (firstName, lastName) => {
  const { user } = await signInWithPopup(auth, githubProvider);
  console.log("GitHub login success:", user);
  await upsertUser(user, firstName, lastName);
  return user;
};
=======
import { auth } from "./firebase"; 

import {
    GoogleAuthProvider,
    GithubAuthProvider,
    signInWithPopup,
} from 'firebase/auth';

const googleProvider = new GoogleAuthProvider(); 
const githubProvider = new GithubAuthProvider(); 


let googleLogin = false; 
export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    console.log('Google login success:', result.user);
    return result; // ✅ RETURN IT
  } catch (error) {
    console.error('Google login error:', error); 
    return null;
  }
};

export const signInWithGithub = async () => {
    try {
      const result = await signInWithPopup(auth, githubProvider);
      console.log('GitHub login success:', result.user);
      return result;
    } catch (error) {
      console.error('GitHub login error:', error);
    }
  };
>>>>>>> bcf2f07dd586d7e049c78dd997b95b0726a6acce
