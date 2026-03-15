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

  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState("");

  const areas = [
    "Whitefield","Sarjapura","HSR Layout","Indiranagar",
    "Electronic City","Basavanagudi","Jayanagar",
    "Yelahanka","BTM Layout","Hebbal"
  ];

  function estimatePrice() {

    let sqft = parseInt(size);
    let buildingAge = parseInt(age);

    if (!sqft || !buildingAge || !area) {
      alert("Fill all fields");
      return;
    }

    let baseRate = 8000;
    let basePrice = baseRate * sqft;

    let discount =
      buildingAge > 20 ? 0.15 :
      buildingAge > 15 ? 0.12 :
      buildingAge > 10 ? 0.08 :
      buildingAge > 5 ? 0.05 : 0;

    let adjusted = basePrice * (1 - discount);

    let min = Math.round(adjusted * 0.92);
    let max = Math.round(adjusted * 1.08);

    setPrice("₹ " + min.toLocaleString() + " – ₹ " + max.toLocaleString());

    let buyers = Math.floor(Math.random() * 20) + 5;
    setDemand("🔥 " + buyers + " buyers searching in " + area);

    let rank = Math.floor(Math.random() * 5) + 1;
    setQueue("⚡ You are seller #" + rank + " waiting for buyers in " + area);
  }

  async function uploadImage() {

    if (!image) return null;

    const fileName = Date.now() + "-" + image.name;

    const { error } = await supabase
      .storage
      .from("property-images")
      .upload(fileName, image);

    if (error) {
      alert("Image upload failed");
      return null;
    }

    const { data } = supabase
      .storage
      .from("property-images")
      .getPublicUrl(fileName);

    return data.publicUrl;
  }

  async function saveListing() {

    if (!phone) {
      alert("Enter phone");
      return;
    }

    const imageUrl = await uploadImage();

   const { data, error } = await supabase
  .from("Listings")
  .insert([
    {
      area,
      size: parseInt(size),
      age: parseInt(age),
      phone,
      image_url: imageUrl
    }
  ])
  .select()
  .single();

    if (error) {
      alert("Error saving listing");
    } else {
      alert("✅ Property listed successfully");
   const options = {
  key:"rzp_live_SRVAJjNKLzLbx0",
  amount: 9900,
  currency: "INR",
  name: "RightPrice",
  description: "Boost Property Listing",
  handler: async function () {

    await supabase
      .from("Listings")
      .update({ is_boosted: true })
      .eq("id", data.id);

    alert("⭐ Payment successful. Property Boosted!");
  },
  theme: {
    color: "#16a34a"
  }
};

const rzp = new window.Razorpay(options);
rzp.open();
}
      setShowForm(false);
    }
  }

  return (

    <div className="min-h-screen bg-gray-50">

      <div className="bg-white shadow p-4 flex justify-between px-10">
        <h1 className="font-bold text-xl text-green-700">RightPrice</h1>
        <div className="space-x-6">
          <Link href="/" className="font-semibold text-green-700">Sell</Link>
          <Link href="/buying" className="font-semibold text-gray-600">Buy</Link>
        </div>
      </div>

      <div className="text-center mt-16">
        <h2 className="text-4xl font-bold">
          Know the Right Price Before You Sell
        </h2>
      </div>

      <div className="flex justify-center mt-10">

        <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-md">

          <select
            className="w-full border p-3 mb-3 rounded"
            value={area}
            onChange={(e) => setArea(e.target.value)}
          >
            <option value="">Select Area</option>
            {areas.map(a => <option key={a}>{a}</option>)}
          </select>

          <input
            className="w-full border p-3 mb-3 rounded"
            placeholder="Flat Size"
            value={size}
            onChange={(e) => setSize(e.target.value)}
          />

          <input
            className="w-full border p-3 mb-3 rounded"
            placeholder="Building Age"
            value={age}
            onChange={(e) => setAge(e.target.value)}
          />

          <button
            onClick={estimatePrice}
            className="w-full bg-green-600 text-white p-3 rounded"
          >
            Check My Flat Price
          </button>

          {price && (

            <div className="mt-6 text-center">

              <p className="text-xl text-green-700">{price}</p>

              <p className="text-orange-600 mt-3">{demand}</p>

              <p className="text-blue-600 mt-2">{queue}</p>

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
                className="w-full border p-3 mb-3 rounded"
                placeholder="Phone Number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />

              <label className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-xl p-6 cursor-pointer hover:bg-gray-50">
                📷 Click to Upload Property Photo
                <input
                  type="file"
                  className="hidden"
                  onChange={(e) => {
                    setImage(e.target.files[0]);
                    setPreview(URL.createObjectURL(e.target.files[0]));
                  }}
                />
              </label>

              {preview && (
                <img
                  src={preview}
                  className="mt-3 h-44 w-full object-cover rounded-xl"
                />
              )}

              <button
                onClick={saveListing}
                className="w-full mt-3 bg-blue-600 text-white p-3 rounded"
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