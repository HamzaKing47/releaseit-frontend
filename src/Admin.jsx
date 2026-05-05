import { useEffect, useState } from "react";
import Sidebar from "./components/Sidebar";
import CodSettings from "./components/CodSettings";
import PixelSettings from "./components/PixelSettings";
import CodBuilder from "./components/cod/CodBuilder";

export default function Admin() {
  const shop = new URLSearchParams(window.location.search).get("shop");

  const [active, setActive] = useState("cod");

  const [settings, setSettings] = useState({
    mode: "both",
    buttonText: "Buy with Cash on Delivery",
    bgColor: "#000000",
    textColor: "#ffffff",
    borderRadius: 6,
  });

  const [pixels, setPixels] = useState([]);
  const [formSchema, setFormSchema] = useState([]);

  const update = (k, v) => setSettings((p) => ({ ...p, [k]: v }));

  /* ================= LOAD ================= */
  useEffect(() => {
    if (!shop) return;

    fetch(`https://releaseit-backend.onrender.com/api/settings?shop=${shop}`)
      .then((r) => r.json())
      .then((d) => {
        if (d.success) {
          setSettings(d);
          setFormSchema(d.formSchema || []);
        }
      });

    fetch(`https://releaseit-backend.onrender.com/api/pixels?shop=${shop}`)
      .then((r) => r.json())
      .then((d) => d.success && setPixels(d.pixels));
  }, [shop]);

  /* ================= SAVE SETTINGS ================= */
  const saveSettings = async () => {
    await fetch(
      `https://releaseit-backend.onrender.com/api/settings?shop=${shop}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...settings, formSchema }),
      }
    );
    alert("Settings Saved ✅");
  };

  /* ================= SAVE PIXELS ================= */
  const savePixels = async () => {
    await fetch(`https://releaseit-backend.onrender.com/api/pixels`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ shop, pixels }),
    });
    alert("Pixels Saved ✅");
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar active={active} setActive={setActive} />

      <div className="flex-1 p-8 space-y-6">
        {/* COD SETTINGS */}
        {active === "cod" && (
          <>
            <CodSettings settings={settings} update={update} save={saveSettings} />
            <CodBuilder fields={formSchema} setFields={setFormSchema} />
          </>
        )}

        {/* PIXELS */}
        {active === "pixels" && (
          <PixelSettings
            pixels={pixels}
            // 🔥 FIX: newPixel object accept karta hai
            addPixel={(newPixel) =>
              setPixels([
                ...pixels,
                newPixel || { type: "facebook", pixelId: "", label: "" },
              ])
            }
            updatePixel={(i, k, v) => {
              const arr = [...pixels];
              arr[i][k] = v;
              setPixels(arr);
            }}
            removePixel={(i) => {
              const arr = [...pixels];
              arr.splice(i, 1);
              setPixels(arr);
            }}
            savePixels={savePixels}
          />
        )}
      </div>
    </div>
  );
}
