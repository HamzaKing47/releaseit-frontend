import { useEffect, useState } from "react";
import Sidebar from "./components/Sidebar";
import CodSettings from "./components/CodSettings";
import PixelSettings from "./components/PixelSettings";
import CodBuilder from "./components/cod/CodBuilder";
import ThankYouSettings from "./components/ThankYouSettings";

const BACKEND = "https://releaseit-backend.onrender.com";

export default function Admin() {
  const shop = new URLSearchParams(window.location.search).get("shop");
  const [active, setActive] = useState("cod");

  const [settings, setSettings] = useState({
    mode: "both",
    buttonText: "Buy with Cash on Delivery",
    bgColor: "#000000",
    textColor: "#ffffff",
    borderRadius: 6,
    position: "below",
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
    fetch(`${BACKEND}/api/settings?shop=${shop}`)
      .then((r) => r.json())
      .then((d) => {
        if (d.success) {
          setSettings((prev) => ({ ...prev, ...d }));
          setFormSchema(d.formSchema || []);
        }
      });
    fetch(`${BACKEND}/api/pixels?shop=${shop}`)
      .then((r) => r.json())
      .then((d) => d.success && setPixels(d.pixels));
  }, [shop]);

  const saveSettings = async () => {
    const res = await fetch(`${BACKEND}/api/settings?shop=${shop}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...settings, formSchema }),
    });
    return res.json();
  };

  const savePixels = async () => {
    await fetch(`${BACKEND}/api/pixels`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ shop, pixels }),
    });
  };

  if (!shop) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-red-500 font-semibold">
          ❌ Shop not found. Please reinstall the app.
        </p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar active={active} setActive={setActive} />

      <div className="flex-1 p-8 overflow-y-auto">
        {/* COD BUTTON */}
        {active === "cod" && (
          <CodSettings
            settings={settings}
            update={update}
            save={saveSettings}
          />
        )}

        {/* FORM BUILDER — now its OWN tab */}
        {active === "form" && (
          <CodBuilder
            fields={formSchema}
            setFields={setFormSchema}
            save={saveSettings}
          />
        )}

        {/* PIXELS */}
        {active === "pixels" && (
          <PixelSettings
            pixels={pixels}
            addPixel={(p) =>
              setPixels([
                ...pixels,
                p || { type: "facebook", pixelId: "", label: "" },
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

        {/* THANK YOU PAGE */}
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
