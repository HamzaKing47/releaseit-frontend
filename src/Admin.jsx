import { useEffect, useState } from "react";

/* =========================
   COD BUTTON (PREVIEW)
========================= */
function CODPreview({ settings }) {
  return (
    <button
      style={{
        width: "100%",
        padding: "14px",
        background: settings.bgColor,
        color: settings.textColor,
        borderRadius: settings.borderRadius,
        border: `1px solid ${settings.bgColor}`,
        fontWeight: 600,
        marginBottom: "8px",
        transition: "all 0.2s ease",
      }}
      onMouseEnter={(e) => {
        e.target.style.background = "transparent";
        e.target.style.color = settings.bgColor;
      }}
      onMouseLeave={(e) => {
        e.target.style.background = settings.bgColor;
        e.target.style.color = settings.textColor;
      }}
    >
      {settings.buttonText}
    </button>
  );
}

/* =========================
   MAIN COMPONENT
========================= */
export default function Admin() {
  const params = new URLSearchParams(window.location.search);
  const shop = params.get("shop");

  const [settings, setSettings] = useState({
    mode: "both",
    buttonText: "Buy with Cash on Delivery",
    bgColor: "#ff0000",
    textColor: "#ffffff",
    borderRadius: 6,
    position: "below",
  });

  const update = (key, value) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  useEffect(() => {
    fetch(`https://releaseit-backend.onrender.com/api/settings?shop=${shop}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setSettings((prev) => ({ ...prev, ...data }));
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

  /* ✅ FIX: variables OUTSIDE JSX */
  const showAddToCart =
    settings.mode !== "cod_only" && settings.mode !== "replace";

  const showBuyNow =
    settings.mode !== "cod_only" && settings.mode !== "replace_buy_now";

  const showCOD =
    settings.mode === "both" ||
    settings.mode === "replace" ||
    settings.mode === "replace_buy_now" ||
    settings.mode === "cod_only";

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center p-6">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-3xl p-8 border border-gray-100">
        <h1 className="text-3xl font-semibold mb-6 flex items-center gap-2">
          ⚙️ <span>ReleaseIt Pro</span>
        </h1>

        {/* MODE */}
        <label className="text-sm font-semibold">Button Mode</label>
        <select
          value={settings.mode}
          onChange={(e) => update("mode", e.target.value)}
          className="w-full p-3 mb-5 border border-gray-200 rounded-xl"
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
          className="w-full p-3 mb-5 border border-gray-200 rounded-xl"
        />

        {/* COLORS */}
        <div className="flex gap-6 mb-5">
          <input
            type="color"
            value={settings.bgColor}
            onChange={(e) => update("bgColor", e.target.value)}
          />
          <input
            type="color"
            value={settings.textColor}
            onChange={(e) => update("textColor", e.target.value)}
          />
        </div>

        {/* RADIUS */}
        <input
          type="range"
          min="0"
          max="20"
          value={settings.borderRadius}
          onChange={(e) => update("borderRadius", Number(e.target.value))}
          className="w-full mb-6"
        />

        {/* POSITION */}
        <select
          value={settings.position}
          onChange={(e) => update("position", e.target.value)}
          className="w-full p-3 mb-6 border border-gray-200 rounded-xl"
        >
          <option value="below">Below Add to Cart</option>
          <option value="above">Above Add to Cart</option>
          <option value="below_buy_now">Below Buy Now</option>
        </select>

        {/* 🔥 LIVE PREVIEW */}
        <div className="bg-gray-100 p-5 rounded-xl mb-6">
          <p className="text-sm mb-3 text-gray-500">Live Preview</p>

          {/* ABOVE */}
          {settings.position === "above" && showCOD && (
            <CODPreview settings={settings} />
          )}

          {/* ADD TO CART */}
          {showAddToCart && (
            <button className="w-full border p-3 rounded-lg mb-2 bg-white">
              Add to cart
            </button>
          )}

          {/* BELOW ADD */}
          {settings.position === "below" && showCOD && (
            <CODPreview settings={settings} />
          )}

          {/* BUY NOW */}
          {showBuyNow && (
            <button className="w-full bg-black text-white p-3 rounded-lg mb-2">
              Buy it now
            </button>
          )}

          {/* BELOW BUY NOW */}
          {settings.position === "below_buy_now" && showCOD && (
            <CODPreview settings={settings} />
          )}
        </div>

        {/* SAVE */}
        <button
          onClick={save}
          className="w-full bg-black text-white p-4 rounded-xl"
        >
          Save Settings
        </button>
      </div>
    </div>
  );
}
