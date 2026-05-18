import { useEffect, useState } from "react";
import Sidebar from "./components/Sidebar";
import CodSettings from "./components/CodSettings";
import PixelSettings from "./components/PixelSettings";
import CodBuilder from "./components/cod/CodBuilder";
import ThankYouSettings from "./components/ThankYouSettings";
import WhatsappSettings from "./components/WhatsappSettings";
import PricingPlans from "./components/PricingPlans";
import { BACKEND } from "./backend.js";

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
  const [waSummary, setWaSummary] = useState({ plan: "free", usage: null });

  // If we just came back from a Shopify billing flow, jump to the
  // Pricing tab so the merchant sees the success/error banner.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.has("upgraded") || params.has("billing_error")) {
      setActive("pricing");
    }
  }, []);

  // Fetch the current WhatsApp plan + usage (drives the Pricing page)
  useEffect(() => {
    if (!shop) return;
    fetch(`${BACKEND}/api/whatsapp/settings?shop=${shop}`)
      .then((r) => r.json())
      .then((d) => {
        if (d.success)
          setWaSummary({ plan: d.usage?.plan || "free", usage: d.usage });
      })
      .catch(() => {});
  }, [shop, active]);

  const update = (k, v) => setSettings((p) => ({ ...p, [k]: v }));

  useEffect(() => {
    if (!shop) return;
    fetch(`${BACKEND}/api/settings?shop=${shop}`)
      .then((r) => r.json())
      .then((d) => {
        if (d.success) {
          setSettings((p) => ({ ...p, ...d }));
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

  const activeLabel =
    {
      cod: "COD Button",
      form: "Form Builder",
      pixels: "Pixels",
      whatsapp: "WhatsApp Automation",
      thankyou: "Thank You Page",
      pricing: "Pricing & Plans",
    }[active] || "Dashboard";

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      <Sidebar active={active} setActive={setActive} shop={shop} />

      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar — sticky inside main column */}
        <header className="flex-shrink-0 h-14 bg-white border-b border-gray-100 flex items-center justify-between px-6 sm:px-8">
          <h1 className="text-[15px] font-bold text-gray-900">{activeLabel}</h1>
          <div className="flex items-center gap-2 text-[11px] text-gray-400">
            <span className="hidden sm:inline">Store:</span>
            <code className="text-[11px] bg-gray-50 border border-gray-100 px-2 py-1 rounded-md text-gray-600 max-w-[260px] truncate">
              {shop}
            </code>
          </div>
        </header>

        {/* Scrollable content area */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8">
          {active === "cod" && (
            <CodSettings
              settings={settings}
              update={update}
              save={saveSettings}
            />
          )}
          {active === "form" && (
            <CodBuilder
              fields={formSchema}
              setFields={setFormSchema}
              save={saveSettings}
            />
          )}
          {active === "pixels" && (
            <PixelSettings
              pixels={pixels}
              addPixel={(p) =>
                setPixels([
                  ...pixels,
                  p || {
                    type: "facebook",
                    pixelId: "",
                    label: "",
                    accessToken: "",
                  },
                ])
              }
              updatePixel={(i, k, v) => {
                const a = [...pixels];
                a[i][k] = v;
                setPixels(a);
              }}
              removePixel={(i) => {
                const a = [...pixels];
                a.splice(i, 1);
                setPixels(a);
              }}
              savePixels={savePixels}
            />
          )}
          {active === "whatsapp" && <WhatsappSettings shop={shop} />}
          {active === "thankyou" && (
            <ThankYouSettings
              settings={settings}
              update={update}
              save={saveSettings}
            />
          )}
          {active === "pricing" && (
            <PricingPlans
              shop={shop}
              currentPlan={waSummary.plan}
              usage={waSummary.usage}
            />
          )}
        </div>
      </main>
    </div>
  );
}
