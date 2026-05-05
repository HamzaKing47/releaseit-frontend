import { useEffect, useState } from "react";
import Sidebar from "./components/Sidebar";
import CodSettings from "./components/CodSettings";
import PixelSettings from "./components/PixelSettings";
import CodBuilder from "./components/cod/CodBuilder";
import ThankYouSettings from "./components/ThankYouSettings";

export default function Admin() {
  const shop = new URLSearchParams(window.location.search).get("shop");
  const [active, setActive] = useState("cod");

  const [settings, setSettings] = useState({
    mode: "both",
    buttonText: "Buy with Cash on Delivery",
    bgColor: "#000000",
    textColor: "#ffffff",
    borderRadius: 6,
    thankYou: {
      heading: "Order Confirmed!",
      subtext: "Thank you! Your order has been placed successfully.",
      note: "Our team will contact you soon to confirm your order.",
      buttonText: "Back to Store",
      bgColor: "#f3f4f6",
      cardColor: "#ffffff",
      headingColor: "#16a34a",
      textColor: "#374151",
    },
  });

  const [pixels, setPixels] = useState([]);
  const [formSchema, setFormSchema] = useState([]);

  const update = (k, v) => setSettings((p) => ({ ...p, [k]: v }));

  useEffect(() => {
    if (!shop) return;

    fetch(`https://releaseit-backend.onrender.com/api/settings?shop=${shop}`)
      .then((r) => r.json())
      .then((d) => {
        if (d.success) {
          setSettings((prev) => ({ ...prev, ...d }));
          setFormSchema(d.formSchema || []);
        }
      });

    fetch(`https://releaseit-backend.onrender.com/api/pixels?shop=${shop}`)
      .then((r) => r.json())
      .then((d) => d.success && setPixels(d.pixels));
  }, [shop]);

  const saveSettings = async () => {
    const res = await fetch(
      `https://releaseit-backend.onrender.com/api/settings?shop=${shop}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...settings, formSchema }),
      }
    );
    return res.json();
  };

  const savePixels = async () => {
    await fetch(`https://releaseit-backend.onrender.com/api/pixels`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ shop, pixels }),
    });
  };

  if (!shop) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <p style={{ color: "#ef4444", fontWeight: 600 }}>❌ Shop not found.</p>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#f9fafb" }}>
      <Sidebar active={active} setActive={setActive} />

      <div style={{ flex: 1, padding: "32px", overflowY: "auto" }}>
        {active === "cod" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
            <CodSettings settings={settings} update={update} save={saveSettings} />
            <CodBuilder fields={formSchema} setFields={setFormSchema} />
          </div>
        )}

        {active === "pixels" && (
          <PixelSettings
            pixels={pixels}
            addPixel={(newPixel) =>
              setPixels([...pixels, newPixel || { type: "facebook", pixelId: "", label: "" }])
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

        {active === "thankyou" && (
          <ThankYouSettings
            settings={settings}
            update={update}
            save={saveSettings}
          />
        )}
      </div>
    </div>
  );
}
