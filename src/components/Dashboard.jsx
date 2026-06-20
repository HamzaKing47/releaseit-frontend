import { useEffect, useState } from "react";
import { BACKEND } from "../backend.js";

/* We deep-link the merchant straight to the Theme Editor's App embeds panel.
   Shopify does NOT allow apps to toggle an app embed programmatically, so the
   merchant flips "Order Now COD Button" on there (one click). We open the
   panel directly (no activateAppId) so it works reliably across stores. */
function storeHandle(shop) {
  return (shop || "").replace(".myshopify.com", "");
}

function Bar({ used, limit, color }) {
  const unlimited = limit == null || !isFinite(limit);
  const pct = unlimited ? 4 : Math.min(100, Math.round((used / limit) * 100));
  return (
    <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
      <div
        className={`h-full rounded-full ${color}`}
        style={{ width: `${unlimited ? 100 : pct}%`, opacity: unlimited ? 0.4 : 1 }}
      />
    </div>
  );
}

export default function Dashboard({ shop, usage, currentPlan = "free", setActive }) {
  const [embedUrl, setEmbedUrl] = useState("#");

  useEffect(() => {
    const h = storeHandle(shop);
    // Open the Theme Editor's App embeds panel; merchant toggles our embed on.
    setEmbedUrl(
      `https://admin.shopify.com/store/${h}/themes/current/editor?context=apps`,
    );
  }, [shop]);

  const planName = { free: "Free", starter: "Starter", growth: "Growth", pro: "Pro" }[
    currentPlan
  ] || "Free";

  const ordersUsed = usage?.ordersUsed ?? 0;
  const orderLimit = usage?.orderLimit; // may be null/Infinity for Pro
  const msgUsed = usage?.sent ?? 0;
  const msgLimit = usage?.limit ?? 0;
  const orderUnlimited = orderLimit == null || !isFinite(orderLimit);

  const quick = [
    { key: "form", icon: "🧱", title: "Form Builder", desc: "Customize your COD form fields" },
    { key: "whatsapp", icon: "💬", title: "WhatsApp", desc: "Auto order confirmations & replies" },
    { key: "booster", icon: "🚀", title: "Sales Booster", desc: "Upsells & quantity offers" },
    { key: "pixels", icon: "🎯", title: "Pixels", desc: "Server-side conversion tracking" },
    { key: "fraud", icon: "🛡️", title: "Fraud Prevention", desc: "Block fake COD orders" },
    { key: "pricing", icon: "💎", title: "Pricing & Plans", desc: "View limits & upgrade" },
  ];

  return (
    <div className="space-y-6">
      {/* WELCOME */}
      <div className="bg-gradient-to-br from-indigo-600 to-violet-600 rounded-2xl p-6 text-white shadow-sm">
        <h2 className="text-[22px] font-extrabold">👋 Welcome to Order Now</h2>
        <p className="text-[13px] text-indigo-100 mt-1 max-w-2xl">
          Your one-page COD checkout + WhatsApp automation. Get set up in two steps below.
        </p>
      </div>

      {/* STEP 1 — ENABLE EMBED */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex items-start justify-between gap-4 flex-wrap">
        <div className="flex items-start gap-3">
          <span className="text-[22px]">1️⃣</span>
          <div>
            <h3 className="text-[15px] font-bold text-gray-900">
              Enable the COD button on your store
            </h3>
            <p className="text-[13px] text-gray-500 mt-1 max-w-xl">
              This opens your theme’s <b>App embeds</b> — toggle on{" "}
              <b>“Order Now COD Button”</b> and click Save. That shows the “Buy
              with Cash on Delivery” button on your product pages. (Shopify
              requires this one-click step; apps can’t do it for you.)
            </p>
          </div>
        </div>
        <a
          href={embedUrl}
          target="_top"
          rel="noopener noreferrer"
          className="shrink-0 bg-gray-900 text-white text-[13px] font-bold px-5 py-2.5 rounded-xl hover:bg-gray-700 transition"
        >
          Enable on my store →
        </a>
      </div>

      {/* PLAN / USAGE */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-[15px] font-bold text-gray-900">
            Plans &amp; usage
          </h3>
          <span className="text-[12px] text-gray-400">
            COD: <span className="font-semibold text-indigo-600">{planName}</span>
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {/* Orders */}
          <div>
            <div className="flex items-center justify-between text-[12px] mb-1.5">
              <span className="font-semibold text-gray-700">COD orders this month</span>
              <span className="text-gray-500">
                {ordersUsed.toLocaleString()} /{" "}
                {orderUnlimited ? "∞" : orderLimit.toLocaleString()}
              </span>
            </div>
            <Bar used={ordersUsed} limit={orderLimit} color="bg-indigo-500" />
            {!orderUnlimited && ordersUsed >= orderLimit && (
              <p className="text-[11px] text-red-500 font-semibold mt-1.5">
                Limit reached — new orders are paused until you upgrade.
              </p>
            )}
            <button
              onClick={() => setActive?.("pricing")}
              className="text-[11px] font-bold text-indigo-600 hover:text-indigo-800 mt-2"
            >
              {orderUnlimited ? "Manage COD plan →" : "Upgrade COD plan →"}
            </button>
          </div>

          {/* Messages */}
          <div>
            <div className="flex items-center justify-between text-[12px] mb-1.5">
              <span className="font-semibold text-gray-700">WhatsApp messages</span>
              <span className="text-gray-500">
                {msgUsed.toLocaleString()} / {msgLimit.toLocaleString()}
              </span>
            </div>
            <Bar used={msgUsed} limit={msgLimit} color="bg-emerald-500" />
            <button
              onClick={() => setActive?.("whatsapp")}
              className="text-[11px] font-bold text-emerald-600 hover:text-emerald-800 mt-2"
            >
              Upgrade WhatsApp →
            </button>
          </div>
        </div>
      </div>

      {/* QUICK LINKS */}
      <div>
        <h3 className="text-[13px] font-bold text-gray-500 uppercase tracking-wider mb-3">
          Set up your app
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {quick.map((q) => (
            <button
              key={q.key}
              onClick={() => setActive?.(q.key)}
              className="text-left bg-white rounded-2xl border border-gray-100 shadow-sm p-5 hover:border-indigo-300 hover:shadow transition"
            >
              <div className="text-[22px] mb-2">{q.icon}</div>
              <h4 className="text-[14px] font-bold text-gray-900">{q.title}</h4>
              <p className="text-[12px] text-gray-500 mt-0.5">{q.desc}</p>
            </button>
          ))}
        </div>
      </div>

      {/* SUPPORT FOOTER */}
      <div className="text-center text-[12px] text-gray-400">
        Need help? Tap the 💬 button at the bottom-right to message us.
      </div>
    </div>
  );
}
