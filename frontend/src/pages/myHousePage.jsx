import React, { useState, useEffect } from "react";
import { downloadICS } from "../components/ui/calendarUtils";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import axios from "axios"; 

export default function MyHouse() {
  const [houseData, setHouseData] = useState(null);
  const [chores, setChores] = useState([]);
  const [bills, setBills] = useState([]);
  const userId = localStorage.getItem("user_id");
  const [newBill, setNewBill] = useState({ description: "", amount: "", dueDate: "" });
  const [takenChores, setTakenChores] = useState({});
  const [members, setMembers] = useState([]);
  const [userUid, setUserUid] = useState(null);

  
  const [leaseStart, setLeaseStart] = useState(""); 
  const [leaseEnd, setLeaseEnd] = useState("");
  const [newChore, setNewChore] = useState("");
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState("");
  const [buyList, setBuyList] = useState([]);
  const [newBuyItem, setNewBuyItem] = useState("");
  const [paidBills, setPaidBills] = useState({});
  const currentUser = "me"; 



  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUserUid(user.uid);
        await fetchHouseData(user);
      } else {
        console.log("No user logged in");
      }
    });

    return () => unsubscribe();
  }, []);

  const fetchHouseData = async (user) => {
    try {
      const token = await user.getIdToken();
      
      // First, get the user's house information
      const houseRes = await fetch("http://localhost:5001/api/houses/me", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!houseRes.ok) {
        console.log("No house found for user");
        return;
      }

      const houseInfo = await houseRes.json();
      console.log("House info received:", houseInfo);
      setHouseData(houseInfo);
      setLeaseStart(houseInfo.start_date);
      setLeaseEnd(houseInfo.end_date);

      // Now get all members, chores, notes, and buy list of this house
      await fetchHouseMembers(token, houseInfo);
      await fetchChores(token, houseInfo);
      await fetchNotes(token, houseInfo);
      await fetchBuyList(token, houseInfo);

    } catch (err) {
      console.error("Failed to fetch house data:", err);
    }
  };

  const fetchHouseMembers = async (token, houseInfo) => {
    try {
      // Get all members of this house using the house ID
      const membersRes = await fetch(`http://localhost:5001/api/houses/${houseInfo.id}/members`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (membersRes.ok) {
        const membersData = await membersRes.json();
        console.log("House members:", membersData);
        setMembers(membersData);
      } else {
        console.log("Failed to fetch members:", membersRes.status);
      }
    } catch (err) {
      console.error("Failed to fetch house members:", err);
    }
  };

  const fetchChores = async (token, houseInfo) => {
    try {
      const choresRes = await fetch(`http://localhost:5001/api/houses/${houseInfo.id}/chores`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (choresRes.ok) {
        const choresData = await choresRes.json();
        console.log("House chores:", choresData);
        setChores(choresData);
      } else {
        console.log("Failed to fetch chores:", choresRes.status);
      }
    } catch (err) {
      console.error("Failed to fetch chores:", err);
    }
  };

  const fetchNotes = async (token, houseInfo) => {
    try {
      const notesRes = await fetch(`http://localhost:5001/api/houses/${houseInfo.id}/notes`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (notesRes.ok) {
        const notesData = await notesRes.json();
        console.log("House notes:", notesData);
        setNotes(notesData);
      } else {
        console.log("Failed to fetch notes:", notesRes.status);
      }
    } catch (err) {
      console.error("Failed to fetch notes:", err);
    }
  };

  const fetchBuyList = async (token, houseInfo) => {
    try {
      const buyListRes = await fetch(`http://localhost:5001/api/houses/${houseInfo.id}/buylist`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (buyListRes.ok) {
        const buyListData = await buyListRes.json();
        console.log("House buy list:", buyListData);
        setBuyList(buyListData);
      } else {
        console.log("Failed to fetch buy list:", buyListRes.status);
      }
    } catch (err) {
      console.error("Failed to fetch buy list:", err);
    }
  };

  const addChore = async () => {
    if (!newChore.trim() || !userUid || !houseData?.id) return;

    try {
      const auth = getAuth();
      const user = auth.currentUser;
      if (!user) return;

      const token = await user.getIdToken();
      const res = await fetch(`http://localhost:5001/api/houses/${houseData.id}/chores`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: newChore.trim(),
          description: ""
        }),
      });

      if (res.ok) {
        setNewChore("");
        // Refresh chores list
        await fetchChores(token, houseData);
      } else {
        console.error("Failed to add chore:", res.status);
      }
    } catch (err) {
      console.error("Error adding chore:", err);
    }
  };

  const takeChore = async (choreId) => {
    if (!userUid) return;

    try {
      const auth = getAuth();
      const user = auth.currentUser;
      if (!user) return;

      const token = await user.getIdToken();
      const res = await fetch(`http://localhost:5001/api/houses/chores/${choreId}/take`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        // Refresh chores list
        await fetchChores(token, houseData);
      } else {
        console.error("Failed to take chore:", res.status);
      }
    } catch (err) {
      console.error("Error taking chore:", err);
    }
  };

  const completeChore = async (choreId) => {
    if (!userUid) return;

    try {
      const auth = getAuth();
      const user = auth.currentUser;
      if (!user) return;

      const token = await user.getIdToken();
      const res = await fetch(`http://localhost:5001/api/houses/chores/${choreId}/complete`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        // Refresh chores list
        await fetchChores(token, houseData);
      } else {
        console.error("Failed to complete chore:", res.status);
      }
    } catch (err) {
      console.error("Error completing chore:", err);
    }
  };

  const returnChore = async (choreId) => {
    if (!userUid) return;

    try {
      const auth = getAuth();
      const user = auth.currentUser;
      if (!user) return;

      const token = await user.getIdToken();
      const res = await fetch(`http://localhost:5001/api/houses/chores/${choreId}/return`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        // Refresh chores list
        await fetchChores(token, houseData);
      } else {
        console.error("Failed to return chore:", res.status);
      }
    } catch (err) {
      console.error("Error returning chore:", err);
    }
  };



  // Filter chores for different sections
  const availableChores = chores.filter(chore => !chore.assigned_to_uid);
  const myChores = chores.filter(chore => chore.assigned_to_uid === userUid);

  const addNote = async () => {
    if (!newNote.trim() || !userUid || !houseData?.id) return;

    try {
      const auth = getAuth();
      const user = auth.currentUser;
      if (!user) return;

      const token = await user.getIdToken();
      const res = await fetch(`http://localhost:5001/api/houses/${houseData.id}/notes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          content: newNote.trim()
        }),
      });

      if (res.ok) {
        setNewNote("");
        // Refresh notes list
        await fetchNotes(token, houseData);
      } else {
        console.error("Failed to add note:", res.status);
      }
    } catch (err) {
      console.error("Error adding note:", err);
    }
  };

  const deleteNote = async (noteId) => {
    if (!userUid) return;

    if (!confirm("Are you sure you want to delete this note?")) {
      return;
    }

    try {
      const auth = getAuth();
      const user = auth.currentUser;
      if (!user) return;

      const token = await user.getIdToken();
      const res = await fetch(`http://localhost:5001/api/houses/notes/${noteId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        // Refresh notes list
        await fetchNotes(token, houseData);
      } else {
        console.error("Failed to delete note:", res.status);
      }
    } catch (err) {
      console.error("Error deleting note:", err);
    }
  };

  const addBuyItem = async () => {
    if (!newBuyItem.trim() || !userUid || !houseData?.id) return;

    try {
      const auth = getAuth();
      const user = auth.currentUser;
      if (!user) return;

      const token = await user.getIdToken();
      const res = await fetch(`http://localhost:5001/api/houses/${houseData.id}/buylist`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          item: newBuyItem.trim()
        }),
      });

      if (res.ok) {
        setNewBuyItem("");
        // Refresh buy list
        await fetchBuyList(token, houseData);
      } else {
        console.error("Failed to add buy item:", res.status);
      }
    } catch (err) {
      console.error("Error adding buy item:", err);
    }
  };

  const purchaseItem = async (itemId) => {
    if (!userUid) return;

    try {
      const auth = getAuth();
      const user = auth.currentUser;
      if (!user) return;

      const token = await user.getIdToken();
      const res = await fetch(`http://localhost:5001/api/houses/buylist/${itemId}/purchase`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        // Refresh buy list
        await fetchBuyList(token, houseData);
      } else {
        console.error("Failed to purchase item:", res.status);
      }
    } catch (err) {
      console.error("Error purchasing item:", err);
    }
  };

  const deleteBuyItem = async (itemId) => {
    if (!userUid) return;

    if (!confirm("Are you sure you want to delete this item?")) {
      return;
    }

    try {
      const auth = getAuth();
      const user = auth.currentUser;
      if (!user) return;

      const token = await user.getIdToken();
      const res = await fetch(`http://localhost:5001/api/houses/buylist/${itemId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        // Refresh buy list
        await fetchBuyList(token, houseData);
      } else {
        console.error("Failed to delete buy item:", res.status);
      }
    } catch (err) {
      console.error("Error deleting buy item:", err);
    }
  };

  const handleAddBill = async () => {
    try {
      await axios.post("/api/house/add-bill", newBill, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setBills([...bills, newBill]);
      setNewBill({ description: "", amount: "", dueDate: "" });
    } catch (err) {
      console.error("Failed to add bill:", err);
    }
  };

  return (
    <div className="flex flex-wrap justify-center gap-6 mt-6">
      
      {/* Join Code */}
      {houseData?.invite_code && (
        <Section title="Join Code">
          <p className="text-xl font-bold text-gray-800">{houseData.invite_code}</p>
          <p className="text-sm text-gray-500">Share this code with others to join your house</p>
        </Section>
      )}

      {/* Members */}
      <Section title="Members">
        <ul className="text-gray-700 space-y-1">
        {members.length === 0 ? (
          <li className="italic text-gray-500">No members found</li>
        ) : (
          members.map((m, idx) => (
            <li key={idx}>
              {m.first_name || 'Unknown'} {m.last_name || 'User'} {m.phone && `(${m.phone})`}
            </li>
          ))
        )}
        </ul>
      </Section>

      {/* Lease Dates */}
      <Section title="Lease Dates">
        <p className="text-gray-700">Start: <strong>{leaseStart ? new Date(leaseStart).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        }) : 'N/A'}</strong></p>
        <p className="text-gray-700">End: <strong>{leaseEnd ? new Date(leaseEnd).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        }) : 'N/A'}</strong></p>
      </Section>

      {/* Available Chores */}
      <Section title="Available Chores">
        <ul className="text-gray-700 space-y-2">
          {availableChores.length === 0 ? (
            <li className="italic text-gray-500">No available chores</li>
          ) : (
            availableChores.map((chore) => (
              <li key={chore.id} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                <div>
                  <span className="font-medium">{chore.name}</span>
                  <br />
                  <span className="text-xs text-gray-500">
                    Added by {chore.creator_first_name || 'Unknown'} {chore.creator_last_name || ''}
                  </span>
                </div>
                <button
                  onClick={() => takeChore(chore.id)}
                  className="text-sm bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                >
                  Take
                </button>
              </li>
            ))
          )}
        </ul>
        <div className="mt-4 flex space-x-2">
          <input
            type="text"
            value={newChore}
            onChange={(e) => setNewChore(e.target.value)}
            className="border p-2 rounded w-full"
            placeholder="Add a new chore..."
            onKeyPress={(e) => e.key === 'Enter' && addChore()}
          />
          <button
            onClick={addChore}
            className="bg-black text-white px-4 py-2 rounded hover:bg-gray-700"
          >
            Add
          </button>
        </div>
      </Section>

      {/* My Chores */}
      <Section title="My Chores">
        <ul className="text-gray-700 space-y-2">
          {myChores.length === 0 ? (
            <li className="italic text-gray-500">No chores assigned to you yet.</li>
          ) : (
            myChores.map((chore) => (
              <li key={chore.id} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                <div>
                  <span className="font-medium">{chore.name}</span>
                  <br />
                  <span className="text-xs text-gray-500">
                    Assigned: {new Date(chore.assigned_at).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => completeChore(chore.id)}
                    className="text-xs bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                  >
                    Mark Done
                  </button>
                  <button
                    onClick={() => returnChore(chore.id)}
                    className="text-xs bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                  >
                    Return
                  </button>
                </div>
              </li>
            ))
          )}
        </ul>
      </Section>




      {/* Buy List */}
      <Section title="Buy List">
        <ul className="text-gray-700 space-y-2">
          {buyList.length === 0 ? (
            <li className="italic text-gray-500">No items to buy yet</li>
          ) : (
            buyList.map((item) => (
              <li key={item.id} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                <div className="flex-1">
                  <span className={item.is_purchased ? "line-through text-gray-400 font-medium" : "font-medium"}>
                    {item.item}
                  </span>
                  <br />
                  <span className="text-xs text-gray-500">
                    Added by {item.creator_first_name || 'Unknown'} {item.creator_last_name || ''}
                    {item.is_purchased && item.purchased_at && (
                      <> • Purchased by {item.purchaser_first_name || 'Unknown'} {item.purchaser_last_name || ''} on {new Date(item.purchased_at).toLocaleDateString()}</>
                    )}
                  </span>
                </div>
                <div className="flex gap-2">
                  {!item.is_purchased ? (
                    <button
                      onClick={() => purchaseItem(item.id)}
                      className="text-xs bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                    >
                      Bought
                    </button>
                  ) : (
                    <span className="text-xs text-green-600 font-medium">✓ Purchased</span>
                  )}
                  {(item.created_by_uid === userUid || (item.purchased_by_uid === userUid && item.is_purchased)) && (
                    <button
                      onClick={() => deleteBuyItem(item.id)}
                      className="text-xs text-red-500 hover:text-red-700"
                    >
                      ✕
                    </button>
                  )}
                </div>
              </li>
            ))
          )}
        </ul>
        <div className="mt-4 flex space-x-2">
          <input
            type="text"
            value={newBuyItem}
            onChange={(e) => setNewBuyItem(e.target.value)}
            className="border p-2 rounded w-full"
            placeholder="Add item to buy..."
            onKeyPress={(e) => e.key === 'Enter' && addBuyItem()}
          />
          <button
            onClick={addBuyItem}
            className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600"
          >
            Add
          </button>
        </div>
      </Section>

      {/* House Notes */}
      <Section title="House Notes">
        <ul className="text-gray-700 space-y-2">
          {notes.length === 0 ? (
            <li className="italic text-gray-500">No notes yet</li>
          ) : (
            notes.map((note) => (
              <li key={note.id} className="p-2 bg-gray-50 rounded border-l-4 border-blue-500">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <p className="text-gray-800">{note.content}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      By {note.first_name || 'Unknown'} {note.last_name || ''} • {new Date(note.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  {note.created_by_uid === userUid && (
                    <button
                      onClick={() => deleteNote(note.id)}
                      className="text-xs text-red-500 hover:text-red-700 ml-2"
                    >
                      ✕
                    </button>
                  )}
                </div>
              </li>
            ))
          )}
        </ul>
        <div className="mt-4 flex space-x-2">
          <input
            type="text"
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            className="border p-2 rounded w-full"
            placeholder="Add a house note..."
            onKeyPress={(e) => e.key === 'Enter' && addNote()}
          />
          <button
            onClick={addNote}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Add
          </button>
        </div>
      </Section>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div className="bg-white w-80 rounded-2xl shadow-lg p-6 space-y-4 border border-gray-100">
      <h2 className="text-lg font-poppins text-black">{title}</h2>
      {children}
    </div>
  );
}