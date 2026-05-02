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

  useEffect(() => {
    fetch(`https://releaseit-backend.onrender.com/api/settings?shop=${shop}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setSettings((prev) => ({ ...prev, ...data }));
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
          onChange={(e) => setSettings({ ...settings, mode: e.target.value })}
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
          onChange={(e) =>
            setSettings({ ...settings, buttonText: e.target.value })
          }
          className="w-full p-3 mb-4 border rounded-lg"
        />

        {/* COLORS */}
        <div className="flex gap-4 mb-4">
          <div>
            <label>Background</label>
            <input
              type="color"
              value={settings.bgColor}
              onChange={(e) =>
                setSettings({ ...settings, bgColor: e.target.value })
              }
            />
          </div>

          <div>
            <label>Text</label>
            <input
              type="color"
              value={settings.textColor}
              onChange={(e) =>
                setSettings({ ...settings, textColor: e.target.value })
              }
            />
          </div>
        </div>

        {/* RADIUS */}
        <label>Border Radius</label>
        <input
          type="range"
          min="0"
          max="20"
          value={settings.borderRadius}
          onChange={(e) =>
            setSettings({
              ...settings,
              borderRadius: Number(e.target.value),
            })
          }
          className="w-full mb-4"
        />

        {/* POSITION */}
        <label>Position</label>
        <select
          value={settings.position}
          onChange={(e) =>
            setSettings({ ...settings, position: e.target.value })
          }
          className="w-full p-3 mb-6 border rounded-lg"
        >
          <option value="below">Below Add to Cart</option>
          <option value="above">Above Add to Cart</option>
          <option value="below_buy_now">Below Buy Now</option>
        </select>

        {/* LIVE PREVIEW */}
        <div className="bg-gray-100 p-4 rounded-xl mb-6">
          <button className="w-full border p-3 mb-2 rounded-lg">
            Add to cart
          </button>

          <button className="w-full bg-black text-white p-3 mb-2 rounded-lg">
            Buy it now
          </button>

          <button
            style={{
              background: settings.bgColor,
              color: settings.textColor,
              borderRadius: settings.borderRadius,
              padding: "12px",
              width: "100%",
            }}
          >
            {settings.buttonText}
          </button>
        </div>

        <button
          onClick={save}
          className="w-full bg-black text-white p-3 rounded-xl"
        >
          Save Settings
        </button>
      </div>
    </div>
  );
}
