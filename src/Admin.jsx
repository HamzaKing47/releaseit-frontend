import { useEffect, useState } from "react";
import { useSearchParams, useParams, useNavigate } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Dashboard from "./components/Dashboard";
import CodSettings from "./components/CodSettings";
import PixelSettings from "./components/PixelSettings";
import CodBuilder from "./components/cod/CodBuilder";
import ThankYouSettings from "./components/ThankYouSettings";
import WhatsappSettings from "./components/WhatsappSettings";
import PricingPlans from "./components/PricingPlans";
import FraudPrevention from "./components/FraudPrevention";
import ContactUs from "./components/ContactUs";
import SalesBooster from "./components/SalesBooster";
import { BACKEND } from "./backend.js";

// Nav items — single source of truth for both the custom sidebar
// (standalone) and the App Bridge nav menu (embedded in Shopify).
const NAV = [
  { key: "dashboard", label: "Dashboard" },
  { key: "cod", label: "COD Button" },
  { key: "form", label: "Form Builder" },
  { key: "pixels", label: "Pixels" },
  { key: "whatsapp", label: "WhatsApp" },
  { key: "booster", label: "Sales Booster" },
  { key: "fraud", label: "Fraud Prevention" },
  { key: "thankyou", label: "Thank You Page" },
  { key: "pricing", label: "Pricing & Plans" },
  { key: "contact", label: "Contact Support" },
];

export default function Admin() {
  const [searchParams] = useSearchParams();
  const { tab } = useParams();
  const navigate = useNavigate();

  // Resolve shop from the URL, falling back to sessionStorage so that
  // App Bridge navigation (which may reshape the URL) never loses it.
  let shop = searchParams.get("shop");
  if (typeof window !== "undefined") {
    if (shop) sessionStorage.setItem("releaseit_shop", shop);
    else shop = sessionStorage.getItem("releaseit_shop");
  }

  // Active section comes from the PATH (/admin/<tab>) so App Bridge can
  // highlight the matching nav item. Defaults to the Dashboard (home).
  const active = tab || "dashboard";

  // Embedded = running inside Shopify admin's iframe. When embedded,
  // Shopify provides the chrome (top bar + sidebar via App Bridge), so we
  // hide our own. Standalone keeps the custom sidebar.
  const isEmbedded =
    typeof window !== "undefined" && window.top !== window.self;

  const setActive = (t) =>
    navigate(`/admin/${t}?shop=${shop || ""}`, { replace: true });

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

  // On first load: handle billing return, otherwise normalize the URL to
  // /admin/cod so App Bridge highlights the correct nav item.
  useEffect(() => {
    const search = window.location.search;
    const params = new URLSearchParams(search);
    if (params.has("upgraded") || params.has("billing_error")) {
      // Keep the query (shop + upgraded) so the Pricing banner still shows.
      navigate(`/admin/pricing${search}`, { replace: true });
    } else if (!tab) {
      navigate(`/admin/dashboard?shop=${shop || ""}`, { replace: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 🔑 Token Exchange — when embedded, grab a session token from App Bridge
  // and exchange it for a fresh (expiring) offline token on the backend.
  // This keeps the stored Admin-API token valid for all operations.
  useEffect(() => {
    if (!shop) return;
    const w = typeof window !== "undefined" ? window : null;
    if (w?.shopify?.idToken) {
      w.shopify
        .idToken()
        .then((sessionToken) =>
          fetch(`${BACKEND}/api/auth/token-exchange`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ shop, sessionToken }),
          }),
        )
        .then(() => console.log("[Auth] token refreshed"))
        .catch((e) => console.warn("[Auth] token exchange:", e.message));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shop]);

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
    (NAV.find((n) => n.key === active)?.label) || "Dashboard";

  // App Bridge nav — renders in Shopify's own sidebar when embedded.
  // Harmless (invisible) when running standalone.
  const navMenu = (
    <ui-nav-menu>
      {/* First link (rel="home") is the app's home — App Bridge requires it. */}
      <a href={`/admin/dashboard?shop=${shop}`} rel="home">
        Dashboard
      </a>
      {NAV.filter((n) => n.key !== "dashboard").map((n) => (
        <a key={n.key} href={`/admin/${n.key}?shop=${shop}`}>
          {n.label}
        </a>
      ))}
    </ui-nav-menu>
  );

  // Content (shared by both layouts)
  const content = (
    <div
      className={
        isEmbedded ? "p-4 sm:p-6 max-w-5xl mx-auto" : "flex-1 overflow-y-auto p-6 sm:p-8"
      }
    >
      {renderSection()}
    </div>
  );

  function renderSection() {
    return (
      <>
        {active === "dashboard" && (
            <Dashboard
              shop={shop}
              usage={waSummary.usage}
              currentPlan={waSummary.plan}
              setActive={setActive}
            />
          )}
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
          {active === "booster" && <SalesBooster shop={shop} />}
          {active === "fraud" && <FraudPrevention shop={shop} />}
          {active === "pricing" && (
            <PricingPlans
              shop={shop}
              currentPlan={waSummary.plan}
              usage={waSummary.usage}
            />
          )}
          {active === "contact" && <ContactUs shop={shop} />}
      </>
    );
  }

  // ── EMBEDDED: Shopify provides the sidebar (via App Bridge) + top chrome.
  // We render only the content, plus the <ui-nav-menu> for Shopify's sidebar.
  if (isEmbedded) {
    return (
      <div className="min-h-screen bg-gray-50">
        {navMenu}
        {content}
      </div>
    );
  }

  // ── STANDALONE: our own sidebar + top bar (no App Bridge nav menu).
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

        {content}
      </main>
    </div>
  );
}
