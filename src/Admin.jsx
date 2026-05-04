import { useEffect, useState } from "react";

/* =========================
   COD PREVIEW
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
   MAIN
========================= */
export default function Admin() {
  const shop = new URLSearchParams(window.location.search).get("shop");

  const [activeTab, setActiveTab] = useState("button");

  const [settings, setSettings] = useState({
    mode: "both",
    buttonText: "Buy with Cash on Delivery",
    bgColor: "#ff0000",
    textColor: "#ffffff",
    borderRadius: 6,
    position: "below",
  });

  const [pixels, setPixels] = useState([]);

  const update = (k, v) => setSettings((p) => ({ ...p, [k]: v }));

  /* =========================
     LOAD
  ========================= */
  useEffect(() => {
    fetch(`https://releaseit-backend.onrender.com/api/settings?shop=${shop}`)
      .then((r) => r.json())
      .then((d) => d.success && setSettings((p) => ({ ...p, ...d })));

    fetch(`https://releaseit-backend.onrender.com/api/pixels?shop=${shop}`)
      .then((r) => r.json())
      .then((d) => d.success && setPixels(d.pixels || []));
  }, []);

  /* =========================
     SAVE
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

  const savePixels = async () => {
    await fetch(`https://releaseit-backend.onrender.com/api/pixels`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ shop, pixels }),
    });
    alert("Pixels Saved ✅");
  };

  const addPixel = () =>
    setPixels([...pixels, { type: "facebook", pixelId: "", label: "" }]);

  const updatePixel = (i, k, v) => {
    const arr = [...pixels];
    arr[i][k] = v;
    setPixels(arr);
  };

  const removePixel = (i) => {
    const arr = [...pixels];
    arr.splice(i, 1);
    setPixels(arr);
  };

  /* =========================
     UI
  ========================= */
  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* SIDEBAR */}
      <div className="w-64 bg-white shadow-md p-5">
        <h2 className="text-xl font-bold mb-6">ReleaseIt</h2>

        <button
          onClick={() => setActiveTab("button")}
          className={`block w-full text-left mb-3 ${
            activeTab === "button" ? "font-bold" : ""
          }`}
        >
          ⚙️ COD Button
        </button>

        <button
          onClick={() => setActiveTab("pixels")}
          className={`block w-full text-left ${
            activeTab === "pixels" ? "font-bold" : ""
          }`}
        >
          📊 Pixels
        </button>
      </div>

      {/* MAIN CONTENT */}
      <div className="flex-1 p-8">
        {/* ================= BUTTON SECTION ================= */}
        {activeTab === "button" && (
          <div className="bg-white p-6 rounded-2xl shadow-md max-w-2xl">
            <h2 className="text-xl font-semibold mb-4">COD Button Settings</h2>

            <input
              value={settings.buttonText}
              onChange={(e) => update("buttonText", e.target.value)}
              className="w-full border p-3 mb-4 rounded"
            />

            <div className="flex gap-4 mb-4">
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
              className="w-full mb-4"
            />

            {/* PREVIEW */}
            <div className="bg-gray-100 p-4 rounded mb-4">
              <button className="w-full border p-3 mb-2 bg-white">
                Add to cart
              </button>

              <button className="w-full bg-black text-white p-3 mb-2">
                Buy it now
              </button>

              <CODPreview settings={settings} />
            </div>

            <button
              onClick={save}
              className="bg-black text-white px-6 py-3 rounded-lg"
            >
              Save Settings
            </button>
          </div>
        )}

        {/* ================= PIXEL SECTION ================= */}
        {activeTab === "pixels" && (
          <div className="bg-white p-6 rounded-2xl shadow-md max-w-2xl">
            <h2 className="text-xl font-semibold mb-4">Pixels</h2>

            {pixels.map((p, i) => (
              <div key={i} className="border p-3 mb-3 rounded">
                <input
                  placeholder="Pixel ID"
                  value={p.pixelId}
                  onChange={(e) => updatePixel(i, "pixelId", e.target.value)}
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
              className="bg-gray-200 px-4 py-2 rounded mr-2"
            >
              Add Pixel
            </button>

            <button
              onClick={savePixels}
              className="bg-blue-600 text-white px-4 py-2 rounded"
            >
              Save Pixels
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
