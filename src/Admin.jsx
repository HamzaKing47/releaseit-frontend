import { useEffect, useState } from "react";

export default function Admin() {
  const params = new URLSearchParams(window.location.search);
  const shop = params.get("shop");

  const [settings, setSettings] = useState({
    mode: "both",
    buttonText: "Buy with Cash on Delivery",
    bgColor: "#000000",
    textColor: "#ffffff",
    borderRadius: 6,
    position: "below",
  });

  // 🔥 UNIVERSAL STATE UPDATE FIX
  const update = (key, value) => {
    setSettings((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  useEffect(() => {
    fetch(`https://releaseit-backend.onrender.com/api/settings?shop=${shop}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setSettings((prev) => ({
            ...prev,
            ...data,
          }));
        }
      });
  }, []);

  const save = async () => {
    await fetch(
      `https://releaseit-backend.onrender.com/api/settings?shop=${shop}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      },
    );

    alert("Saved ✅");
  };

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center p-6">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-3xl p-6">
        <h1 className="text-2xl font-bold mb-6">⚙️ ReleaseIt Pro Settings</h1>

        {/* MODE */}
        <label className="text-sm font-semibold">Button Mode</label>
        <select
          value={settings.mode}
          onChange={(e) => update("mode", e.target.value)}
          className="w-full p-3 mb-4 border rounded-lg"
        >
          <option value="both">Show All</option>
          <option value="replace">Replace Add to Cart</option>
          <option value="replace_buy_now">Replace Buy Now</option>
          <option value="cod_only">Only COD</option>
        </select>

        {/* TEXT */}
        <label className="text-sm font-semibold">Button Text</label>
        <input
          value={settings.buttonText}
          onChange={(e) => update("buttonText", e.target.value)}
          className="w-full p-3 mb-4 border rounded-lg"
        />

        {/* COLORS */}
        <div className="flex gap-6 mb-4">
          <div>
            <label className="block text-sm mb-1">Background</label>
            <input
              type="color"
              value={settings.bgColor}
              onChange={(e) => update("bgColor", e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm mb-1">Text</label>
            <input
              type="color"
              value={settings.textColor}
              onChange={(e) => update("textColor", e.target.value)}
            />
          </div>
        </div>

        {/* RADIUS */}
        <label className="text-sm font-semibold">Border Radius</label>
        <input
          type="range"
          min="0"
          max="20"
          value={settings.borderRadius}
          onChange={
            (e) => update("borderRadius", Number(e.target.value)) // 🔥 FIX
          }
          className="w-full mb-4"
        />

        {/* POSITION */}
        <label className="text-sm font-semibold">Position</label>
        <select
          value={settings.position}
          onChange={(e) => update("position", e.target.value)}
          className="w-full p-3 mb-6 border rounded-lg"
        >
          <option value="below">Below Add to Cart</option>
          <option value="above">Above Add to Cart</option>
          <option value="below_buy_now">Below Buy Now</option>
        </select>

        {/* 🔥 LIVE PREVIEW (UPGRADED) */}
        <div className="bg-gray-100 p-4 rounded-xl mb-6">
          <p className="text-sm mb-2 text-gray-500">Preview</p>

          <button className="w-full border p-3 mb-2 rounded-lg">
            Add to cart
          </button>

          <button className="w-full bg-black text-white p-3 mb-2 rounded-lg">
            Buy it now
          </button>

          <button
            key={JSON.stringify(settings)} // 🔥 FORCE RE-RENDER
            style={{
              background: settings.bgColor,
              color: settings.textColor,
              borderRadius: settings.borderRadius,
              padding: "12px",
              width: "100%",
              transition: "all 0.25s ease",
            }}
          >
            {settings.buttonText}
          </button>
        </div>

        {/* SAVE */}
        <button
          onClick={save}
          className="w-full bg-black text-white p-3 rounded-xl hover:opacity-90 transition"
        >
          Save Settings
        </button>
      </div>
    </div>
  );
}
