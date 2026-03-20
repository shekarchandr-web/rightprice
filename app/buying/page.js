"use client";

import { useState } from "react";
import Link from "next/link";
import { supabase } from "../supabase";

export default function Buying() {

  const [area, setArea] = useState("");
  const [listings, setListings] = useState([]);
  const [unlockedId, setUnlockedId] = useState(null);
  const [liveViews, setLiveViews] = useState({});

  const areas = [
    "Whitefield","Sarjapura","HSR Layout","Indiranagar",
    "Electronic City","Basavanagudi","Jayanagar",
    "Yelahanka","BTM Layout","Hebbal"
  ];

  async function search() {

    if (!area) {
      alert("Select area");
      return;
    }
const { data, error } = await supabase
  .from("Listings")
  .select("*")
  .eq("area", area)
.order("is_boosted", { ascending: false })
.order("free_expires_at", { ascending: true })
.order("id", { ascending: false });

if (error) {
  alert("Error loading");
  return;
}

// ⭐ BOOST SORTING LOGIC — ADD THIS BLOCK
data.sort((a, b) => {
  if (a.is_boosted && !b.is_boosted) return -1;
  if (!a.is_boosted && b.is_boosted) return 1;
  return 0;
});

setListings(data);
// ⭐ LIVE VIEW ANIMATION START
data.forEach(item => {
  setLiveViews(prev => ({
    ...prev,
    [item.id]: Math.floor(Math.random() * 15) + 3
  }));

  setInterval(() => {
    setLiveViews(prev => ({
      ...prev,
      [item.id]: Math.floor(Math.random() * 15) + 3
    }));
  }, 3000);
});
// ⭐ LIVE VIEW ANIMATION END
  }
  function contact(phone) {
    window.open(`https://wa.me/91${phone}`, "_blank");
  }

  return (

    <div className="min-h-screen bg-gray-50">

      <div className="bg-white shadow p-4 flex justify-between px-10">
        <h1 className="font-bold text-xl text-green-700">RightPrice</h1>
        <div className="space-x-6">
          <Link href="/" className="font-semibold text-gray-600">Sell</Link>
          <Link href="/buying" className="font-semibold text-green-700">Buy</Link>
        </div>
      </div>

      <div className="flex justify-center mt-10">

        <div className="bg-white shadow rounded-xl p-6 w-full max-w-md">

          <h2 className="text-xl font-semibold mb-4 text-center">
            Find Properties
          </h2>

          <select
            className="w-full border p-3 mb-3 rounded"
            value={area}
            onChange={(e) => setArea(e.target.value)}
          >
            <option value="">Select Area</option>
            {areas.map(a => <option key={a}>{a}</option>)}
          </select>

          <button
            onClick={search}
            className="w-full bg-green-600 text-white p-3 rounded"
          >
            Search Properties
          </button>

        </div>

      </div>

      <div className="max-w-xl mx-auto mt-6">

        {listings.map((item, i) => {

          let baseRate = 8000;
          let basePrice = baseRate * item.size;

          let discount =
            item.age > 20 ? 0.15 :
            item.age > 15 ? 0.12 :
            item.age > 10 ? 0.08 :
            item.age > 5 ? 0.05 : 0;

          let adjusted = basePrice * (1 - discount);

          let min = Math.round(adjusted * 0.92);
          let max = Math.round(adjusted * 1.08);

          let rank = i + 1;
          let views = Math.floor(Math.random() * 20) + 1;

          return (

           <div
  key={item.id}
  className={`p-4 mb-4 rounded-xl shadow transition 
  ${item.is_boosted 
    ? "bg-yellow-50 border-2 border-yellow-400 scale-105" 
    : "bg-white"}`}
>

              {item.image_url && (
                <img
                  src={item.image_url}
                  className="h-44 w-full object-cover rounded"
                />
              )}
{item.is_boosted && (
  <div className="flex justify-between items-center">
    <p className="text-yellow-600 font-bold">⭐ BOOSTED</p>
{!item.is_boosted && new Date(item.free_expires_at) < new Date() && (
  <p className="text-red-600 font-bold">⏳ FREE EXPIRED</p>
)}
    <span className="bg-red-500 text-white text-xs px-2 py-1 rounded">
      HIGH DEMAND
    </span>
  </div>
)}
              <h3 className="font-semibold mt-2">
                {item.size} sqft Apartment
              </h3>

              <p className="text-gray-600">{item.area}</p>

              <p className="text-green-700 font-semibold mt-1">
                ₹ {min.toLocaleString()} – ₹ {max.toLocaleString()}
              </p>

              <p className="text-sm text-gray-500">
                Age: {item.age} years
              </p>

              <p className="text-blue-600 text-sm mt-1">
                Seller Rank #{rank} in this area
              </p>
              <p className="text-orange-600 text-sm">
<p className="text-purple-600 text-sm">
👀 {liveViews[item.id] || 5} people viewing now
</p>
</p>


  <button
  onClick={async () => {

    if (unlockedId === item.id) {
      alert("Seller Phone: " + item.phone);
      return;
    }

    let confirmUnlock = confirm("Unlock seller contact for ₹29?");
    if (!confirmUnlock) return;
alert("✅ Payment successful (demo)");

await supabase
  .from("Listings")
  .update({
    unlock_count: (item.unlock_count || 0) + 1
  })
  .eq("id", item.id);

setUnlockedId(item.id);

  }}
  className="mt-3 bg-blue-600 text-white px-4 py-2 rounded"
>
  Contact Seller
</button>

              <button
                onClick={() => contact(item.phone)}
                className="mt-3 bg-green-600 text-white px-4 py-2 rounded"
              >
                WhatsApp Seller
              </button>

            </div>

          );
        })}

      </div>

    </div>
  );
}