  "use client";

  import { useState } from "react";
  import Link from "next/link";
  import { supabase } from "../supabase";

  export default function Buying() {

    const [area, setArea] = useState("");
    const [listings, setListings] = useState([]);
    const [unlockedId, setUnlockedId] = useState(null);
    const [liveViews, setLiveViews] = useState({});
    const [viewMode, setViewMode] = useState("list");
    const [savedSearch, setSavedSearch] = useState(false);
    const [searched, setSearched] = useState(false);
    const [lastCount, setLastCount] = useState(0);
    const [minBudget, setMinBudget] = useState(0);
  const [maxBudget, setMaxBudget] = useState(100000000);
  const [minSize, setMinSize] = useState(0);
  const [maxSize, setMaxSize] = useState(5000);
  const [ageFilter, setAgeFilter] = useState("any");

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

  let filtered = data.filter(item => {

  let price = item.size * 8000;

  if (price > maxBudget) return false;
  if (item.size > maxSize) return false;

  if (ageFilter === "new" && item.age > 5) return false;
  if (ageFilter === "mid" && (item.age < 5 || item.age > 15)) return false;
  if (ageFilter === "old" && item.age < 15) return false;

  return true;
  });
  let lastCount = localStorage.getItem("lastCount_" + area);

  if (lastCount && filtered.length > lastCount) {
    alert("🆕 " + (filtered.length - lastCount) + " new properties added in " + area);
  }

  localStorage.setItem("lastCount_" + area, filtered.length);


  setListings(filtered);
  setSearched(true);

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

        <div className="sticky top-0 z-50 bg-gradient-to-r from-green-700 to-green-500 shadow-lg">

    <div className="flex justify-between items-center px-8 py-4 text-white">

      <h1 className="font-bold text-2xl tracking-wide">
        RightPrice
      </h1>

      <div className="space-x-6 text-sm font-semibold">

        <Link href="/" className="hover:underline">
          Sell
        </Link>

        <Link href="/buying" className="hover:underline">
          Buy
        </Link>

        <span className="opacity-80 cursor-pointer">
          Map
        </span>

        <span className="opacity-80 cursor-pointer">
          Alerts
        </span>

      </div>

    </div>

  </div>

        <div className="flex justify-center mt-10">

          <div className="bg-white shadow rounded-xl p-6 w-full max-w-md">

            <h2 className="text-xl font-semibold mb-4 text-center">
              Find Properties
            </h2>
            <div className="flex justify-center mb-3 gap-3">

    <button
      onClick={() => setViewMode("list")}
      className={`px-3 py-1 rounded ${viewMode==="list" ? "bg-green-600 text-white" : "bg-gray-200"}`}
    >
      List View
    </button>

    <button
      onClick={() => setViewMode("map")}
      className={`px-3 py-1 rounded ${viewMode==="map" ? "bg-green-600 text-white" : "bg-gray-200"}`}
    >
      Map View
    </button>

  </div>

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
            <button
    onClick={() => {
      localStorage.setItem(
        "savedSearch",
        JSON.stringify({ area })
      );
      setSavedSearch(true);
    }}
    className="w-full mt-2 bg-blue-600 text-white p-2 rounded"
  >
    🔔 Save this search
  </button>
            <div className="mt-4">

  <p className="text-sm font-semibold">Budget Range</p>
  <input
    type="range"
    min="0"
    max="20000000"
    step="100000"
    onChange={(e)=>setMaxBudget(e.target.value)}
    className="w-full"
  />

  <p className="text-sm font-semibold mt-3">Flat Size (sqft)</p>
  <input
    type="range"
    min="500"
    max="4000"
    step="100"
    onChange={(e)=>setMaxSize(e.target.value)}
    className="w-full"
  />

  <p className="text-sm font-semibold mt-3">Property Age</p>
  <select
    className="w-full border p-2 rounded"
    onChange={(e)=>setAgeFilter(e.target.value)}
  >
    <option value="any">Any</option>
    <option value="new">0-5 years</option>
    <option value="mid">5-15 years</option>
    <option value="old">15+ years</option>
  </select>
  {savedSearch && (
    <p className="text-green-600 text-sm text-center mt-2">
      ✅ Search saved — we will alert you on new listings
    </p>
  )}

  </div>

          </div>

        </div>

      {viewMode === "list" && (
  <div className="max-w-xl mx-auto mt-6">
  {searched && listings.length === 0 &&  (
    <div className="text-center bg-white p-6 rounded-xl shadow">
      <p className="text-gray-600 mb-3">
        No properties match your filters
      </p>

      <button
        onClick={() => {
          setMinBudget(0);
          setMaxBudget(100000000);
          setMinSize(0);
          setMaxSize(5000);
          setAgeFilter("any");
          search();
        }}
        className="bg-green-600 text-white px-4 py-2 rounded"
      >
        Reset Filters
      </button>
    </div>
  )}

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
    className={`p-4 mb-4 rounded-xl shadow transition transform hover:scale-105 hover:shadow-2xl duration-300
        ${Date.now() - new Date(item.created_at || Date.now()) < 86400000
      ? "ring-2 ring-green-400 animate-pulse"
      : ""}
    ${item.is_boosted
     ? "bg-yellow-50 border-2 border-yellow-400"
      : "bg-white hover:scale-[1.03] hover:shadow-xl"}`}
  >
    

  <div className="relative">

    <img
      src={item.image_url}
      className="h-44 w-full object-cover rounded transition"
    />

    <button
      onClick={() => alert("Next image demo")}
      className="absolute left-2 top-1/2 -translate-y-1/2 bg-white px-2 rounded shadow"
    >
      ◀
    </button>

    <button
      onClick={() => alert("Next image demo")}
      className="absolute right-2 top-1/2 -translate-y-1/2 bg-white px-2 rounded shadow"
    >
      ▶
    </button>

    <div className="absolute bottom-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded">
      1 / 5
    </div>
    

  </div>
  {item.is_boosted && (
    <div className="flex justify-between items-center">
      <p className="text-yellow-600 font-bold">⭐ BOOSTED</p>
  {!item.is_boosted && new Date(item.free_expires_at) < new Date() && (
    <p className="text-red-600 font-bold">⏳ FREE EXPIRED</p>
  )}
      {(() => {

    let demandScore = Math.floor(Math.random()*100);

    if (demandScore > 70) {
      return (
        <span className="bg-red-500 text-white text-xs px-2 py-1 rounded">
          HIGH DEMAND
        </span>
      );
    }

    if (demandScore > 40) {
      return (
        <span className="bg-orange-500 text-white text-xs px-2 py-1 rounded">
          MEDIUM DEMAND
        </span>
      );
    }

    return (
      <span className="bg-green-500 text-white text-xs px-2 py-1 rounded">
        LOW DEMAND
      </span>
    );

  })()}
    </div>
  )}
                <h3 className="font-semibold mt-2">
                  {item.size} sqft Apartment
                </h3>

                <p className="text-gray-600">{item.area}</p>

                <p className="text-green-700 font-semibold mt-1">
                  ₹ {min.toLocaleString()} – ₹ {max.toLocaleString()}
                </p>
                {
    (() => {
      let avg = (min + max) / 2;
      let randomPrice = avg * (Math.random()*0.2 + 0.9);

      if (randomPrice < avg * 0.95) {
        return (
          <p className="text-green-600 text-sm font-semibold">
            🟢 GOOD DEAL
          </p>
        );
      }

      if (randomPrice > avg * 1.05) {
        return (
          <p className="text-red-600 text-sm font-semibold">
            🔴 OVERPRICED
          </p>
        );
      }

      return (
        <p className="text-yellow-600 text-sm font-semibold">
          🟡 FAIR PRICE
          {Math.random() > 0.6 && (
    <p className="text-xs text-red-500 font-semibold mt-1 animate-pulse">
      🔻 Price dropped recently
    </p>
  )}
        </p>
      );
    })()
  }

                <p className="text-sm text-gray-500">
                  Age: {item.age} years
                </p>

                <p className="text-blue-600 text-sm mt-1">
                  Seller Rank #{rank} in this area
                </p>
                <div className="mt-2">
    <p className="text-xs text-gray-500">Price Trend</p>

    <div className="w-full bg-gray-200 h-2 rounded mt-1">
      <div
        className="bg-blue-500 h-2 rounded transition-all"
        style={{
          width: (Math.floor(Math.random()*60)+30) + "%"
        }}
      ></div>
    </div>

    <p className="text-xs text-gray-400 mt-1">
      📈 Prices rising in this locality
      <p className="text-xs text-indigo-600 mt-1">
  💬 Seller open to negotiation
  </p>
    </p>
  </div>
                <p className="text-red-600 text-sm font-semibold">
  🔥 Demand Score {Math.floor(Math.random()*40)+60}/100
  <p className="text-xs text-pink-600 mt-1">
  ❤️ {Math.floor(Math.random()*8)+2} buyers shortlisted this
  </p>
  </p>
                <p className="text-orange-600 text-sm">
  <p className="text-purple-600 text-sm">
  👀 {liveViews[item.id] || 5} people viewing now
  <div className="mt-2">
    <div className="w-full bg-gray-200 h-2 rounded">
      <div
        className="bg-red-500 h-2 rounded animate-pulse"
        style={{ width: (Math.floor(Math.random()*60)+30) + "%" }}
      ></div>
    </div>
    <p className="text-xs text-gray-500">
      Buyer competition level
    </p>
  </div>
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
      )}
      {viewMode === "map" && (

  <div className="mt-6 px-6">

    <div className="bg-green-100 h-[500px] rounded-xl relative overflow-hidden">

      {listings.map((item,i)=>(
        <div
          key={item.id}
        className={`absolute p-2 rounded shadow text-xs transition
  ${item.is_boosted ? "bg-yellow-300 scale-110 animate-pulse" : "bg-white"}`}
  
          
          style={{
            top: (i*60)%420,
            left: (i*90)%300
          }}
        >
          ₹{Math.floor(item.size*8000/100000)}L
        </div>
      ))}

    </div>

  </div>

  )}
  {/* ⭐ FLOATING BOOST BANNER */}
  <div className="fixed bottom-6 right-6 bg-yellow-400 text-black px-6 py-3 rounded-xl shadow-2xl animate-bounce z-50">
    ⭐ Premium listings selling faster  
    <button
      onClick={()=>alert("Boost plan demo")}
      className="ml-3 bg-black text-white px-3 py-1 rounded"
    >
      Boost Now
    </button>
  </div>
      </div>
        
    );
  }