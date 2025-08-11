import React, { useEffect, useState } from "react";
<<<<<<< HEAD
import { Link, useNavigate } from "react-router-dom";
import { onAuthStateChanged, getIdToken } from "firebase/auth";
import { auth } from "../auth/firebase";

export default function Dashboard() {
  const navigate = useNavigate();
  const [trips, setTrips] = useState([]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const token = await getIdToken(user);
          const res = await fetch("http://localhost:5001/api/trips/all", {
            headers: { Authorization: `Bearer ${token}` },
          });
          const data = await res.json();
          Array.isArray(data) ? setTrips(data) : setTrips([]);
        } catch (err) {
          console.error("Failed to load trips:", err);
          setTrips([]);
        }
      } else {
        navigate("/login");
      }
    });
    return () => unsubscribe();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-gray-100 to-gray-200 text-gray-800 font-sans">
      <div className="max-w-6xl mx-auto py-12 px-4 sm:px-8">
        <h1 className="text-3xl font-semibold mb-8 text-left font-mono">🏡 Roommate Dashboard</h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

          {/* Bills */}
          <Card title="Upcoming Bills">
            <List items={[
              "💡 Electricity – $45 due Aug 10",
              "🧼 Cleaning – $25 due Aug 12",
              "🌐 Internet – $60 due Aug 15",
            ]} />
          </Card>

          {/* Chores */}
          <Card title="Chores To Do">
            <List items={[
              "🧽 Clean kitchen – Due today",
              "🗑️ Take out trash – Due tomorrow",
              "🧺 Laundry room check – Due Friday",
            ]} />
          </Card>

          {/* Notes */}
          <Card title="Roommate Notes">
            <List items={[
              "“Don’t forget to restock paper towels!”",
              "“Let’s have a cleaning party Friday 🎉”",
            ]} italic />
          </Card>

          {/* Past Settlements */}
          <Card title="History">
            <List items={[
              "✅ Rent July – Paid",
              "✅ Electric June – Paid",
              "✅ WiFi May – Paid",
            ]} />
          </Card>
=======
import { Link,useNavigate } from "react-router-dom";
import { onAuthStateChanged, getIdToken } from "firebase/auth";
import { auth } from "../auth/firebase"; 


export default function Dashboard() {
  const navigate = useNavigate();
  const [trips, setTrips] = useState([]); 

  
useEffect(() => {
  const unsubscribe = onAuthStateChanged(auth, async (user) => {
    if (user) {
      try {
        const token = await getIdToken(user);
        const res = await fetch("http://localhost:5001/api/trips/all", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();
        if (Array.isArray(data)) {
          setTrips(data);
        } else {
          console.error("Expected array, got:", data);
          setTrips([]);
        }
      } catch (err) {
        console.error("Failed to load trips:", err);
        setTrips([]);
      }
    } else {
      navigate("/login");
    }
  });

  return () => unsubscribe(); // cleanup
}, []);

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/");
  };

  const handleAddEvent = () => {
    navigate("/addEvent");
  };

  return (
    <div className="relative min-h-screen bg-cover bg-center bg-no-repeat bg-[url('/assets/background.jpg')] text-center font-sans">
      {/* Overlay for consistent opacity */}
      <div className="absolute inset-0 bg-white bg-opacity-70 backdrop-blur-sm z-0" />

      {/* Content on top */}
      <div className="relative z-10 p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Current Balance */}
          <div className="bg-white shadow-md rounded-xl p-5">
            <h2 className="text-lg font-mono font-semibold mb-2">Current Money Owed</h2>
            <p className="text-2xl font-bold text-green-700"></p>
          </div>

          {/* Card 2: People Who Owe You */}
          <div className="bg-white shadow-md rounded-xl p-5">
            <h2 className="text-lg font-mono font-semibold mb-2">People Who Owe You</h2>
            <ul className="text-gray-700">
            </ul>
          </div>

          {/* Card 3: Past Trips: allows updates*/}
          <div className="bg-white shadow-md rounded-xl p-5">
            <h2 className="text-lg font-mono font-semibold mb-2">Past Trips</h2>

            {/* Card deck container */}
            <div className="flex overflow-x-auto space-x-4 pb-2 scrollbar-hide card-deck">
              {Array.isArray(trips) && trips.length === 0 ? (
                <p className="text-gray-500"></p>
              ) : (
                trips.map((trip) => (
                  <div
                    key={trip.id}
                    className="min-w-[250px] bg-gray-100 shadow-inner rounded-lg p-4 flex-shrink-0 text-left"
                  >
                    <Link
                      to={`/trip/${trip.id}`}
                      className="text-forest font-semibold hover:underline text-lg"
                    >
                      {trip.name}
                    </Link>
                    <p className="text-sm text-gray-700">
                      {new Date(trip.start_date).toLocaleDateString()} →{" "}
                      {new Date(trip.end_date).toLocaleDateString()}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
          <div className="flex justify-end mt-2">
            <button
              onClick={() => {
                document.querySelector(".card-deck").scrollBy({ left: 300, behavior: "smooth" });
              }}
              className="text-forest hover:underline text-sm"
            >
            </button>
          </div>
>>>>>>> bcf2f07dd586d7e049c78dd997b95b0726a6acce
        </div>
      </div>
    </div>
  );
<<<<<<< HEAD
}

// ─── Reusable Components ──────────────────────────────────────

function Card({ title, children, full = false }) {
  return (
    <div className={`bg-white rounded-2xl shadow-md p-6 ${full ? "col-span-full" : ""}`}>
      <h2 className="text-xl font-mono font-medium mb-3">{title}</h2>
      {children}
    </div>
  );
}

function List({ items, italic = false }) {
  return (
    <ul className={`space-y-2 text-sm ${italic ? "italic text-gray-700" : "text-gray-600"}`}>
      {items.map((item, idx) => (
        <li key={idx}>{item}</li>
      ))}
    </ul>
  );
=======
>>>>>>> bcf2f07dd586d7e049c78dd997b95b0726a6acce
}