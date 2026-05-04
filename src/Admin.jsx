import { useEffect, useState } from "react";

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

export default function Admin() {
  const shop = new URLSearchParams(window.location.search).get("shop");

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

  useEffect(() => {
    fetch(`https://releaseit-backend.onrender.com/api/settings?shop=${shop}`)
      .then((r) => r.json())
      .then((d) => d.success && setSettings((p) => ({ ...p, ...d })));

    fetch(`https://releaseit-backend.onrender.com/api/pixels?shop=${shop}`)
      .then((r) => r.json())
      .then((d) => d.success && setPixels(d.pixels || []));
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

  const showAdd = settings.mode !== "cod_only" && settings.mode !== "replace";
  const showBuy =
    settings.mode !== "cod_only" && settings.mode !== "replace_buy_now";
  const showCOD = ["both", "replace", "replace_buy_now", "cod_only"].includes(
    settings.mode,
  );

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center p-6">
      <div className="bg-white rounded-3xl shadow-xl w-full max-w-3xl p-8">
        <h1 className="text-2xl font-bold mb-6">ReleaseIt Pro</h1>

        {/* SETTINGS */}
        <input
          value={settings.buttonText}
          onChange={(e) => update("buttonText", e.target.value)}
          className="w-full border p-3 mb-4"
        />

        {/* PREVIEW */}
        <div className="bg-gray-100 p-5 rounded mb-6">
          {settings.position === "above" && showCOD && (
            <CODPreview settings={settings} />
          )}

          {showAdd && (
            <button className="w-full border p-3 mb-2">Add to cart</button>
          )}

          {settings.position === "below" && showCOD && (
            <CODPreview settings={settings} />
          )}

          {showBuy && (
            <button className="w-full bg-black text-white p-3 mb-2">
              Buy it now
            </button>
          )}

          {settings.position === "below_buy_now" && showCOD && (
            <CODPreview settings={settings} />
          )}
        </div>

        {/* PIXELS */}
        <h2 className="font-semibold mb-2">Pixels</h2>

        {pixels.map((p, i) => (
          <div key={i} className="border p-3 mb-2">
            <input
              placeholder="Pixel ID"
              value={p.pixelId}
              onChange={(e) => updatePixel(i, "pixelId", e.target.value)}
            />
            <button onClick={() => removePixel(i)}>X</button>
          </div>
        ))}

        <button onClick={addPixel}>Add Pixel</button>
        <button onClick={savePixels}>Save Pixels</button>

        <button onClick={save} className="w-full bg-black text-white p-4 mt-6">
          Save Settings
        </button>
      </div>
    </div>
  );
}
