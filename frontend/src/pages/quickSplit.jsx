import React, { useState } from "react";

export default function QuickSplit() {
  const [total, setTotal] = useState("");
  const [people, setPeople] = useState([{ name: "", paid: "", note: "" }]);
  const [results, setResults] = useState([]);
  const [totalPaid, setTotalPaid] = useState(0);
  const [perPerson, setPerPerson] = useState(0);

  const handlePersonChange = (index, field, value) => {
    const updated = [...people];
    updated[index][field] = value;
    setPeople(updated);
  };

  const handleAddPerson = () => {
    setPeople([...people, { name: "", paid: "", note: "" }]);
  };

  const handleCalculate = () => {
    const paidSum = people.reduce((sum, p) => sum + parseFloat(p.paid || 0), 0);
    const share = parseFloat(total) / people.length;

    const summary = people.map((p) => {
      const paid = parseFloat(p.paid || 0);
      const diff = parseFloat((paid - share).toFixed(2));
      return {
        name: p.name || "Unnamed",
        amount: Math.abs(diff),
        action: diff > 0 ? "gets back" : diff < 0 ? "owes" : "is settled",
      };
    });

    setTotalPaid(paidSum);
    setPerPerson(share);
    setResults(summary);
  };

  return (
    <div className="min-h-screen bg-white p-6 font-sans max-w-2xl mx-auto">
      <h1 className="text-4xl font-bold text-center text-green-800 mb-8">Quick Split</h1>

      <div className="mb-4">
        <input
          type="number"
          placeholder="Total Amount ($)"
          value={total}
          onChange={(e) => setTotal(e.target.value)}
          className="border rounded px-4 py-2 w-full"
        />
      </div>

      <h2 className="text-2xl font-semibold mb-3">People</h2>
      {people.map((p, index) => (
        <div key={index} className="flex space-x-2 mb-2">
          <input
            type="text"
            placeholder="Name"
            value={p.name}
            onChange={(e) => handlePersonChange(index, "name", e.target.value)}
            className="flex-1 border px-3 py-1 rounded"
          />
          <input
            type="number"
            placeholder="Paid ($)"
            value={p.paid}
            onChange={(e) => handlePersonChange(index, "paid", e.target.value)}
            className="w-32 border px-3 py-1 rounded"
          />
          <input
            type="text"
            placeholder="Note"
            value={p.note}
            onChange={(e) => handlePersonChange(index, "note", e.target.value)}
            className="w-48 border px-3 py-1 rounded"
          />
        </div>
      ))}

      <button
        onClick={handleAddPerson}
        className="text-blue-600 hover:underline mb-4"
      >
        + Add Person
      </button>

      <div>
        <button
          onClick={handleCalculate}
          className="bg-green-700 text-white px-6 py-2 rounded hover:bg-green-900"
        >
          Split Bill
        </button>
      </div>

      {results.length > 0 && (
        <div className="mt-6 bg-gray-50 p-4 rounded shadow">
          <h2 className="text-xl font-semibold mb-2">Summary</h2>
          <p className="text-sm text-gray-600 mb-2">
            Total Paid: <strong>${totalPaid}</strong> — Per Person: <strong>${perPerson.toFixed(2)}</strong>
          </p>
          <ul className="space-y-1">
            {results.map((r, i) => (
              <li key={i} className={
                r.action === "owes"
                  ? "text-yellow-600"
                  : r.action === "gets back"
                  ? "text-green-600"
                  : "text-gray-700"
              }>
                {r.name} {r.action} ${r.amount.toFixed(2)}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
