import { useState } from "react";
import { BACKEND } from "../backend.js";

/* Floating support widget — a fixed bottom-right launcher button that opens a
   compact "contact us" popup. Only an email + message is required (no phone).
   Posts to the same /api/contact endpoint the old page used. */
export default function SupportWidget({ shop }) {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null); // { ok, text }

  const submit = async (e) => {
    e.preventDefault();
    setResult(null);
    setLoading(true);
    try {
      const r = await fetch(`${BACKEND}/api/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ shop, email, message, subject: "Support request" }),
      });
      const d = await r.json();
      if (d.success) {
        setResult({ ok: true, text: d.message || "Sent! We'll reply by email soon." });
        setEmail("");
        setMessage("");
      } else {
        setResult({ ok: false, text: d.message || "Something went wrong." });
      }
    } catch {
      setResult({ ok: false, text: "Network error. Please try again." });
    }
    setLoading(false);
  };

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end">
      {/* POPUP */}
      {open && (
        <div className="mb-3 w-[340px] max-w-[calc(100vw-2.5rem)] bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden">
          {/* header */}
          <div className="bg-gradient-to-r from-indigo-600 to-violet-600 px-5 py-4 text-white">
            <h3 className="text-[15px] font-extrabold">💬 Contact Support</h3>
            <p className="text-[12px] text-indigo-100 mt-0.5">
              Send us a message — we’ll reply by email.
            </p>
          </div>

          <form onSubmit={submit} className="p-5 space-y-3">
            {result && (
              <div
                className={`rounded-lg px-3 py-2 text-[12px] font-semibold border ${
                  result.ok
                    ? "bg-green-50 border-green-200 text-green-700"
                    : "bg-red-50 border-red-200 text-red-700"
                }`}
              >
                {result.ok ? "✅ " : "❌ "}
                {result.text}
              </div>
            )}

            <div>
              <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block mb-1">
                Email <span className="text-red-400">*</span>
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@store.com"
                className="w-full px-3 py-2.5 text-[14px] border border-gray-200 rounded-lg bg-gray-50 focus:bg-white focus:border-indigo-500 focus:outline-none transition"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block mb-1">
                Message <span className="text-red-400">*</span>
              </label>
              <textarea
                rows={4}
                required
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="How can we help?"
                className="w-full px-3 py-2.5 text-[14px] border border-gray-200 rounded-lg bg-gray-50 focus:bg-white focus:border-indigo-500 focus:outline-none transition resize-y"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gray-900 hover:bg-gray-700 disabled:opacity-50 text-white font-bold py-2.5 rounded-xl text-[14px] transition"
            >
              {loading ? "Sending..." : "Send Message"}
            </button>
          </form>
        </div>
      )}

      {/* LAUNCHER BUTTON */}
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label="Contact support"
        className="w-14 h-14 rounded-full bg-gradient-to-br from-indigo-600 to-violet-600 text-white shadow-lg hover:shadow-xl flex items-center justify-center transition hover:scale-105"
      >
        <span className="text-[24px] leading-none">{open ? "✕" : "💬"}</span>
      </button>
    </div>
  );
}
