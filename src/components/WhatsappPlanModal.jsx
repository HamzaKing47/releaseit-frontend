import { useEffect, useState } from "react";
import { BACKEND } from "../backend.js";

/* WhatsApp pricing modal — shown on the WhatsApp page while the merchant is on
   the FREE WhatsApp plan. They can buy a WhatsApp add-on or continue on Free.
   COD pricing is completely separate (the main Pricing page). */
export default function WhatsappPlanModal({ shop, onClose, onBought }) {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(null);

  useEffect(() => {
    fetch(`${BACKEND}/api/billing/plans`)
      .then((r) => r.json())
      .then((d) => d.success && setPlans(d.whatsappPlans || []))
      .catch(() => {});
  }, []);

  const buy = async (planKey) => {
    setLoading(planKey);
    try {
      const r = await fetch(`${BACKEND}/api/billing/subscribe`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ shop, plan: planKey, track: "whatsapp" }),
      });
      const d = await r.json();
      if (d.success && d.confirmationUrl) {
        window.location.href = d.confirmationUrl;
      } else {
        setLoading(null);
      }
    } catch {
      setLoading(null);
    }
  };

  const paid = plans.filter((p) => p.key !== "free");

  return (
    <div className="fixed inset-0 z-[60] bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* header (fixed) */}
        <div className="shrink-0 bg-gradient-to-r from-indigo-600 to-violet-600 px-6 py-5 text-white flex items-start justify-between gap-4">
          <div>
            <h2 className="text-[18px] font-extrabold">
              💬 WhatsApp Automation Plans
            </h2>
            <p className="text-[12px] text-indigo-100 mt-1">
              Pick a plan to send automated order confirmations. Your COD plan is
              separate — this only covers WhatsApp.
            </p>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="text-white/80 hover:text-white text-[20px] leading-none shrink-0"
          >
            ✕
          </button>
        </div>

        <div className="p-6 overflow-y-auto">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {paid.map((p, i) => {
              const popular = i === 1; // middle (Growth) = popular
              return (
                <div
                  key={p.key}
                  className={`relative border-2 rounded-2xl p-5 flex flex-col transition ${
                    popular
                      ? "border-indigo-500 bg-indigo-50/50"
                      : "border-gray-200 hover:border-indigo-300"
                  }`}
                >
                  {popular && (
                    <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-indigo-600 text-white text-[9px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full">
                      Popular
                    </span>
                  )}
                  <h3 className="text-[15px] font-extrabold text-gray-900">
                    {p.name.replace("WhatsApp ", "")}
                  </h3>
                  <div className="mt-1 flex items-baseline gap-1">
                    <span className="text-[24px] font-extrabold text-gray-900">
                      ${p.price}
                    </span>
                    <span className="text-[12px] text-gray-400">/mo</span>
                  </div>
                  <p className="text-[12px] text-gray-500 mt-1 mb-4">
                    {p.messageLimit.toLocaleString()} messages / month
                  </p>
                  <button
                    onClick={() => buy(p.key)}
                    disabled={loading === p.key}
                    className={`mt-auto w-full py-2.5 rounded-xl text-[13px] font-bold transition disabled:opacity-60 ${
                      popular
                        ? "bg-indigo-600 hover:bg-indigo-700 text-white"
                        : "bg-gray-900 hover:bg-gray-700 text-white"
                    }`}
                  >
                    {loading === p.key
                      ? "..."
                      : `Choose ${p.name.replace("WhatsApp ", "")}`}
                  </button>
                </div>
              );
            })}
          </div>

          <button
            onClick={onClose}
            className="mt-5 w-full py-2.5 rounded-xl border-2 border-gray-200 text-gray-700 text-[13px] font-bold hover:bg-gray-50 transition"
          >
            Continue with Free — 50 messages / month
          </button>
          <p className="text-center text-[11px] text-gray-400 mt-2">
            Billed securely through Shopify · cancel anytime
          </p>
        </div>
      </div>
    </div>
  );
}
