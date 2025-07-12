import { useState, useEffect } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom";

export default function AddHouse() {
  const navigate = useNavigate();

  const [houseName, setHouseName] = useState("");
  const [inviteCode, setInviteCode] = useState("");
  const [currentHouse, setCurrentHouse] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState(""); 
  const buttonClass = "inline-block bg-neutral-500 hover:bg-neutral-900 text-white font-mono py-1 px-2 rounded transition transform hover:scale-105";

  const fetchHouse = async (user) => {
    const token = await user.getIdToken();
    const res = await fetch("http://localhost:5001/api/users/house", {
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await res.json();
    console.log("fetchHouse response:", data);
    if (data?.house_name) {
      setCurrentHouse(data);
      navigate("/house");
    } else {
      setCurrentHouse(null);
    }
  };

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
    if (user & !currentHouse) {
        setCurrentUser(user);
        await fetchHouse(user);
    }
  }); 

  return () => unsubscribe();
}, []);

  const handleCreate = async (e) => {
    e.preventDefault();

    const user = getAuth().currentUser;
    if (!user) return alert("User not logged in");
    if (!houseName.trim()) return alert("Please enter a house name.");

    try {
      const token = await user.getIdToken();
      const res = await fetch("http://localhost:5001/api/house/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ name: houseName, start_date: startDate, end_date: endDate })
      });

      if (!res.ok) throw new Error("Failed to create house");
      const data = await res.json();
      alert(`House created! Invite code: ${data.inviteCode}`);
      setHouseName("");
      fetchHouse(user);
    } catch (err) {
      console.error(err);
      alert("Something went wrong while creating the house.");
    }
  };

  const handleJoin = async (e) => {
    e.preventDefault();

    const user = getAuth().currentUser;
    if (!user) return alert("User not logged in");
    if (!inviteCode.trim()) return alert("Please enter an invite code.");

    try {
      const token = await user.getIdToken();
      const res = await fetch("http://localhost:5000/api/house/join", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ code: inviteCode })
      });

      if (res.ok) {
        alert("Joined house!");
        setInviteCode("");
        fetchHouse(user);
      } else {
        const err = await res.json();
        alert(err.error || "Failed to join house.");
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong while joining the house.");
    }
  };

  return (
    <div className="p-6 max-w-xl mx-auto space-y-8">
      {currentHouse ? (
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold">🏠 You're in: {currentHouse.house_name}</h2>
          <p className="text-gray-500">
            Invite Code: <span className="font-mono">{currentHouse.invite_code}</span>
          </p>
          <p className="text-gray-500">
            Lease: {currentHouse.start_date || "N/A"} to {currentHouse.end_date || "N/A"}
          </p>
          <button
            onClick={async () => {
              const token = await currentUser.getIdToken();
              await fetch("http://localhost:5001/api/users/leave-house", {
                method: "PATCH",
                headers: { Authorization: `Bearer ${token}` }
              });
              setCurrentHouse(null);
            }}
            className="mt-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Leave House
          </button>
        </div>
      ) : (
        <>
          <form onSubmit={handleCreate} className="space-y-4">
            <h2 className="text-xl font-semibold">Create a New House 🏠</h2>
            {/* House Name */}
            <input
              type="text"
              className="border p-2 w-full"
              placeholder="House name"
              value={houseName}
              onChange={(e) => setHouseName(e.target.value)}
              required
            />

            {/* Lease Start Date */}
            <input
              type="date"
              className="border p-2 w-full"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              required
            />

            {/* Lease End Date */}
            <input
              type="date"
              className="border p-2 w-full"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              required
            />

            {/* Submit Button */}
            <button type="submit" className={buttonClass}>
              Create House
            </button>
          </form>

          <hr className="my-6" />
          <form onSubmit={handleJoin} className="space-y-4">
            <h2 className="text-xl font-semibold">Join a House</h2>
            <input
              type="text"
              className="border p-2 w-full"
              placeholder="Invite Code"
              value={inviteCode}
              onChange={(e) => setInviteCode(e.target.value)}
              required
            />
            <button type="submit" className={buttonClass}>
              Join House
            </button>
          </form>
        </>
      )}
    </div>
  );
}