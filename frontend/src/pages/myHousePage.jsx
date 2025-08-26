import React, { useState, useEffect } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";

export default function MyHouse() {
  const [houseData, setHouseData] = useState(null);
  const [chores, setChores] = useState([]);
  const [bills, setBills] = useState([]);
  const [members, setMembers] = useState([]);
  const [userUid, setUserUid] = useState(null);

  
  const [leaseStart, setLeaseStart] = useState(""); 
  const [leaseEnd, setLeaseEnd] = useState("");
  const [newChore, setNewChore] = useState("");
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState("");
  const [buyList, setBuyList] = useState([]);
  const [newBuyItem, setNewBuyItem] = useState("");
  const [newBillDescription, setNewBillDescription] = useState("");
  const [newBillAmount, setNewBillAmount] = useState("");
  const [newBillDueDate, setNewBillDueDate] = useState("");

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
      await fetchBills(token); 


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

  const addBill = async () => {
    if (!newBillDescription || !newBillAmount || !newBillDueDate) return;
  
    try {
      const auth = getAuth(); 
      const user = auth.currentUser; 
      if (!user) throw new Error("User not logged in");
  
      const token = await user.getIdToken(); 
  
      const res = await fetch("http://localhost:5001/api/bills", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json", 
          Authorization: `Bearer ${token}`, 
        },
        body: JSON.stringify({
          description: newBillDescription,
          amount: Number(newBillAmount),
          due_date: newBillDueDate, 
        }),
      });
  
      if (!res.ok) throw new Error("Failed to add bill");
      const addedBill = await res.json();
  
      setBills((prev) => [...prev, addedBill]);
      setNewBillDescription("");
      setNewBillAmount("");
      setNewBillDueDate("");
    } catch (err) {
      console.error("Error adding bill:", err);
    }
  };

  const fetchBills = async (token) => {
    try {
      const res = await fetch("http://localhost:5001/api/bills/upcoming", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to fetch bills");
      const data = await res.json();
      setBills(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error fetching bills:", err);
    }
  };

  const deleteBill = async (billId) => {
    try {
      const auth = getAuth();
      const user = auth.currentUser;
      if (!user) return;

      const token = await user.getIdToken();
      const res = await fetch(`http://localhost:5001/api/bills/${billId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        await fetchBills(token);
      } else {
        console.error("Failed to delete bill:", res.status);
      }
    } catch (err) {
      console.error("Error deleting bill:", err);
    }
  };
  

  return (
    <div className="min-h-screen w-full px-6 sm:px-8 lg:px-12 xl:px-20 py-8 pb-28">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-2">

      {/* Available Chores */}
      <Section title="Available Chores">
        <ul className="text-gray-700 space-y-2">
          {availableChores.length === 0 ? (
            <li className="italic text-gray-500">No available chores</li>
          ) : (
            availableChores.map((chore) => (
              <li key={chore.id} className="flex justify-between items-center p-3 rounded-lg border border-gray-100 bg-white">
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
            onKeyDown={(e) => e.key === 'Enter' && addChore()}
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
              <li key={chore.id} className="flex justify-between items-center p-3 rounded-lg border border-gray-100 bg-white">
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
      
      {/* Bills */}
      <Section title="Bills">
        <ul className="text-gray-700 space-y-2">
          {bills.length === 0 ? (
            <li className="italic text-gray-500">No bills yet</li>
          ) : (
            bills.map((bill) => (
              <li key={bill.id} className="p-3 rounded-lg border border-blue-100 bg-blue-50/40">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <p className="text-gray-800">
                      {bill.description} – ${bill.amount}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Due {new Date(bill.due_date).toLocaleDateString()}
                    </p>
                  </div>
                  <button
                    onClick={() => deleteBill(bill.id)}
                    className="text-xs text-red-500 hover:text-red-700 ml-2"
                  >
                    ✕
                  </button>
                </div>
              </li>
            ))
          )}
        </ul>

        {/* Add Bill Form */}
        <div className="mt-4 flex flex-col space-y-2">
          <input
            type="text"
            value={newBillDescription}
            onChange={(e) => setNewBillDescription(e.target.value)}
            className="border p-2 rounded w-full"
            placeholder="Bill description (e.g. Electricity)"
          />
          <input
            type="number"
            value={newBillAmount}
            onChange={(e) => setNewBillAmount(e.target.value)}
            className="border p-2 rounded w-full"
            placeholder="Amount"
          />
          <input
            type="date"
            value={newBillDueDate}
            onChange={(e) => setNewBillDueDate(e.target.value)}
            className="border p-2 rounded w-full"
          />
          <button
            onClick={addBill}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Add
          </button>
        </div>
      </Section>

      {/* Buy List */}
      <Section title="Buy List">
        <ul className="text-gray-700 space-y-2">
          {buyList.length === 0 ? (
            <li className="italic text-gray-500">No items to buy yet</li>
          ) : (
            buyList.map((item) => (
              <li key={item.id} className="flex justify-between items-center p-3 rounded-lg border border-gray-100 bg-white">
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
            onKeyDown={(e) => e.key === 'Enter' && addBuyItem()}
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
              <li key={note.id} className="p-3 rounded-lg border border-gray-100 bg-white">
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
            onKeyDown={(e) => e.key === 'Enter' && addNote()}
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
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 space-y-4">
      <h2 className="text-base font-semibold text-gray-900">{title}</h2>
      {children}
    </div>
  );
}