import { useEffect, useState } from "react";

function Admin() {
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

  // 🔥 COD BUTTON PREVIEW COMPONENT
  const CODPreview = ({ settings }) => {
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
  };

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center p-6">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl p-6">
        {/* 🔥 SHOPIFY STYLE BUTTON CSS */}
        <style>{`
          .shopify-btn {
            width: 100%;
            padding: 14px;
            border-radius: 6px;
            font-weight: 600;
            margin-bottom: 8px;
            transition: all 0.2s ease;
            border: 1px solid transparent;
          }

          .shopify-btn.primary {
            background: white;
            border: 1px solid #ccc;
          }

          .shopify-btn.primary:hover {
            border-color: black;
          }

          .shopify-btn.secondary {
            background: black;
            color: white;
          }

          .shopify-btn.secondary:hover {
            opacity: 0.9;
          }
        `}</style>

        <h1 className="text-2xl font-bold mb-6">⚙️ ReleaseIt Pro</h1>

        {/* MODE */}
        <select
          value={settings.mode}
          onChange={(e) => setSettings({ ...settings, mode: e.target.value })}
          className="w-full p-3 mb-4 border rounded-lg"
        >
          <option value="both">Show All Buttons</option>
          <option value="replace">Replace Add to Cart</option>
          <option value="replace_buy_now">Replace Buy Now</option>
          <option value="cod_only">Only COD Button</option>
        </select>

        {/* TEXT */}
        <input
          value={settings.buttonText}
          onChange={(e) =>
            setSettings({ ...settings, buttonText: e.target.value })
          }
          className="w-full p-3 mb-4 border rounded-lg"
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
          <option value="below_buy_now">Below Buy Now</option>
        </select>

        {/* 🔥 LIVE PREVIEW */}
        <div className="bg-gray-100 p-5 rounded-xl mb-6">
          <p className="text-sm mb-3 text-gray-500">Live Preview</p>

          {/* REPLACE ADD TO CART */}
          {settings.mode === "replace" && (
            <>
              <CODPreview settings={settings} />
              <button className="shopify-btn secondary">Buy it now</button>
            </>
          )}

          {/* REPLACE BUY NOW */}
          {settings.mode === "replace_buy_now" && (
            <>
              <button className="shopify-btn primary">Add to cart</button>
              <CODPreview settings={settings} />
            </>
          )}

          {/* COD ONLY */}
          {settings.mode === "cod_only" && <CODPreview settings={settings} />}

          {/* BOTH */}
          {settings.mode === "both" && (
            <>
              {settings.position === "above" && (
                <CODPreview settings={settings} />
              )}

              <button className="shopify-btn primary">Add to cart</button>

              {settings.position === "below" && (
                <CODPreview settings={settings} />
              )}

              <button className="shopify-btn secondary">Buy it now</button>

              {settings.position === "below_buy_now" && (
                <CODPreview settings={settings} />
              )}
            </>
          )}
        </div>

        <button
          onClick={save}
          className="mt-4 w-full bg-black text-white p-3 rounded-xl"
        >
          Save Settings
        </button>
      </div>
    </div>
  );
}

export default Admin;
