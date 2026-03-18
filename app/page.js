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
  const [slots, setSlots] = useState("");
  const [heat, setHeat] = useState("");
  const [expiryMsg, setExpiryMsg] = useState("");
  const [buyers, setBuyers] = useState("");
  const [advice, setAdvice] = useState("");
 

  const [showForm, setShowForm] = useState(false);
  const [phone, setPhone] = useState("");

  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState("");

  const areas = [
    "Whitefield","Sarjapura","HSR Layout","Indiranagar",
    "Electronic City","Basavanagudi","Jayanagar",
    "Yelahanka","BTM Layout","Hebbal"
  ];

  async function estimatePrice() {

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
// ⭐ smart pricing advice engine
let suggest = Math.round((min + max) / 2);
let fastSell = Math.round(min * 0.97);
let overpriced = Math.round(max * 1.05);

let msg =
"⭐ Suggested Price: ₹ " + suggest.toLocaleString() +
"\n⚡ Fast Sale Price: ₹ " + fastSell.toLocaleString() +
"\n🚫 Above ₹ " + overpriced.toLocaleString() + " may reduce buyer interest";

setAdvice(msg);

// ⭐ fetch seller count
const { data } = await supabase
.from("Listings")
.select("id,is_boosted")
.eq("area", area);

let sellers = data.length;

// ⭐ demand message
setDemand("🔥 " + sellers + " sellers competing in " + area);

// ⭐ queue message
setQueue("⚡ You will become seller #" + (sellers + 1) + " in this area");

// ⭐ market heat logic
let heatMsg = "";
if (sellers > 15) heatMsg = "🔥 HOT MARKET — High buyer activity";
else if (sellers > 7) heatMsg = "⚡ WARM AREA — Moderate demand";
else heatMsg = "❄️ LOW ACTIVITY — Early opportunity";

setHeat(heatMsg);

// ⭐ boost scarcity logic
let boosted = data.filter(x => x.is_boosted).length;
let slotsLeft = 5 - boosted;

let slotMsg = "";
if (slotsLeft > 0) slotMsg = "⭐ Only " + slotsLeft + " BOOST slots left";
else slotMsg = "🚫 BOOST FULL in this area";

setSlots(slotMsg);
if (data.length > 0) {
  let expiry = new Date(data[0].free_expires_at);
  let now = new Date();

  let diff = expiry - now;

  if (diff > 0) {
    let hrs = Math.floor(diff / (1000*60*60));
    setExpiryMsg("⏳ Free visibility ends in " + hrs + " hrs");
  } else {
    setExpiryMsg("🚫 Free visibility expired — Boost to rank higher");
  }
}
// ⭐ fake buyer pressure engine
let buyerCount = Math.floor(Math.random() * 25) + 5;

setBuyers("👀 " + buyerCount + " buyers searched in " + area + " today");
}

  async function loadRazorpay() {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  }

  async function handleBoost() {

    if (!phone) {
      alert("Enter phone first by listing property");
      return;
    }

    const res = await loadRazorpay();

    if (!res) {
      alert("Payment SDK failed");
      return;
    }

    const options = {
      key: "rzp_test_SRWVOPEX9CILSZ",
      amount: 9900,
      currency: "INR",
      name: "RightPrice",
      description: "Boost Listing",

      handler: async function () {

        await supabase
          .from("Listings")
          .update({ is_boosted: true })
          .eq("phone", phone);

        alert("⭐ Payment Successful — Property Boosted!");
      }
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
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

    const { error } = await supabase
      .from("Listings")
      .insert([
        {
          area,
          size: parseInt(size),
          age: parseInt(age),
          phone,
          image_url: imageUrl,
          free_expires_at: new Date(Date.now() + 48*60*60*1000)
        }
      ]);

    if (error) {
      alert("Error saving listing");
    } else {
      alert("✅ Property listed successfully");
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

          <select className="w-full border p-3 mb-3 rounded"
            value={area}
            onChange={(e) => setArea(e.target.value)}
          >
            <option value="">Select Area</option>
            {areas.map(a => <option key={a}>{a}</option>)}
          </select>

          <input className="w-full border p-3 mb-3 rounded"
            placeholder="Flat Size"
            value={size}
            onChange={(e) => setSize(e.target.value)}
          />

          <input className="w-full border p-3 mb-3 rounded"
            placeholder="Building Age"
            value={age}
            onChange={(e) => setAge(e.target.value)}
          />

          <button onClick={estimatePrice}
            className="w-full bg-green-600 text-white p-3 rounded">
            Check My Flat Price
          </button>

          {price && (
            <div className="mt-6 text-center">
              <p className="text-xl text-green-700">{price}</p>
              <p className="text-orange-600 mt-3">{demand}</p>
              <p className="text-blue-600 mt-2">{queue}</p>
              <p className="text-yellow-600 font-semibold mt-2">{slots}</p>
              <p className="text-red-600 font-semibold mt-2">{heat}</p>
              <p className="text-purple-600 font-semibold mt-2">{expiryMsg}</p>
              <p className="text-purple-600 font-semibold mt-2">{buyers}</p>
              <p className="text-gray-700 whitespace-pre-line mt-3">{advice}</p>

              <button
                onClick={() => setShowForm(true)}
                className="mt-4 bg-black text-white px-4 py-2 rounded"
              >
                List My Property
              </button>

              <button
                onClick={handleBoost}
                className="mt-3 bg-yellow-500 text-white px-4 py-2 rounded"
              >
                ⭐ Boost My Listing ₹99
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