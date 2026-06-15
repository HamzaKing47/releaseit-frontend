import { useState } from "react";

const DEFAULTS = {
  heading: "Order Confirmed!",
  subtext: "Thank you! Your order has been placed successfully.",
  note: "Our team will contact you soon to confirm your order.",
  buttonText: "Back to Store",
  bgColor: "#f3f4f6",
  cardColor: "#ffffff",
  headingColor: "#16a34a",
  textColor: "#374151",
};

const LABEL_CLS =
  "block text-[11px] font-bold text-gray-500 uppercase tracking-[0.05em] mb-1.5";

export default function ThankYouSettings({ settings, update, save }) {
  const [saved, setSaved] = useState(false);

  const ty = settings.thankYou || DEFAULTS;
  const updateTY = (key, val) => update("thankYou", { ...ty, [key]: val });

  const handleSave = async () => {
    await save();
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-7">
      {/* HEADER */}
      <div className="mb-[22px]">
        <h2 className="text-[20px] font-extrabold text-gray-900 mb-1 flex items-center gap-2.5">
          <span className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-600 to-violet-600 text-white flex items-center justify-center text-[16px] shadow-sm">
            🎉
          </span>
          Thank You Page
        </h2>
        <p className="text-[13px] text-gray-400">
          Customize the message shown to customers after order is placed. Any
          language works.
        </p>
      </div>

      {/* ENABLE TOGGLE — custom page vs Shopify's official order-status page */}
      <div className="mb-[22px] flex items-start justify-between gap-4 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3.5">
        <div>
          <p className="text-[14px] font-bold text-gray-900">
            Use custom Thank-You page
          </p>
          <p className="text-[12px] text-gray-500 mt-0.5">
            {settings.thankYouEnabled
              ? "On — customers see your custom page below after a COD order."
              : "Off — customers see Shopify’s default order-status page."}
          </p>
        </div>
        <button
          type="button"
          onClick={() => update("thankYouEnabled", !settings.thankYouEnabled)}
          aria-pressed={!!settings.thankYouEnabled}
          className={`shrink-0 w-12 h-7 rounded-full transition relative ${
            settings.thankYouEnabled ? "bg-indigo-600" : "bg-gray-300"
          }`}
        >
          <span
            className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full shadow transition-transform ${
              settings.thankYouEnabled ? "translate-x-5" : ""
            }`}
          />
        </button>
      </div>

      <div className="border-t border-gray-100 mb-[22px]" />

      {/* TWO COLUMN */}
      <div className="grid grid-cols-2 gap-8">
        {/* LEFT — FIELDS */}
        <div className="flex flex-col gap-4">
          <Field
            label="Heading"
            value={ty.heading ?? DEFAULTS.heading}
            placeholder="e.g. Order Confirmed!"
            onChange={(v) => updateTY("heading", v)}
          />

          <Field
            label="Sub Text"
            multiline
            value={ty.subtext ?? DEFAULTS.subtext}
            placeholder="e.g. Thank you! Your order has been placed successfully."
            onChange={(v) => updateTY("subtext", v)}
          />

          <Field
            label="Note (small text)"
            multiline
            value={ty.note ?? DEFAULTS.note}
            placeholder="e.g. Our team will contact you soon."
            onChange={(v) => updateTY("note", v)}
          />

          <Field
            label="Button Text"
            value={ty.buttonText ?? DEFAULTS.buttonText}
            placeholder="e.g. Back to Store"
            onChange={(v) => updateTY("buttonText", v)}
          />

          {/* COLORS */}
          <div>
            <label className={LABEL_CLS}>Colors</label>
            <div className="grid grid-cols-2 gap-2.5">
              <ColorPicker
                label="Background"
                value={ty.bgColor ?? DEFAULTS.bgColor}
                onChange={(v) => updateTY("bgColor", v)}
              />
              <ColorPicker
                label="Card"
                value={ty.cardColor ?? DEFAULTS.cardColor}
                onChange={(v) => updateTY("cardColor", v)}
              />
              <ColorPicker
                label="Heading"
                value={ty.headingColor ?? DEFAULTS.headingColor}
                onChange={(v) => updateTY("headingColor", v)}
              />
              <ColorPicker
                label="Text"
                value={ty.textColor ?? DEFAULTS.textColor}
                onChange={(v) => updateTY("textColor", v)}
              />
            </div>
          </div>
        </div>

        {/* RIGHT — LIVE PREVIEW */}
        <div>
          <label className={LABEL_CLS}>Live Preview</label>
          <div
            className="rounded-[14px] px-5 py-7 flex items-center justify-center min-h-[300px] border border-gray-200 transition-colors"
            style={{ background: ty.bgColor ?? DEFAULTS.bgColor }}
          >
            <div
              className="rounded-[14px] px-5 py-6 text-center w-full shadow-[0_4px_16px_rgba(0,0,0,0.08)]"
              style={{ background: ty.cardColor ?? DEFAULTS.cardColor }}
            >
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3 text-[22px]"
                style={{
                  background: (ty.headingColor ?? DEFAULTS.headingColor) + "20",
                }}
              >
                ✅
              </div>

              <h3
                className="font-bold text-[16px] mb-2"
                style={{ color: ty.headingColor ?? DEFAULTS.headingColor }}
              >
                {ty.heading || DEFAULTS.heading}
              </h3>
              <p
                className="text-[13px] mb-1.5 leading-[1.5]"
                style={{ color: ty.textColor ?? DEFAULTS.textColor }}
              >
                {ty.subtext || DEFAULTS.subtext}
              </p>
              <p className="text-gray-400 text-[11px] mb-4 leading-[1.5]">
                {ty.note || DEFAULTS.note}
              </p>
              <div className="bg-gray-900 text-white rounded-lg px-[18px] py-2 text-[12px] font-semibold inline-block">
                {ty.buttonText || DEFAULTS.buttonText}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-100 my-6" />

      {/* SAVE */}
      <div className="flex items-center gap-3.5">
        <button
          onClick={handleSave}
          className={`text-white border-none rounded-[10px] px-7 py-3 text-[14px] font-bold cursor-pointer transition-colors ${
            saved ? "bg-green-600" : "bg-gray-900 hover:bg-gray-700"
          }`}
        >
          {saved ? "✅ Saved!" : "Save Settings"}
        </button>
        {saved && (
          <span className="text-[13px] text-green-600 font-semibold">
            Thank You page updated!
          </span>
        )}
      </div>
    </div>
  );
}

/* ── HELPERS ── */
function Field({ label, value, onChange, placeholder, multiline }) {
  const cls =
    "w-full px-3 py-2.5 border-[1.5px] border-gray-200 rounded-lg text-[13px] text-gray-900 bg-neutral-50 resize-y font-[inherit] focus:outline-none focus:border-gray-400 transition-colors";
  return (
    <div>
      <label className={LABEL_CLS}>{label}</label>
      {multiline ? (
        <textarea
          rows={2}
          value={value}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
          className={cls}
        />
      ) : (
        <input
          type="text"
          value={value}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
          className={cls}
        />
      )}
    </div>
  );
}

function ColorPicker({ label, value, onChange }) {
  return (
    <label className="flex items-center gap-2 px-2.5 py-2 border-[1.5px] border-gray-200 rounded-lg cursor-pointer bg-neutral-50">
      <div className="relative">
        <div
          className="w-[26px] h-[26px] rounded-md border-2 border-gray-200"
          style={{ background: value }}
        />
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
        />
      </div>
      <div>
        <p className="text-[10px] font-bold text-gray-500 m-0 uppercase">
          {label}
        </p>
        <p className="text-[11px] text-gray-900 m-0 font-mono">{value}</p>
      </div>
    </label>
  );
}
