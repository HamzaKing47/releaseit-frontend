import { useEffect, useState } from "react";
import { BACKEND } from "../backend.js";

const PLANS = [
  {
    key: "free",
    name: "Free",
    price: 0,
    tag: "Get started",
    messages: 50,
    features: [
      "COD Button on product pages",
      "Custom Form Builder",
      "Browser-side Pixel tracking",
      "WhatsApp order confirmations",
      "Reply links (Confirm / Cancel / Address)",
      "Custom Thank-You page",
    ],
    ctaLabel: "Current Plan",
  },
  {
    key: "starter",
    name: "Starter",
    price: 9.99,
    tag: "Perfect for new stores",
    messages: 1000,
    features: [
      "Everything in Free",
      "1,000 WhatsApp messages / month",
      "Server-side conversion tracking",
      "Email support",
    ],
    ctaLabel: "Upgrade to Starter",
  },
  {
    key: "growth",
    name: "Growth",
    price: 19.99,
    tag: "For growing stores",
    popular: true,
    messages: 3000,
    features: [
      "Everything in Starter",
      "3,000 WhatsApp messages / month",
      "Priority email support",
      "Advanced form fields (dropdown, hidden, etc.)",
      "Multi-pixel server tracking (8 platforms)",
    ],
    ctaLabel: "Upgrade to Growth",
  },
  {
    key: "pro",
    name: "Pro",
    price: 34.99,
    tag: "For high-volume stores",
    messages: 7500,
    features: [
      "Everything in Growth",
      "7,500 WhatsApp messages / month",
      "Dedicated WhatsApp session",
      "Live chat support",
      "Custom message templates per trigger",
    ],
    ctaLabel: "Upgrade to Pro",
  },
];

const FAQ = [
  {
    q: "How does billing work?",
    a: "Charges go through Shopify's secure billing — you'll see them on your normal Shopify invoice. You can cancel or downgrade anytime; no contracts.",
  },
  {
    q: "What happens if I hit my message limit?",
    a: "Outbound order confirmations pause until your billing cycle resets, or you upgrade. Incoming customer replies are not affected.",
  },
  {
    q: "Why is there a daily cap too?",
    a: "To protect your WhatsApp number from getting flagged. WhatsApp can ban numbers that send too many messages in a short burst. The daily cap paces sends safely — extra messages just roll into the next day.",
  },
  {
    q: "What's the warm-up period?",
    a: "New WhatsApp numbers are fragile. For the first ~3 weeks, your daily cap is gradually increased — Week 1: 30/day, Week 2: 60/day, Week 3: 120/day. After that, your full plan cap applies.",
  },
  {
    q: "Can I switch plans?",
    a: "Yes — upgrade or downgrade anytime from this page. Prorated billing is handled by Shopify automatically.",
  },
];

