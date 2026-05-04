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
        border: `2px solid ${settings.bgColor}`,
        fontWeight: 600,
        marginBottom: "10px",
        transition: "all 0.2s ease",
        cursor: "pointer",
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

  const [pixels, setPixels] = useState([]);

  const update = (key, value) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  /* =========================
     LOAD SETTINGS
  ========================= */
  useEffect(() => {
    fetch(`https://releaseit-backend.onrender.com/api/settings?shop=${shop}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setSettings((prev) => ({ ...prev, ...data }));
        }
      });

    /* 🔥 LOAD PIXELS */
    fetch(`https://releaseit-backend.onrender.com/api/pixels?shop=${shop}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setPixels(data.pixels || []);
        }
      });
  }, []);

  /* =========================
     SAVE SETTINGS
  ========================= */
  const save = async () => {
    await fetch(
      `https://releaseit-backend.onrender.com/api/settings?shop=${shop}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      },
    );

    alert("Settings Saved ✅");
  };

  /* =========================
     SAVE PIXELS
  ========================= */
  const savePixels = async () => {
    await fetch(`https://releaseit-backend.onrender.com/api/pixels`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        shop,
        pixels,
      }),
    });

    alert("Pixels Saved ✅");
  };

  /* =========================
     BUTTON LOGIC
  ========================= */
  const showAddToCart =
    settings.mode !== "cod_only" && settings.mode !== "replace";

  const showBuyNow =
    settings.mode !== "cod_only" && settings.mode !== "replace_buy_now";

  const showCOD =
    settings.mode === "both" ||
    settings.mode === "replace" ||
    settings.mode === "replace_buy_now" ||
    settings.mode === "cod_only";

  /* =========================
     PIXEL HANDLER
  ========================= */
  const addPixel = () => {
    setPixels([...pixels, { type: "facebook", pixelId: "", label: "" }]);
  };

  const updatePixel = (index, key, value) => {
    const updated = [...pixels];
    updated[index][key] = value;
    setPixels(updated);
  };

  const removePixel = (index) => {
    const updated = [...pixels];
    updated.splice(index, 1);
    setPixels(updated);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center p-6">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-3xl p-8 border border-gray-100">
        <h1 className="text-3xl font-semibold mb-6 flex items-center gap-2">
          ⚙️ <span>ReleaseIt Pro</span>
        </h1>

        {/* ================= SETTINGS ================= */}

        <label className="text-sm font-semibold">Button Mode</label>
        <select
          value={settings.mode}
          onChange={(e) => update("mode", e.target.value)}
          className="w-full p-3 mb-5 border rounded-xl"
        >
          <option value="both">Show All Buttons</option>
          <option value="replace">Replace Add to Cart</option>
          <option value="replace_buy_now">Replace Buy Now</option>
          <option value="cod_only">Only COD Button</option>
        </select>

        <label className="text-sm font-semibold">Button Text</label>
        <input
          value={settings.buttonText}
          onChange={(e) => update("buttonText", e.target.value)}
          className="w-full p-3 mb-5 border rounded-xl"
        />

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

        <input
          type="range"
          min="0"
          max="20"
          value={settings.borderRadius}
          onChange={(e) => update("borderRadius", Number(e.target.value))}
          className="w-full mb-6"
        />

        <select
          value={settings.position}
          onChange={(e) => update("position", e.target.value)}
          className="w-full p-3 mb-6 border rounded-xl"
        >
          <option value="below">Below Add to Cart</option>
          <option value="above">Above Add to Cart</option>
          <option value="below_buy_now">Below Buy Now</option>
        </select>

        {/* ================= LIVE PREVIEW ================= */}

        <div className="bg-gray-100 p-5 rounded-xl mb-6">
          <p className="text-sm mb-3 text-gray-500">Live Preview</p>

          {settings.position === "above" && showCOD && (
            <CODPreview settings={settings} />
          )}

          {showAddToCart && (
            <button className="w-full border p-3 rounded-lg mb-2 bg-white">
              Add to cart
            </button>
          )}

          {settings.position === "below" && showCOD && (
            <CODPreview settings={settings} />
          )}

          {showBuyNow && (
            <button className="w-full bg-black text-white p-3 rounded-lg mb-2">
              Buy it now
            </button>
          )}

          {settings.position === "below_buy_now" && showCOD && (
            <CODPreview settings={settings} />
          )}
        </div>

        {/* ================= PIXELS MODULE ================= */}

        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-3">Pixels</h2>

          {pixels.map((p, i) => (
            <div key={i} className="border p-3 mb-3 rounded-xl">
              <input
                placeholder="Pixel ID"
                value={p.pixelId}
                onChange={(e) => updatePixel(i, "pixelId", e.target.value)}
                className="w-full p-2 mb-2 border rounded"
              />

              <input
                placeholder="Label"
                value={p.label}
                onChange={(e) => updatePixel(i, "label", e.target.value)}
                className="w-full p-2 mb-2 border rounded"
              />

              <button
                onClick={() => removePixel(i)}
                className="text-red-500 text-sm"
              >
                Remove
              </button>
            </div>
          ))}

          <button
            onClick={addPixel}
            className="bg-gray-200 px-4 py-2 rounded-lg mr-2"
          >
            Add Pixel
          </button>

          <button
            onClick={savePixels}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg"
          >
            Save Pixels
          </button>
        </div>

        {/* ================= SAVE ================= */}

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
