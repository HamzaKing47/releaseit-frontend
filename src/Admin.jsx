import { useEffect, useState } from "react";

function CODPreview({ settings }) {
  return (
    <button
      style={{
        background: settings.bgColor,
        color: settings.textColor,
        borderRadius: settings.borderRadius,
        padding: "12px",
        width: "100%",
        transition: "all 0.25s ease",
        border: "1px solid transparent",
        fontWeight: "600",
      }}
      onMouseEnter={(e) => {
        e.target.style.transform = "translateY(-2px)";
        e.target.style.border = "1px solid rgba(0,0,0,0.2)";
      }}
      onMouseLeave={(e) => {
        e.target.style.transform = "translateY(0)";
        e.target.style.border = "1px solid transparent";
      }}
    >
      {settings.buttonText}
    </button>
  );
}

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

  // 🔥 universal update
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
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-3xl p-8 border border-gray-100">
        {/* HEADER */}
        <h1 className="text-3xl font-semibold mb-6 flex items-center gap-2">
          ⚙️ <span>ReleaseIt Pro</span>
        </h1>

        {/* MODE */}
        <label className="text-sm font-semibold">Button Mode</label>
        <select
          value={settings.mode}
          onChange={(e) => update("mode", e.target.value)}
          className="w-full p-3 mb-5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black"
        >
          <option value="both">Show All Buttons</option>
          <option value="replace">Replace Add to Cart</option>
          <option value="replace_buy_now">Replace Buy Now</option>
          <option value="cod_only">Only COD Button</option>
        </select>

        {/* TEXT */}
        <label className="text-sm font-semibold">Button Text</label>
        <input
          value={settings.buttonText}
          onChange={(e) => update("buttonText", e.target.value)}
          className="w-full p-3 mb-5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black"
        />

        {/* COLORS */}
        <div className="flex gap-6 mb-5">
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
          onChange={(e) => update("borderRadius", Number(e.target.value))}
          className="w-full mb-6"
        />

        {/* POSITION */}
        <label className="text-sm font-semibold">Position</label>
        <select
          value={settings.position}
          onChange={(e) => update("position", e.target.value)}
          className="w-full p-3 mb-6 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black"
        >
          <option value="below">Below Add to Cart</option>
          <option value="above">Above Add to Cart</option>
          <option value="below_buy_now">Below Buy Now</option>
        </select>

        {/* 🔥 LIVE PREVIEW */}
        <div className="bg-gray-100 p-5 rounded-xl mb-6 transition-all hover:shadow-md">
          <p className="text-sm mb-3 text-gray-500">Live Preview</p>

          {/* ABOVE */}
          {settings.position === "above" &&
            settings.mode !== "replace" &&
            settings.mode !== "replace_buy_now" && (
              <CODPreview settings={settings} />
            )}

          {/* ADD TO CART */}
          {settings.mode !== "cod_only" && settings.mode !== "replace" && (
            <button className="w-full border p-3 mb-2 rounded-lg bg-white">
              Add to cart
            </button>
          )}

          {/* 🔥 REPLACE ADD TO CART */}
          {settings.mode === "replace" && <CODPreview settings={settings} />}

          {/* BUY NOW */}
          {settings.mode !== "cod_only" &&
            settings.mode !== "replace_buy_now" && (
              <button className="w-full bg-black text-white p-3 mb-2 rounded-lg">
                Buy it now
              </button>
            )}

          {/* 🔥 REPLACE BUY NOW */}
          {settings.mode === "replace_buy_now" && (
            <CODPreview settings={settings} />
          )}

          {/* BELOW ADD */}
          {settings.position === "below" && settings.mode === "both" && (
            <CODPreview settings={settings} />
          )}

          {/* BELOW BUY NOW */}
          {settings.position === "below_buy_now" &&
            settings.mode === "both" && <CODPreview settings={settings} />}
        </div>

        {/* SAVE */}
        <button
          onClick={save}
          className="w-full bg-black text-white p-4 rounded-xl hover:opacity-90 transition-all duration-200 shadow-md"
        >
          Save Settings
        </button>
      </div>
    </div>
  );
}
