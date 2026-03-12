"use client";

import { useState } from "react";
import Link from "next/link";
import { supabase } from "../supabase";

export default function Buying() {

  const [area, setArea] = useState("");
  const [listings, setListings] = useState([]);

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

            <div key={item.id} className="bg-white shadow rounded-xl p-4 mb-4">

              {item.image_url && (
                <img
                  src={item.image_url}
                  className="h-44 w-full object-cover rounded"
                />
              )}
{item.is_boosted && (
  <p className="text-yellow-600 font-bold">⭐ BOOSTED</p>
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
🔥 {Math.floor(Math.random() * 10) + 1} buyers viewed today
</p>


  <button
  onClick={() => alert("Contact Seller: " + item.phone)}
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