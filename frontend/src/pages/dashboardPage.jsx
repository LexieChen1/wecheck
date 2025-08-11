import React, { useEffect, useState } from "react";
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
        </div>
      </div>
    </div>
  );
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
}