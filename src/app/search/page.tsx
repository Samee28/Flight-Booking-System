"use client";
import { useState } from "react";

export default function SearchPage() {
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [date, setDate] = useState("");
  const [results, setResults] = useState<any[]>([]);

  async function search() {
    const res = await fetch(`/api/search?origin=${origin}&destination=${destination}&date=${date}`);
    const data = await res.json();
    setResults(data.flights ?? []);
  }

  return (
    <div>
      <h2>Search Flights</h2>
      <div style={{ display: 'grid', gap: 8, maxWidth: 480 }}>
        <input placeholder="Origin" value={origin} onChange={e=>setOrigin(e.target.value)} />
        <input placeholder="Destination" value={destination} onChange={e=>setDestination(e.target.value)} />
        <input type="date" value={date} onChange={e=>setDate(e.target.value)} />
        <button onClick={search}>Search</button>
      </div>
      <ul>
        {results.map((f:any)=> (
          <li key={f.id}>
            {f.route.origin} → {f.route.destination} | {new Date(f.departureAt).toLocaleString()} | ${'{'}f.basePrice{'}'}
          </li>
        ))}
      </ul>
    </div>
  );
}
