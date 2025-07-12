// src/pages/Signup.jsx
import {signInWithGoogle, signInWithGithub} from "../auth/authHandlers"; 
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Signup() {
    const navigate = useNavigate();
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");

    const saveUserProfile = async (user, token) => {
      await fetch("http://localhost:5001/api/users/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          first_name: firstName,
          last_name: lastName,
          email: user.email,
        }),
      });
    };

    const handleGoogleLogin = async () => {
      try {
        const userCredential = await signInWithGoogle();
    
        if (!userCredential || !userCredential.user) {
          console.error("userCredential was:", userCredential);
          return;
        }
    
        const token = await userCredential.user.getIdToken();
        navigate("/dashboard");
      } catch (err) {
        console.error("Google login failed:", err);
      }
    };
    
      const handleGithubLogin = async () => {
        try {
          const userCredential = await signInWithGithub();
          const token = await userCredential.user.getIdToken();

          // await saveUserProfile(userCredential.user, token);
          navigate("/dashboard");
        } catch (err) {
          console.error("GitHub login failed:", err);
        }
      };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white shadow-md rounded-xl p-8 space-y-6 text-center">
        <h2 className="text-3xl font-bold text-gray-800">Sign Up</h2>
        <div className="space-y-4">
          {/* Google */}
          <button
            onClick={handleGoogleLogin}
            className="w-full flex items-center justify-center border border-gray-300 rounded-lg px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 transition"
          >
            <img src="/google.png" alt="Google" className="w-5 h-5 mr-2" />
            Sign up with Google
          </button>

          {/* GitHub */}
          <button
            onClick={handleGithubLogin}
            className="w-full flex items-center justify-center bg-black text-white rounded-lg px-4 py-2 text-sm font-medium hover:opacity-90 transition"
          >
            <svg className="w-5 h-5 mr-2" fill="white" viewBox="0 0 24 24">
              <path d="..." />
            </svg>
            Sign up with GitHub
          </button>

        </div>
      </div>
    </div>
  );
}
