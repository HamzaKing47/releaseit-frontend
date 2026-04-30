import { useEffect, useState } from "react";

function Admin() {
  const params = new URLSearchParams(window.location.search);
  const shop = params.get("shop");

  const [settings, setSettings] = useState({
    mode: "both",
    buttonText: "Buy with Cash on Delivery",
    bgColor: "#000000",
    textColor: "#ffffff",
    borderRadius: 10,
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
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl p-6">
        <h1 className="text-2xl font-bold mb-6">ReleaseIt Settings ⚙️</h1>

        {/* MODE */}
        <select
          value={settings.mode}
          onChange={(e) => setSettings({ ...settings, mode: e.target.value })}
          className="w-full p-3 mb-4 border rounded-lg"
        >
          <option value="both">Show All Buttons</option>
          <option value="replace">Replace Add to Cart</option>
          <option value="cod_only">Only COD Button</option>
        </select>

        {/* TEXT */}
        <input
          value={settings.buttonText}
          onChange={(e) =>
            setSettings({ ...settings, buttonText: e.target.value })
          }
          className="w-full p-3 mb-4 border rounded-lg"
          placeholder="Button Text"
        />

        {/* COLORS */}
        <div className="flex gap-4 mb-4">
          <input
            type="color"
            value={settings.bgColor}
            onChange={(e) =>
              setSettings({ ...settings, bgColor: e.target.value })
            }
          />
          <input
            type="color"
            value={settings.textColor}
            onChange={(e) =>
              setSettings({ ...settings, textColor: e.target.value })
            }
          />
        </div>

        {/* RADIUS */}
        <input
          type="range"
          min="0"
          max="30"
          value={settings.borderRadius}
          onChange={(e) =>
            setSettings({ ...settings, borderRadius: e.target.value })
          }
          className="w-full mb-4"
        />

        {/* POSITION */}
        <select
          value={settings.position}
          onChange={(e) =>
            setSettings({ ...settings, position: e.target.value })
          }
          className="w-full p-3 mb-4 border rounded-lg"
        >
          <option value="below">Below Add to Cart</option>
          <option value="above">Above Add to Cart</option>
        </select>

        {/* PREVIEW */}
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

        <button
          onClick={save}
          className="mt-6 w-full bg-black text-white p-3 rounded-xl"
        >
          Save Settings
        </button>
      </div>
    </div>
  );
}

export default Admin;
