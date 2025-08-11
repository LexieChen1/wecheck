<<<<<<< HEAD
export default function HouseDashboard() {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold">🏠 Welcome to your House Dashboard!</h1>
        <p className="mt-4 text-gray-700">Here you can manage chores, bills, and roommates.</p>
      </div>
    );
  }
=======
import { useEffect, useState } from "react"; 
import { getAuth } from "firebase/auth"; 

export default function HouseDashboard() {
  const [house, setHouse] = useState(null);

  useEffect(() => {
    const fetchHouse = async () => {
      const user = getAuth().currentUser; 
      if (!user) return; 

      const token = await user.getIdToken(); 
      const res = await fetch("http://localhost:5001/api/users/house", {
        headers: { Authorization: `Bearer ${token}`}
      }); 
      const data = await res.json(); 
      setHouse(data); 
    }; 
    fetchHouse(); 
  }, []); 
  if (!house) return <p className="text-center mt-10">Loading house info...</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">🏠 {house.house_name}</h1>
      <p className="text-gray-600 mt-2">Invite Code: <span className="font-mono">{house.invite_code}</span></p>
      <p className="text-gray-600"> 
      Lease: {house.start_date ? new Date(house.start_date).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric"
      }) : "N/A"} → {house.end_date ? new Date(house.end_date).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric"
      }) : "N/A"}
      </p>
      <h2 className="text-xl font-semibold mt-6 mb-2">👥 Roommates</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {house.roommates?.map((rm, index) => (
          <div
            key={index}
            className="border p-4 rounded-lg bg-white shadow hover:shadow-md transition"
          >
            <h3 className="text-lg font-bold">
              {rm.first_name}{rm.last_name}
            </h3>
            <p className="text-gray-600 text-sm">{rm.email}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
>>>>>>> bcf2f07dd586d7e049c78dd997b95b0726a6acce
