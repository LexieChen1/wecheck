import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function TripDetails() {
  const { id } = useParams();
  const [trip, setTrip] = useState(null);

  useEffect(() => {
    const fetchTrip = async () => {
      try {
        const res = await fetch(`http://localhost:5001/api/trips/${id}`);
        const data = await res.json();
        setTrip(data);
      } catch (err) {
        console.error("Failed to load trip:", err);
      }
    };
    fetchTrip();
  }, [id]);

  if (!trip) return <div className="p-6 text-center">Loading trip...</div>;

  return (
    <div className="min-h-screen bg-white text-center p-6">
      <h1 className="text-3xl font-bold mb-2">{trip.name}</h1>
      <p className="text-gray-600 mb-2">
        {trip.start_date} → {trip.end_date}
      </p>
      <p className="text-lg font-medium mb-4">Total Amount: ${trip.amount}</p>
      <h2 className="text-xl font-semibold mb-2">People</h2>
      <ul className="space-y-1">
      {trip.people && trip.people.length > 0 ? (
        trip.people.map((p, i) => (
            <li key={i}>{p.name} — ${p.amount}</li>
        ))
    ) : (
        <li className="text-gray-500 italic">No people found.</li>
    )}
      </ul>
    </div>
  );
}