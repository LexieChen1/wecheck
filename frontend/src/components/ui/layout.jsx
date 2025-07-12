import React from 'react'; 
import { Link, Outlet, useNavigate } from "react-router-dom";
import { auth } from "../../auth/firebase";
import { signOut } from "firebase/auth"; 
import { useAuthState } from "react-firebase-hooks/auth";
import { toast } from "react-toastify";

export default function Layout(){
    const navigate = useNavigate(); 
    const [user] = useAuthState(auth);

    const handleLogout = async () => {
        try {
            await signOut(auth);
            toast.success("Logged out successfully!"); 
            navigate("/"); 
        } catch (err) {
            toast.error("Logout Failed")
        }
    }; 

    return (
        <div className="min-h-screen bg-cover bg-center bg-no-repeat bg-[url('/assets/background.jpg')] text-center flex flex-col justify-between font-sans">
          <header className="flex justify-between items-center p-3 bg-white bg-opacity-80 border-b-2 border-gray-300">
            <div className="flex items-center space-x-2">
                <img src="/logo.png" alt="Logo" className="w-8 h-8" />
                <h1 className="text-xl font-mono">WeCheck</h1>
            </div>
            <nav className="space-x-2">
              <Link
                to="/dashboard"
                className="inline-block bg-neutral-500 hover:bg-neutral-900 text-white font-mono py-1 px-2 rounded transition transform hover:scale-105"
              >
                Dashboard
              </Link>
              <Link
                to="/addHouse"
                className="inline-block bg-neutral-500 hover:bg-neutral-900 text-white font-mono py-1 px-2 rounded transition transform hover:scale-105"
              >
                Add House
              </Link>
              <Link
                to="/addEvent"
                className="inline-block bg-neutral-500 hover:bg-neutral-900 text-white font-mono py-1 px-2 rounded transition transform hover:scale-105"
              >
                Add Trip
              </Link>
              <button
                onClick={handleLogout}
                className="bg-neutral-500 hover:bg-neutral-900 text-white font-mono py-1 px-2 rounded transition transform hover:scale-105"
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