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
    "Whitefield","Sarjapura","HSR Layout","Indiranagar",
    "Electronic City","Basavanagudi","Jayanagar",
    "Yelahanka","BTM Layout","Hebbal"
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

    setQueue(`⚡ You are seller #${sellerCount + 1} waiting for buyers`);

  }

  async function saveListing() {

    if (!phone) {
      alert("Enter phone number");
      return;
    }

    const { error } = await supabase.from("Listings").insert([
      {
        area,
        size: parseInt(size),
        age: parseInt(age),
        phone
      }
    ]);

    if (error) {
      alert("Error saving listing");
    } else {
      alert("Property listed successfully!");
      setShowForm(false);
    }
  }

  return (

    <div className="min-h-screen bg-gray-50">

      {/* NAVBAR */}

      <div className="bg-white shadow p-4 flex justify-between px-10">

        <h1 className="font-bold text-xl text-green-700">
          RightPrice
        </h1>

        <div className="space-x-6">
          <Link href="/" className="font-semibold text-green-700">
            Sell
          </Link>
          <Link href="/buying" className="font-semibold text-gray-600">
            Buy
          </Link>
        </div>

      </div>

      {/* HERO SECTION */}

      <div className="text-center mt-16">

        <h2 className="text-4xl font-bold">
          Know the Right Price  
          <br /> Before You Sell Your Flat
        </h2>

        <p className="text-gray-600 mt-4">
          India’s first AI-driven resale price discovery platform
        </p>

      </div>

      {/* TOOL */}

      <div className="flex justify-center mt-10">

        <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-md">

          <select
            className="w-full border rounded-lg p-3 mb-3"
            value={area}
            onChange={(e) => setArea(e.target.value)}
          >
            <option value="">Select Area</option>
            {areas.map((a) => (
              <option key={a}>{a}</option>
            ))}
          </select>

          <input
            className="w-full border rounded-lg p-3 mb-3"
            placeholder="Flat Size (sq ft)"
            value={size}
            onChange={(e) => setSize(e.target.value)}
          />

          <input
            className="w-full border rounded-lg p-3 mb-3"
            placeholder="Building Age (years)"
            value={age}
            onChange={(e) => setAge(e.target.value)}
          />

          <button
            onClick={calculatePrice}
            className="w-full bg-green-600 text-white p-3 rounded-lg"
          >
            Check My Flat Price
          </button>

          {price && (

            <div className="text-center mt-6">

              <h3 className="font-semibold">Estimated Price</h3>

              <p className="text-green-700 text-xl mt-2">{price}</p>

              <p className="text-orange-600 mt-3">{demand}</p>
              <p className="text-blue-600">{queue}</p>

              <button
                onClick={() => setShowForm(true)}
                className="mt-4 bg-black text-white px-4 py-2 rounded"
              >
                List My Property
              </button>

            </div>

          )}

          {showForm && (

            <div className="mt-4">

              <input
                className="w-full border rounded-lg p-3"
                placeholder="Phone Number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />

              <button
                onClick={saveListing}
                className="w-full bg-blue-600 text-white p-3 rounded mt-2"
              >
                Submit Listing
              </button>

            </div>

          )}

        </div>

      </div>

      {/* TRUST SECTION */}

      <div className="text-center mt-16 mb-10">

        <p className="text-gray-500">
          ✔ 250 buyers searching today  
          ✔ 80 flats priced this week  
          ✔ Bangalore pilot launch
        </p>

      </div>

    </div>
  );
}