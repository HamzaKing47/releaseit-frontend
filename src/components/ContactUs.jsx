import { useState } from "react";
import { BACKEND } from "../backend.js";

export default function ContactUs({ shop }) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null); // { ok, text }

  const upd = (k, v) => setForm((p) => ({ ...p, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setResult(null);
    setLoading(true);
    try {
      const r = await fetch(`${BACKEND}/api/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ shop, ...form }),
      });
      const d = await r.json();
      if (d.success) {
        setResult({ ok: true, text: d.message });
        setForm({ name: "", email: "", subject: "", message: "" });
      } else {
        setResult({ ok: false, text: d.message || "Something went wrong." });
      }
    } catch {
      setResult({ ok: false, text: "Network error. Please try again." });
    }
    setLoading(false);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* CONTACT FORM */}
      <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-7">
        <div className="mb-6">
          <h2 className="text-[18px] font-extrabold text-gray-900 mb-1">
            💬 Contact Support
          </h2>
          <p className="text-[13px] text-gray-400">
            Have a question or issue? Send us a message — we usually reply
            within 24 hours.
          </p>
        </div>

        {result && (
          <div
            className={`mb-5 rounded-xl px-4 py-3 text-[13px] font-semibold border ${
              result.ok
                ? "bg-green-50 border-green-200 text-green-700"
                : "bg-red-50 border-red-200 text-red-700"
            }`}
          >
            {result.ok ? "✅ " : "❌ "}
            {result.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Your Name">
              <input
                value={form.name}
                onChange={(e) => upd("name", e.target.value)}
                placeholder="Ahmed Khan"
                className={inputCls}
              />
            </Field>
            <Field label="Email" required>
              <input
                type="email"
                value={form.email}
                onChange={(e) => upd("email", e.target.value)}
                placeholder="you@store.com"
                required
                className={inputCls}
              />
            </Field>
          </div>

          <Field label="Subject">
            <input
              value={form.subject}
              onChange={(e) => upd("subject", e.target.value)}
              placeholder="e.g. WhatsApp not connecting"
              className={inputCls}
            />
          </Field>

          <Field label="Message" required>
            <textarea
              rows={6}
              value={form.message}
              onChange={(e) => upd("message", e.target.value)}
              placeholder="Describe your question or issue in detail..."
              required
              className={inputCls + " resize-y"}
            />
          </Field>

          <button
            type="submit"
            disabled={loading}
            className="bg-gray-900 hover:bg-gray-700 disabled:opacity-50 text-white font-bold px-7 py-3 rounded-xl text-[14px] transition"
          >
            {loading ? "Sending..." : "Send Message"}
          </button>
        </form>
      </div>

      {/* SUPPORT INFO */}
      <div className="space-y-4">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-[14px] font-bold text-gray-900 mb-4">
            Other ways to reach us
          </h3>
          <InfoRow icon="📧" label="Email" value="support@ordernowcodform.xyz" />
          <InfoRow icon="💬" label="WhatsApp" value="+92 300 1234567" />
          <InfoRow icon="⏱️" label="Response time" value="Within 24 hours" />
          <InfoRow icon="🕒" label="Hours" value="Mon–Sat, 9am–6pm PKT" />
        </div>

        <div className="bg-gradient-to-br from-gray-900 to-gray-700 rounded-2xl p-6 text-white">
          <h3 className="text-[14px] font-bold mb-1.5">📚 Quick Help</h3>
          <p className="text-[12px] text-white/70 leading-relaxed mb-3">
            Most questions are answered in our setup guide — covering COD
            button, WhatsApp connection, pixels, and fraud rules.
          </p>
          <a
            href="https://ordernowcodform.xyz"
            target="_blank"
            rel="noreferrer"
            className="inline-block text-[12px] font-bold bg-white/15 hover:bg-white/25 px-4 py-2 rounded-lg transition"
          >
            View Documentation →
          </a>
        </div>

        <div className="bg-green-50 border border-green-100 rounded-2xl p-5">
          <p className="text-[12px] font-bold text-green-800 mb-1">
            ⭐ Enjoying Order Now?
          </p>
          <p className="text-[11px] text-green-700 leading-relaxed">
            Leave a review on the Shopify App Store — it helps us a lot and
            keeps the app free for small stores.
          </p>
        </div>
      </div>
    </div>
  );
}

const inputCls =
  "w-full px-3 py-2.5 text-[14px] border border-gray-200 rounded-lg bg-gray-50 focus:bg-white focus:border-gray-900 focus:outline-none transition";

function Field({ label, required, children }) {
  return (
    <div>
      <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block mb-1.5">
        {label} {required && <span className="text-red-400">*</span>}
      </label>
      {children}
    </div>
  );
}

function InfoRow({ icon, label, value }) {
  return (
    <div className="flex items-center gap-3 py-2 border-b border-gray-50 last:border-0">
      <span className="text-[16px]">{icon}</span>
      <div>
        <p className="text-[10.5px] text-gray-400 uppercase tracking-wider font-semibold">
          {label}
        </p>
        <p className="text-[13px] text-gray-800 font-medium">{value}</p>
      </div>
    </div>
  );
}
