import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { api } from "../api";


export default function JoinHouse() {
    const [inviteCode, setInviteCode] = useState("");
    const [currentUser, setCurrentUser] = useState(null);
    const navigate = useNavigate();
    const buttonClass =
      "bg-black hover:bg-black text-white font-semibold py-2 px-4 rounded shadow transition duration-200 transform hover:scale-105";
  
    useEffect(() => {
      const auth = getAuth();
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        if (user) setCurrentUser(user);
      });
      return () => unsubscribe();
    }, []);
  
    const handleJoin = async (e) => {
      e.preventDefault();
      if (!currentUser) return alert("User not logged in");
  
      try {
        const res = await api.post("/api/houses/join", { code: inviteCode }); 
  
        if (res.status === 204 || res.status === 200) {
          alert("🎉 Joined house!");
          setInviteCode("");
          navigate("/dashboard");
        } else {
          const err = await res.json();
          alert(err.error || "Failed to join house.");
        }
      } catch (err) {
        console.error(err);
        alert("Something went wrong.");
      }
    };
  
    return (
        <div className="min-h-screen flex items-center justify-center bg-background px-4">

            <div className="bg-blue-50 p-8 rounded-xl shadow-lg w-full max-w-md text-center space-y-6">
                <h1 className="text-2xl font-light text-black">🏡 Join a House</h1>
                <p className="text-gray-600">Enter the invite code: </p>
                <form onSubmit={handleJoin} className="space-y-4">
                    <input
                    type="text"
                    className="border border-blue-300 p-2 w-full rounded"
                    placeholder="Enter Invite Code"
                    value={inviteCode}
                    onChange={(e) => setInviteCode(e.target.value)}
                    required
                    />
                    <button type="submit" className={buttonClass}>
                    Join Now
                    </button>
                </form>
            </div>
        </div>
    );
  }