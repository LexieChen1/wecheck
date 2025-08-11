import React, { useState } from 'react';
import {signInWithPopup } from 'firebase/auth';
import { auth, googleProvider, githubProvider } from '../auth/firebase';
import { useNavigate } from 'react-router-dom';
import { ToastContainer,toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Link } from 'react-router-dom';



export default function Login() {
  const navigate = useNavigate();

  const githubLogin = async () => {
    try {
      await signInWithPopup(auth, githubProvider);
      toast.success("Signed in with GitHub!");
      navigate('/dashboard');
    } catch (err) {
      toast.error("GitHub sign-in failed: " + err.message);
    }
  };

  const googleLogin = async () => {
    try { 
        await signInWithPopup(auth, googleProvider); 
        toast.success("Logged in with Google!"); 
        navigate('/dashboard'); 
    } catch (error) {
        toast.error("Google Login Failed"); 
    }
  }; 

return (
  <div className="min-h-screen flex flex-col bg-cover bg-center bg-no-repeat bg-[url('/assets/background.jpg')] font-sans">
    <header className="flex justify-between items-center p-3 bg-white bg-opacity-80 border-b-2 border-grey">
      <div className="flex items-center space-x-2">
        <img src="/logo.png" alt="Logo" className="w-8 h-8" />
        <h1 className="text-xl font-mono">WeCheck</h1>
      </div>

        {/*nav bars */}
        <nav className="space-x-2">
          <Link
            to="/login"
            className="bg-neutral-500 hover:bg-neutral-900 text-white font-mono py-1 px-2 rounded transition transform hover:scale-105"
          >
            Login
          </Link>
          <Link
            to="/signup"
            className="bg-neutral-500 hover:bg-neutral-900 text-white font-mono py-1 px-2 rounded transition transform hover:scale-105"
          >
            Sign Up
          </Link>
        </nav>
      </header>
  
      <main className="flex-grow flex items-center justify-center px-4">

        {/* Main card */}
        <div className="p-6 bg-white bg-opacity-70 backdrop-blur-md rounded-xl m-6 shadow-lg text-center space-y-4">
          <h1 className="text-2xl font-mono mb-4">Log in to WeCheck</h1>
    
          <button
            onClick={googleLogin}
            className="w-full flex items-center justify-center border border-gray-300 rounded-lg px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 transition"
          >
            <img src="/google.png" alt="Google" className="w-5 h-5 mr-2" />
            Log in with Google
          </button>
    
          <button
            onClick={githubLogin}
            className="w-full bg-gray-800 hover:bg-black text-white py-2 rounded transition"
          >
            Log in with GitHub
          </button>
        </div>
      </main>
    </div>
  ); 
};  