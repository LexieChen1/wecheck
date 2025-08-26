import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { onAuthStateChanged, getIdToken } from "firebase/auth";
import { auth } from "../auth/firebase";

export default function Dashboard() {
  const navigate = useNavigate();

  const [bills, setBills] = useState([]);
  const [chores, setChores] = useState([]);
  const [notes, setNotes] = useState([]);
  const [house, setHouse] = useState(null);
  const [roommates, setRoommates] = useState([]);
  const [copied, setCopied] = useState(false);
  const [token, setToken] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const idToken = await getIdToken(user, true);
        setToken(idToken);
      } else {
        navigate("/login");
      }
    });

    return () => unsubscribe();
  }, [navigate]); 

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await fetch("http://localhost:5001/api/dashboard", {
          headers: { Authorization: `Bearer ${token}` },
        });
  
        const data = await res.json();
        setHouse(data.house || null);
        setRoommates(data.roommates || []);
        setBills(data.bills || []);
        setChores(data.chores || []);
        setNotes(data.notes || []);
      } catch (err) {
        console.error("Failed to load dashboard:", err);
      }
    };
  
    if (token) fetchDashboard();
  }, [token]);

  const copyInvite = async () => {
    if (!house?.invite_code) return;
    try {
      await navigator.clipboard.writeText(house.invite_code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch (_) {}
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-gray-100 to-gray-200 text-gray-800 font-sans">
      <div className="max-w-6xl mx-auto py-12 px-4 sm:px-8">
        <h1 className="text-3xl font-semibold mb-8 text-left font-mono">🏡 Roommate Dashboard</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card
            title={house ? house.name : "My House"}
            action={<Link to="/myHouse" className="text-sm text-blue-600 hover:text-blue-800">Open →</Link>}
          >
            {house ? (
              <div className="space-y-2">
                <div>
                  <div className="text-xs uppercase tracking-wide text-gray-500">Invite Code</div>
                  <div className="mt-1 flex items-center gap-2">
                    <span className="inline-flex items-center rounded-md bg-gray-50 border border-gray-200 px-2.5 py-1 text-xs font-mono text-gray-800">
                      {house.invite_code || '—'}
                    </span>
                    {house.invite_code && (
                      <button onClick={copyInvite} className="text-xs text-blue-600 hover:text-blue-800">
                        {copied ? 'Copied!' : 'Copy'}
                      </button>
                    )}
                  </div>
                </div>
                <div className="text-xs text-gray-600">
                  Lease: {house.start_date ? new Date(house.start_date).toLocaleDateString() : 'N/A'} → {house.end_date ? new Date(house.end_date).toLocaleDateString() : 'N/A'}
                </div>
              </div>
            ) : (
              <div className="text-gray-500 text-sm">No house yet</div>
            )}
          </Card>

          <Card title="Roommates">
            <List items={roommates.map(r => `${r.first_name || ''} ${r.last_name || ''} ${r.email ? `(${r.email})` : ''}`)} />
          </Card>

          <Card title="Upcoming Bills">
            <List items={bills.map(b => `💰 ${b.description} – $${b.amount} due ${b.due_date ? new Date(b.due_date).toLocaleDateString() : 'N/A'}`)} />
          </Card>

          <Card title="Chores To Do">
            <List items={chores.map(c => `💪 ${c.name} – ${c.assigned_at ? `assigned ${new Date(c.assigned_at).toLocaleDateString()}` : ''}`)} />
          </Card>

          <Card title="Roommate Notes">
            <List items={notes.map(n => `${n.first_name || ''} ${n.last_name || ''}: "${n.content}"`)} italic />
          </Card>

          
        </div>
      </div>
    </div>
  );
}

function Card({ title, action, children, full = false }) {
  return (
    <div className={`bg-white rounded-xl border border-gray-100 shadow-sm p-5 ${full ? "col-span-full" : ""}`}>
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
        {action}
      </div>
      {children}
    </div>
  );
}

function List({ items, italic = false }) {
  return (
    <ul className={`text-sm ${italic ? "italic text-gray-700" : "text-gray-700"} divide-y divide-gray-100`}>
      {items.length > 0 ? (
        items.map((item, idx) => (
          <li key={idx} className="py-1.5">{item}</li>
        ))
      ) : (
        <li className="py-1.5 text-gray-400">No items yet</li>
      )}
    </ul>
  );
}