import { useState, useEffect } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom";

export default function AddHouse() {
  const navigate = useNavigate();

  const [houseName, setHouseName] = useState("");
  const [currentHouse, setCurrentHouse] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch (error) {
      return dateString;
    }
  };

  const buttonClass =
    "bg-black hover:bg-black text-white font-semibold py-2 px-4 rounded shadow transition duration-200 transform hover:scale-105";

  const fetchHouse = async (user) => {
    const token = await user.getIdToken();
    const res = await fetch("http://localhost:5001/api/users/house", {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    console.log("users/house ->", data);
    setCurrentHouse(data?.house_name ? data : null);
  };

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setCurrentUser(user);
        fetchHouse(user);
      }
    });
    return () => unsubscribe();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!currentUser) return alert("User not logged in");
    if (!houseName.trim()) return alert("Please enter a house name.");

    try {
      const token = await currentUser.getIdToken();
      const res = await fetch("http://localhost:5001/api/houses", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: houseName,
          start_date: startDate,
          end_date: endDate,
        }),
      });

      if (!res.ok) throw new Error("Failed to create house");
      const data = await res.json();

      alert(`House created successfully! Invite code: ${data.inviteCode}`);
      setHouseName("");
      setStartDate("");
      setEndDate("");
      await fetchHouse(currentUser);
    } catch (err) {
      console.error(err);
      alert("Something went wrong while creating the house.");
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="bg-blue-50 p-8 rounded-xl shadow-lg w-full max-w-md text-center space-y-6">
        {currentHouse ? (
          <div className="space-y-2">
            <h2 className="text-2xl font-light text-black">🏠 You're in: {currentHouse.house_name}</h2>
            <p className="text-black">
              Invite Code: <span className="font-mono">{currentHouse.invite_code}</span>
            </p>
            <p className="text-black font-normal">
              Lease: {formatDate(currentHouse.start_date)} to {formatDate(currentHouse.end_date)}
            </p>
            <button
              onClick={async () => {
                if (
                  !confirm(
                    "Are you sure you want to leave this house? This will delete all house data if you're the only member."
                  )
                ) {
                  return;
                }

                try {
                  const token = await currentUser.getIdToken();
                  const res = await fetch("http://localhost:5001/api/houses/leave-house", {
                    method: "PATCH",
                    headers: { Authorization: `Bearer ${token}` },
                  });

                  if (!res.ok) {
                    throw new Error("Failed to leave house");
                  }

                  const data = await res.json();
                  alert(data.message);
                  setCurrentHouse(null);
                } catch (err) {
                  console.error("Error leaving house:", err);
                  alert("Failed to leave house. Please try again.");
                }
              }}
              className="mt-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors"
            >
              Leave House
            </button>
          </div>
        ) : (
          <>
            <h2 className="text-2xl font-light text-black">Create a New House 🏡</h2>
            <form onSubmit={handleCreate} className="space-y-4">
              <input
                type="text"
                className="border border-blue-300 p-2 w-full rounded"
                placeholder="House name"
                value={houseName}
                onChange={(e) => setHouseName(e.target.value)}
                required
              />
              <input
                type="date"
                className="border border-blue-300 p-2 w-full rounded"
                placeholder="Lease start date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                required
              />
              <input
                type="date"
                className="border border-blue-300 p-2 w-full rounded"
                placeholder="Lease end date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                required
              />
              <button type="submit" className={buttonClass}>
                Create House
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