export default function PricingPlans({ shop, currentPlan = "free", usage }) {
  const [loadingPlan, setLoadingPlan] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [testMode, setTestMode] = useState(false);

  // Find out if Shopify Billing is in test mode (no real money charged)
  useEffect(() => {
    fetch(`${BACKEND}/api/billing/plans`)
      .then((r) => r.json())
      .then((d) => d.success && setTestMode(!!d.testMode))
      .catch(() => {});
  }, []);

  // Show success banner if redirected back after an upgrade
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const upgraded = params.get("upgraded");
    if (upgraded) {
      const plan = PLANS.find((p) => p.key === upgraded);
      setSuccess(
        plan
          ? `✅ Upgraded to ${plan.name} plan — enjoy your new limits!`
          : "✅ Plan updated successfully",
      );
      // Clean the URL so the banner doesn't persist on refresh
      window.history.replaceState({}, "", window.location.pathname + `?shop=${shop}`);
      setTimeout(() => setSuccess(""), 6000);
    }
    const billingError = params.get("billing_error");
    if (billingError) {
      setError("❌ The charge was declined or cancelled.");
      window.history.replaceState({}, "", window.location.pathname + `?shop=${shop}`);
      setTimeout(() => setError(""), 6000);
    }
  }, [shop]);

  const handleSubscribe = async (planKey) => {
    if (planKey === currentPlan) return;
    setError("");
    setLoadingPlan(planKey);
    try {
      const r = await fetch(`${BACKEND}/api/billing/subscribe`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ shop, plan: planKey }),
      });
      const data = await r.json();
      if (!data.success || !data.confirmationUrl) {
        throw new Error(data.message || "Could not start upgrade");
      }
      // Send the merchant to Shopify's approval screen
      window.location.href = data.confirmationUrl;
    } catch (err) {
      setError(`❌ ${err.message}`);
      setLoadingPlan(null);
    }
  };

  const handleCancel = async () => {
    if (!confirm("Cancel your subscription and return to the Free plan?")) return;
    setLoadingPlan("cancel");
    try {
      const r = await fetch(`${BACKEND}/api/billing/cancel`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ shop }),
      });
      const data = await r.json();
      if (data.success) {
        setSuccess("✅ Subscription cancelled — you're back on the Free plan.");
        setTimeout(() => window.location.reload(), 1500);
      } else {
        throw new Error(data.message || "Cancel failed");
      }
    } catch (err) {
      setError(`❌ ${err.message}`);
    }
    setLoadingPlan(null);
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-7">
      {/* HEADER */}
      <div className="mb-5 flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h2 className="text-[20px] font-extrabold text-gray-900 mb-1">
            💎 Pricing & Plans
          </h2>
          <p className="text-[13px] text-gray-500">
            One app — COD checkout + WhatsApp automation. Replaces apps costing
            $45/month elsewhere.
          </p>
        </div>
        {/* Payment-gateway trust badge */}
        <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-full px-3 py-1.5">
          <span className="text-[14px]">🛒</span>
          <span className="text-[11px] font-semibold text-gray-700">
            Secure payments via Shopify Billing
          </span>
          {testMode && (
            <span className="text-[10px] font-bold uppercase tracking-wide bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">
              Test Mode
            </span>
          )}
        </div>
      </div>

      {/* SUCCESS / ERROR */}
      {success && (
        <div className="mb-5 bg-green-50 border border-green-200 rounded-xl px-4 py-3 text-[13px] font-semibold text-green-700">
          {success}
        </div>
      )}
      {error && (
        <div className="mb-5 bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-[13px] font-semibold text-red-700">
          {error}
        </div>
      )}

      {/* CURRENT PLAN STRIP */}
      {usage && (
        <div className="mb-6 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 flex items-center justify-between flex-wrap gap-3">
          <div>
            <p className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">
              Current Plan
            </p>
            <p className="text-[15px] font-bold text-gray-900 mt-0.5">
              {PLANS.find((p) => p.key === currentPlan)?.name || "Free"} ·{" "}
              <span className="text-gray-500 font-medium">
                {usage.sent?.toLocaleString() || 0} /{" "}
                {usage.limit?.toLocaleString() || 0} messages this cycle
              </span>
            </p>
          </div>
          {currentPlan !== "free" && (
            <button
              onClick={handleCancel}
              disabled={loadingPlan === "cancel"}
              className="text-[12px] font-bold text-red-500 hover:text-red-700 disabled:opacity-50"
            >
              {loadingPlan === "cancel" ? "Cancelling..." : "Cancel subscription"}
            </button>
          )}
        </div>
      )}

      {/* PLAN CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {PLANS.map((plan) => {
          const isCurrent = plan.key === currentPlan;
          const isPopular = plan.popular;
          const isLoading = loadingPlan === plan.key;

          return (
            <div
              key={plan.key}
              className={`relative rounded-2xl border p-5 flex flex-col transition ${
                isPopular
                  ? "border-gray-900 bg-gray-50 shadow-md"
                  : "border-gray-200 bg-white hover:border-gray-300"
              }`}
            >
              {isPopular && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[10px] font-extrabold uppercase tracking-wider px-3 py-1 rounded-full whitespace-nowrap shadow-md z-10 flex items-center gap-1">
                  ⭐ Most Popular
                </span>
              )}
              {isCurrent && (
                <span className="absolute -top-3 right-4 bg-green-500 text-white text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-full whitespace-nowrap shadow-sm z-10">
                  Active
                </span>
              )}

              <div className="mb-4">
                <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1">
                  {plan.tag}
                </p>
                <h3 className="text-[18px] font-extrabold text-gray-900">
                  {plan.name}
                </h3>
                <div className="mt-2 flex items-baseline gap-1">
                  <span className="text-[28px] font-extrabold text-gray-900">
                    ${plan.price}
                  </span>
                  <span className="text-[12px] text-gray-400 font-medium">
                    / month
                  </span>
                </div>
                <p className="text-[12px] text-gray-500 mt-1">
                  {plan.messages.toLocaleString()} WhatsApp messages / month
                </p>
              </div>

              <ul className="space-y-2 mb-5 flex-1">
                {plan.features.map((f) => (
                  <li
                    key={f}
                    className="text-[12px] text-gray-700 flex items-start gap-2"
                  >
                    <span className="text-green-500 mt-[2px] flex-shrink-0">
                      ✓
                    </span>
                    <span>{f}</span>
                  </li>
                ))}
              </ul>

              <button
                onClick={() => handleSubscribe(plan.key)}
                disabled={isCurrent || isLoading}
                className={`w-full py-2.5 rounded-xl text-[13px] font-bold transition ${
                  isCurrent
                    ? "bg-gray-100 text-gray-400 cursor-default"
                    : isPopular
                      ? "bg-gray-900 text-white hover:bg-gray-700"
                      : "bg-white border-2 border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white"
                } ${isLoading ? "opacity-60" : ""}`}
              >
                {isLoading
                  ? "Redirecting..."
                  : isCurrent
                    ? "Current Plan"
                    : plan.ctaLabel}
              </button>
            </div>
          );
        })}
      </div>

      {/* COMPARISON HINT */}
      <div className="mt-6 bg-blue-50 border border-blue-100 rounded-xl px-4 py-3 text-[12px] text-blue-700 flex items-start gap-2">
        <span className="font-bold">💡 Why it's a good deal:</span>
        <span>
          Other apps charge $9.99–$29.99 for COD checkout AND $4.99–$14.99
          separately for WhatsApp. ReleaseIt gives you both — starting at $9.99.
        </span>
      </div>

      {/* FAQ */}
      <div className="mt-8">
        <h3 className="text-[15px] font-extrabold text-gray-900 mb-4">
          Frequently asked
        </h3>
        <div className="space-y-3">
          {FAQ.map(({ q, a }) => (
            <details
              key={q}
              className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 group"
            >
              <summary className="cursor-pointer text-[13px] font-semibold text-gray-900 list-none flex items-center justify-between">
                {q}
                <span className="text-gray-400 group-open:rotate-180 transition-transform">
                  ▾
                </span>
              </summary>
              <p className="text-[12px] text-gray-600 mt-2 leading-relaxed">
                {a}
              </p>
            </details>
          ))}
        </div>
      </div>

      {/* TRUST FOOTER */}
      <div className="mt-6 text-center text-[11px] text-gray-400">
        🔒 All payments handled securely by Shopify · Cancel anytime
      </div>
    </div>
  );
}
