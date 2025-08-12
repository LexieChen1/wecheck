import React from 'react';
import { Outlet, useNavigate, NavLink } from "react-router-dom";
import { auth } from "../../auth/firebase";
import { signOut } from "firebase/auth"; 
import { useAuthState } from "react-firebase-hooks/auth";
import { toast } from "react-toastify";

export default function Layout(){
    const navigate = useNavigate(); 
    const [user] = useAuthState(auth);

    const base =
      "inline-block text-white font-mono py-1 px-2 rounded transition transform hover:scale-105";
    const getClass = ({ isActive }) =>
      `${base} ${isActive ? "bg-neutral-900" : "bg-neutral-500 hover:bg-neutral-900"}`;
    const handleLogout = async () => {
        try {
            await signOut(auth);
            toast.success("Logged out successfully!"); 
            navigate("/"); 
        } catch (err) {
            toast.error("Logout Failed");
        }
    }; 

    return (
        <div className="min-h-screen bg-cover bg-center bg-no-repeat bg-[url('/assets/background.jpg')] text-center flex flex-col justify-between font-sans">
          <header className="flex justify-between items-center p-3 bg-white bg-opacity-80 border-b-2 border-gray-300">
            <div className="flex items-center space-x-2 bg-transparent">
              <img
                src="/logo.png"
                alt="Logo"
                className="w-8 h-8 bg-transparent shadow-none rounded-none"
              />
              <h1 className="text-xl font-mono">WeCheck</h1>
            </div>
            <nav className="space-x-2">
              <NavLink to="/dashboard" className={getClass}>
                Dashboard
              </NavLink>
              <NavLink to="/addHouse" className={getClass}>
                Create House
              </NavLink>
              <NavLink to="/joinHouse" className={getClass}>
                Join House
              </NavLink>
              <NavLink to="/myHouse" className={getClass}>
                My House
              </NavLink>
              <NavLink to="/myProfile" className={getClass}>
                My Profile
              </NavLink>
              <button
                onClick={handleLogout}
                className={`${base} bg-neutral-500 hover:bg-neutral-900`}
              >
                Logout
              </button>
            </nav>
          </header>
    
          <main className="flex-grow">
            <Outlet />
          </main>
        </div>
      );
}
}
