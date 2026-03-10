"use client";

import { useState } from "react";
import Link from "next/link";
import { supabase } from "./supabase";

export default function Home() {

  const [area, setArea] = useState("");
  const [size, setSize] = useState("");
  const [age, setAge] = useState("");

  const [price, setPrice] = useState("");
  const [demand, setDemand] = useState("");
  const [queue, setQueue] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [phone, setPhone] = useState("");

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

  async function calculatePrice() {

    let sqft = parseInt(size);
    let buildingAge = parseInt(age);

    if (!sqft || !buildingAge || !area) {
      alert("Please fill all fields");
      return;
    }

    let baseRate = 8000;

    let basePrice = baseRate * sqft;

    let discount = 0;

    if (buildingAge > 5 && buildingAge <= 10) discount = 0.05;
    else if (buildingAge > 10 && buildingAge <= 15) discount = 0.08;
    else if (buildingAge > 15) discount = 0.12;

    let adjusted = basePrice * (1 - discount);

    let min = Math.round(adjusted * 0.93);
    let max = Math.round(adjusted * 1.07);

    setPrice("₹ " + min.toLocaleString() + " – ₹ " + max.toLocaleString());

    setDemand(`🔥 20 buyers searching in ${area}`);

    const { data } = await supabase
      .from("Listings")
      .select("*")
      .eq("area", area);

    let sellerCount = data ? data.length : 0;

    setQueue(`⚡ You are seller #${sellerCount + 1} waiting for buyers in ${area}`);

  }

  async function saveListing() {

    if (!phone) {
      alert("Enter phone number");
      return;
    }

    const { error } = await supabase.from("Listings").insert([
      {
        area: area,
        size: parseInt(size),
        age: parseInt(age),
        phone: phone
      }
    ]);

    if (error) {
      alert("Error saving listing");
    } else {
      alert("Property listed successfully!");
      setShowForm(false);
      setPhone("");
    }
  }

  return (

    <div className="min-h-screen bg-gray-100">

      {/* Navigation */}

      <div className="bg-white shadow p-4 flex justify-center space-x-6">

        <Link href="/" className="font-semibold text-blue-600">
          Sell Property
        </Link>

        <Link href="/buying" className="font-semibold text-gray-700">
          Buy Property
        </Link>

      </div>

      {/* Page */}

      <div className="flex items-center justify-center mt-10">

        <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-md">

          <h1 className="text-2xl font-bold text-center mb-4">
            RightPrice – Bangalore
          </h1>

          <div className="space-y-4">

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

            <input
              className="w-full border rounded-lg p-3"
              placeholder="Flat Size (sq ft)"
              value={size}
              onChange={(e) => setSize(e.target.value)}
            />

            <input
              className="w-full border rounded-lg p-3"
              placeholder="Building Age (years)"
              value={age}
              onChange={(e) => setAge(e.target.value)}
            />

            <button
              onClick={calculatePrice}
              className="w-full bg-green-600 text-white p-3 rounded-lg"
            >
              Show Right Price
            </button>

          </div>

          {price && (

            <div className="mt-6 text-center">

              <h2 className="font-semibold">Estimated Price Band</h2>

              <p className="text-green-700 text-lg mt-2">{price}</p>

              <p className="text-orange-600 mt-3">{demand}</p>

              <p className="text-blue-600 mt-2">{queue}</p>

              <button
                onClick={() => setShowForm(true)}
                className="mt-4 bg-black text-white px-4 py-2 rounded-lg"
              >
                List My Property
              </button>

            </div>

          )}

          {showForm && (

            <div className="mt-4">

              <input
                className="w-full border rounded-lg p-3"
                placeholder="Phone number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />

              <button
                onClick={saveListing}
                className="w-full bg-blue-600 text-white p-3 rounded-lg mt-2"
              >
                Submit Listing
              </button>

            </div>

          )}

        </div>

      </div>

    </div>

  );
}