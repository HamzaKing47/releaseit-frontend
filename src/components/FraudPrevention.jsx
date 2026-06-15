import { useState, useEffect } from "react";
import { BACKEND } from "../backend.js";

const DEFAULT_FRAUD = {
  limitOrdersEnabled: false,
  limitOrdersCount: 3,
  limitOrdersHours: 24,
  blockHighQuantity: false,
  maxQuantity: 10,
  blockedEmails: [],
  blockedPhones: [],
  blockedIPs: [],
  allowedIPs: [],
  blockMessage:
    "We're unable to process your order at this time. Please contact support.",
  excludePostalCodesEnabled: false,
  excludedPostalCodes: [],
  allowOnlyPostalCodesEnabled: false,
  allowedPostalCodes: [],
};

// Arrays <-> textarea (newline separated)
const toText = (arr) => (Array.isArray(arr) ? arr.join("\n") : "");
const toArr = (text) =>
  (text || "")
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);

export default function FraudPrevention({ shop }) {
  const [fraud, setFraud] = useState(DEFAULT_FRAUD);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!shop) return;
    fetch(`${BACKEND}/api/settings?shop=${shop}`)
      .then((r) => r.json())
      .then((d) => {
        if (d.success && d.fraud) setFraud({ ...DEFAULT_FRAUD, ...d.fraud });
      })
      .catch(() => {});
  }, [shop]);

  const upd = (k, v) => setFraud((p) => ({ ...p, [k]: v }));

  const handleSave = async () => {
    setLoading(true);
    await fetch(`${BACKEND}/api/settings?shop=${shop}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fraud }),
    });
    setSaved(true);
    setLoading(false);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-7">
      {/* HEADER */}
      <div className="mb-6">
        <h2 className="text-[20px] font-extrabold text-gray-900 mb-1 flex items-center gap-2.5">
          <span className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-600 to-violet-600 text-white flex items-center justify-center text-[16px] shadow-sm">
            🛡️
          </span>
          Fraud Prevention
        </h2>
        <p className="text-[13px] text-gray-400">
          Block suspicious customers and reduce fake COD orders.
        </p>
      </div>

      <div className="border-t border-gray-100 mb-6" />

      {/* RATE LIMIT */}
      <ToggleCard
        title="Limit orders from the same customer"
        desc="Identify customers by IP, email, or phone number."
        on={fraud.limitOrdersEnabled}
        onChange={(v) => upd("limitOrdersEnabled", v)}
      >
        <div className="flex items-center gap-3 flex-wrap text-[13px] text-gray-600">
          Allow max
          <input
            type="number"
            min="1"
            value={fraud.limitOrdersCount}
            onChange={(e) => upd("limitOrdersCount", Number(e.target.value))}
            className="w-16 px-2 py-1.5 border border-gray-200 rounded-lg text-center bg-gray-50 focus:outline-none focus:border-gray-400"
          />
          orders in
          <input
            type="number"
            min="1"
            value={fraud.limitOrdersHours}
            onChange={(e) => upd("limitOrdersHours", Number(e.target.value))}
            className="w-16 px-2 py-1.5 border border-gray-200 rounded-lg text-center bg-gray-50 focus:outline-none focus:border-gray-400"
          />
          hours
        </div>
      </ToggleCard>

      {/* QUANTITY CAP */}
      <ToggleCard
        title="Block high-quantity orders"
        desc="Reject orders with too many items — a common fraud signal."
        on={fraud.blockHighQuantity}
        onChange={(v) => upd("blockHighQuantity", v)}
      >
        <div className="flex items-center gap-3 flex-wrap text-[13px] text-gray-600">
          Block orders with more than
          <input
            type="number"
            min="1"
            value={fraud.maxQuantity}
            onChange={(e) => upd("maxQuantity", Number(e.target.value))}
            className="w-16 px-2 py-1.5 border border-gray-200 rounded-lg text-center bg-gray-50 focus:outline-none focus:border-gray-400"
          />
          total items
        </div>
      </ToggleCard>

      {/* BLOCKLISTS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
        <ListField
          label="Emails to block"
          hint="One email per line"
          value={toText(fraud.blockedEmails)}
          onChange={(t) => upd("blockedEmails", toArr(t))}
          placeholder={"johnsmith@gmail.com\narianapiccola@outlook.com"}
        />
        <ListField
          label="Phone numbers to block"
          hint="Without country code, one per line"
          value={toText(fraud.blockedPhones)}
          onChange={(t) => upd("blockedPhones", toArr(t))}
          placeholder={"3001234567\n3219876543"}
        />
        <ListField
          label="IP addresses to block"
          hint="One IP per line"
          value={toText(fraud.blockedIPs)}
          onChange={(t) => upd("blockedIPs", toArr(t))}
          placeholder={"1.56.78.9\n86.95.222.1"}
        />
        <ListField
          label="IP addresses to always allow"
          hint="Whitelisted IPs bypass every block"
          value={toText(fraud.allowedIPs)}
          onChange={(t) => upd("allowedIPs", toArr(t))}
          placeholder={"35.7.23.11"}
        />
      </div>

      {/* BLOCK MESSAGE */}
      <div className="mt-6">
        <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block mb-2">
          Message shown when an order is blocked
        </label>
        <textarea
          rows={2}
          value={fraud.blockMessage}
          onChange={(e) => upd("blockMessage", e.target.value)}
          className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-[13px] bg-gray-50 focus:outline-none focus:border-gray-400 resize-y"
        />
      </div>

      {/* POSTAL CODES */}
      <div className="mt-7">
        <h3 className="text-[13px] font-bold text-gray-800 mb-3">
          📮 Postal Code Rules
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <ToggleRow
              label="Exclude postal codes"
              desc="Block orders from these postal codes"
              on={fraud.excludePostalCodesEnabled}
              onChange={(v) => upd("excludePostalCodesEnabled", v)}
            />
            {fraud.excludePostalCodesEnabled && (
              <textarea
                rows={3}
                value={toText(fraud.excludedPostalCodes)}
                onChange={(e) =>
                  upd("excludedPostalCodes", toArr(e.target.value))
                }
                placeholder={"54000\n75500"}
                className="w-full mt-2 px-3 py-2.5 border border-gray-200 rounded-lg text-[13px] bg-gray-50 focus:outline-none focus:border-gray-400 resize-y"
              />
            )}
          </div>
          <div>
            <ToggleRow
              label="Allow only specific postal codes"
              desc="Only accept orders from these postal codes"
              on={fraud.allowOnlyPostalCodesEnabled}
              onChange={(v) => upd("allowOnlyPostalCodesEnabled", v)}
            />
            {fraud.allowOnlyPostalCodesEnabled && (
              <textarea
                rows={3}
                value={toText(fraud.allowedPostalCodes)}
                onChange={(e) =>
                  upd("allowedPostalCodes", toArr(e.target.value))
                }
                placeholder={"54000\n44000"}
                className="w-full mt-2 px-3 py-2.5 border border-gray-200 rounded-lg text-[13px] bg-gray-50 focus:outline-none focus:border-gray-400 resize-y"
              />
            )}
          </div>
        </div>
      </div>

      {/* SAVE */}
      <div className="border-t border-gray-100 mt-7 pt-5 flex items-center gap-4">
        <button
          onClick={handleSave}
          disabled={loading}
          className={`px-7 py-3 rounded-xl text-[14px] font-bold text-white transition disabled:opacity-50 ${
            saved ? "bg-green-600" : "bg-gray-900 hover:bg-gray-700"
          }`}
        >
          {saved ? "✅ Saved!" : loading ? "Saving..." : "Save Fraud Settings"}
        </button>
        {saved && (
          <span className="text-[13px] text-green-600 font-semibold">
            Fraud rules saved!
          </span>
        )}
      </div>
    </div>
  );
}

function ToggleCard({ title, desc, on, onChange, children }) {
  return (
    <div className="border border-gray-200 rounded-xl p-4 mb-3">
      <ToggleRow label={title} desc={desc} on={on} onChange={onChange} />
      {on && <div className="mt-3 pl-1">{children}</div>}
    </div>
  );
}

function ListField({ label, hint, value, onChange, placeholder }) {
  return (
    <div>
      <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block mb-1">
        {label}
      </label>
      <p className="text-[11px] text-gray-400 mb-2">{hint}</p>
      <textarea
        rows={4}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-[13px] bg-gray-50 focus:outline-none focus:border-gray-400 resize-y font-mono"
      />
    </div>
  );
}

function ToggleRow({ label, desc, on, onChange }) {
  return (
    <div
      onClick={() => onChange(!on)}
      className="flex items-center justify-between cursor-pointer"
    >
      <div>
        <p className="font-semibold text-gray-900 text-[13px]">{label}</p>
        <p className="text-[11px] text-gray-400 mt-0.5">{desc}</p>
      </div>
      <div
        className={`rounded-full relative transition-colors flex-shrink-0 ml-3 w-10 h-[22px] ${
          on ? "bg-gray-900" : "bg-gray-300"
        }`}
      >
        <div
          className={`absolute top-[3px] rounded-full bg-white shadow transition-all w-4 h-4 ${
            on ? "left-[22px]" : "left-[3px]"
          }`}
        />
      </div>
    </div>
  );
}
