"use client";

import { useState } from "react";
import Link from "next/link";
import { supabase } from "../supabase";

export default function Buying() {

  const [area, setArea] = useState("");
  const [properties, setProperties] = useState([]);

  const areas = [
    "Whitefield",
    "Sarjapura",
    "HSR Layout",
    "Indiranagar",
    "Electronic City",
    "Basavanagudi",
    "Jayanagar",
    "Yelahanka",
    "BTM Layout",
    "Hebbal"
  ];

  function estimatePrice(size, age) {

    let sqft = parseInt(size);
    let buildingAge = parseInt(age);

    let baseRate = 8000;
    let basePrice = baseRate * sqft;

    let discount = 0;

    if (buildingAge > 5 && buildingAge <= 10) discount = 0.05;
    else if (buildingAge > 10 && buildingAge <= 15) discount = 0.08;
    else if (buildingAge > 15) discount = 0.12;

    let adjusted = basePrice * (1 - discount);

    let min = Math.round(adjusted * 0.93);
    let max = Math.round(adjusted * 1.07);

    return "₹ " + min.toLocaleString() + " – ₹ " + max.toLocaleString();
  }

  async function searchProperties() {

    const { data } = await supabase
      .from("Listings")
      .select("*")
      .eq("area", area);

    setProperties(data || []);
  }

  return (

    <div className="min-h-screen bg-gray-100">

      {/* Navigation */}

      <div className="bg-white shadow p-4 flex justify-center space-x-6">

        <Link href="/" className="font-semibold text-gray-700">
          Sell Property
        </Link>

        <Link href="/buying" className="font-semibold text-blue-600">
          Buy Property
        </Link>

      </div>

      {/* Search Section */}

      <div className="flex flex-col items-center mt-10">

        <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-md">

          <h1 className="text-2xl font-bold text-center mb-4">
            Find Properties
          </h1>

          <select
            className="w-full border rounded-lg p-3"
            value={area}
            onChange={(e) => setArea(e.target.value)}
          >
            <option value="">Select Area</option>

            {areas.map((a) => (
              <option key={a} value={a}>{a}</option>
            ))}

          </select>

          <button
            onClick={searchProperties}
            className="w-full bg-green-600 text-white p-3 rounded-lg mt-3"
          >
            Search Properties
          </button>

        </div>

        {/* Property Results */}

        <div className="mt-6 w-full max-w-md">

          {properties.map((p, index) => {

            const rank = index + 1;
            const buyersToday = Math.floor(Math.random() * 8) + 1;

            return (

              <div
                key={p.id}
                className="bg-white shadow rounded-lg p-5 mb-4"
              >

                <p className="font-semibold text-lg">
                  {p.size} sqft Apartment
                </p>

                <p className="text-gray-600">
                  {p.area}
                </p>

                <div className="mt-3">

                  <p className="text-gray-500 text-sm">
                    Estimated Price
                  </p>

                  <p className="text-green-700 font-semibold">
                    {estimatePrice(p.size, p.age)}
                  </p>

                </div>

                <p className="text-gray-600 mt-2">
                  Age: {p.age} years
                </p>

                <p className="text-blue-600 mt-2 text-sm">
                  Seller Rank: #{rank} in this area
                </p>

                <p className="text-orange-600 text-sm">
                  🔥 {buyersToday} buyers viewed today
                </p>

                <button
                  className="mt-4 bg-blue-600 text-white px-4 py-2 rounded"
                  onClick={() => alert("Contact Seller: " + p.phone)}
                >
                  Contact Seller
                </button>

              </div>

            );
          })}

        </div>

      </div>

    </div>

  );
}