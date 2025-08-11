import React from "react";
import { Link } from "react-router-dom";
import signup from "./signupPage";

export default function LandingPage() {

  return (
    <div className="min-h-screen bg-cover bg-center bg-no-repeat bg-[url('/assets/background.jpg')] text-center flex flex-col justify-between font-sans">
      <header className="flex justify-between items-center p-3 bg-white bg-opacity-80 border-b-2 border-grey">
        <div className="flex items-center space-x-2">
          <img src="/logo.png" alt="Logo" className="w-8 h-8" />
          <h1 className="text-xl font-mono">WeCheck</h1>
        </div>

        {/*nav bars */}
        <nav className="space-x-2">
          <Link
<<<<<<< HEAD
=======
            to="/quicksplit"
            className="bg-neutral-500 hover:bg-neutral-900 text-white font-mono py-1 px-2 rounded transition transform hover:scale-105"
          >
            Quick Split
          </Link>
          <Link
>>>>>>> bcf2f07dd586d7e049c78dd997b95b0726a6acce
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

      <main className="flex flex-col items-center justify-center flex-grow px-4 bg-white bg-opacity-80">
      <p className="text-1xl font-sans text-forest mb-3">YOUR NEW LIFE AGENT</p>
      {/* main statement with highlights*/}
      <p className="text-5xl font-mono font-black text-black mb-2">
        Share smarter.
      </p>

      {/* Bold text and highlights: make it two rows*/}
      <p className="text-5xl font-mono font-black text-black mb-2">
        <span className="relative inline-block">
          {/* animated background */}
          <span className="absolute inset-0 bg-highlight rounded-[1.2rem] z-0 animate-highlight"></span>
          {/* Right vertical line */}
          <span className="absolute top-0 right-0 h-full w-1 bg-highlight rounded-bl-md z-10"></span>
           {/* Corner label */}
          <span className="absolute -top-5 right-0 font-mono font-thin bg-forest text-white text-sm px-2 py-1 rounded-md z-20">
            WeCheck
          </span>
          {/* text on bottom */}
          <span className="relative z-7 px-4 py-4">Live easier</span>
        </span>
      </p>

      <p className="text-lg text-grey font-serif max-w-xs mx-auto mt-7">
<<<<<<< HEAD
      Track chores, split bills, and stay connected; at home or away.
=======
      Track chores, split bills, and stay connected
>>>>>>> bcf2f07dd586d7e049c78dd997b95b0726a6acce
      </p>
      </main>

      <footer className="text-center p-4 text-sm text-gray-500 bg-white bg-opacity-80">© 2025 WeCheck. All rights reserved.</footer>
    </div>
  );
}
