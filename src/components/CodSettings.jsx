import { useState } from "react";

const LABEL_CLS =
  "block text-[11px] font-bold text-gray-500 uppercase tracking-[0.05em] mb-1.5";
const INPUT_CLS =
  "w-full px-3.5 py-2.5 border-[1.5px] border-gray-200 rounded-lg text-[14px] text-gray-900 bg-neutral-50 focus:outline-none focus:border-gray-400 transition-colors";

const MODE_OPTIONS = [
  {
    value: "both",
    label: "Show All Buttons",
    desc: "Add to Cart + Buy Now + COD",
  },
  {
    value: "replace",
    label: "Replace Add to Cart",
    desc: "Hide Add to Cart, show COD",
  },
  {
    value: "replace_buy_now",
    label: "Replace Buy Now",
    desc: "Hide Buy Now, show COD",
  },
  { value: "cod_only", label: "COD Only", desc: "Hide all, show only COD" },
];

const POSITION_OPTIONS = [
  { value: "below", label: "Below Add to Cart" },
  { value: "above", label: "Above Add to Cart" },
  { value: "below_buy_now", label: "Below Buy Now" },
];

export default function CodSettings({ settings, update, save }) {
  const [saved, setSaved] = useState(false);

  const handleSave = async () => {
    await save();
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="bg-white rounded-2xl shadow-[0_1px_8px_rgba(0,0,0,0.07)] p-7">
      {/* HEADER */}
      <div className="mb-[22px]">
        <h2 className="text-[18px] font-extrabold text-gray-900 mb-1">
          ⚙️ COD Button Settings
        </h2>
        <p className="text-[13px] text-gray-400">
          Customize your Cash on Delivery button appearance and behavior.
        </p>
      </div>

      <div className="border-t border-gray-100 my-6" />

      <div className="grid grid-cols-2 gap-8">
        {/* ── LEFT: CONTROLS ── */}
        <div>
          {/* MODE — radio cards */}
          <div className="mb-5">
            <label className={LABEL_CLS}>Button Mode</label>
            <div className="flex flex-col gap-[7px]">
              {MODE_OPTIONS.map((opt) => {
                const active = settings.mode === opt.value;
                return (
                  <div
                    key={opt.value}
                    onClick={() => update("mode", opt.value)}
                    className={`flex items-center gap-3 px-3.5 py-2.5 rounded-lg border-[1.5px] cursor-pointer transition-all ${
                      active
                        ? "border-gray-900 bg-neutral-50"
                        : "border-gray-200 bg-white"
                    }`}
                  >
                    <div
                      className={`w-4 h-4 rounded-full shrink-0 border-2 flex items-center justify-center ${
                        active ? "border-gray-900" : "border-gray-300"
                      }`}
                    >
                      {active && (
                        <div className="w-2 h-2 rounded-full bg-gray-900" />
                      )}
                    </div>
                    <div>
                      <p className="text-[13px] font-semibold text-gray-900 m-0">
                        {opt.label}
                      </p>
                      <p className="text-[11px] text-gray-400 m-0">
                        {opt.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* POSITION */}
          <div className="mb-5">
            <label className={LABEL_CLS}>Button Position</label>
            <select
              value={settings.position || "below"}
              onChange={(e) => update("position", e.target.value)}
              className={INPUT_CLS + " cursor-pointer"}
            >
              {POSITION_OPTIONS.map((p) => (
                <option key={p.value} value={p.value}>
                  {p.label}
                </option>
              ))}
            </select>
          </div>

          {/* TEXT */}
          <div className="mb-5">
            <label className={LABEL_CLS}>Button Text</label>
            <input
              value={settings.buttonText}
              onChange={(e) => update("buttonText", e.target.value)}
              placeholder="Buy with Cash on Delivery"
              className={INPUT_CLS}
            />
          </div>

          {/* COLORS */}
          <div className="mb-5">
            <label className={LABEL_CLS}>Colors</label>
            <div className="grid grid-cols-2 gap-2.5">
              <ColorSwatch
                label="Background"
                value={settings.bgColor}
                onChange={(v) => update("bgColor", v)}
              />
              <ColorSwatch
                label="Text"
                value={settings.textColor}
                onChange={(v) => update("textColor", v)}
              />
            </div>
          </div>

          {/* BORDER RADIUS */}
          <div className="mb-5">
            <label className={LABEL_CLS}>
              Border Radius &nbsp;
              <span className="text-gray-900 font-extrabold text-[13px]">
                {settings.borderRadius}px
              </span>
            </label>
            <input
              type="range"
              min="0"
              max="30"
              value={settings.borderRadius}
              onChange={(e) => update("borderRadius", Number(e.target.value))}
              className="w-full accent-gray-900"
            />
            <div className="flex justify-between text-[10px] text-gray-400 mt-0.5">
              <span>Square</span>
              <span>Rounded</span>
              <span>Pill</span>
            </div>
          </div>
        </div>

        {/* ── RIGHT: PREVIEW ── */}
        <div>
          <label className={LABEL_CLS}>Live Preview</label>

          {/* PHONE MOCKUP */}
          <div className="bg-[#1a1a1a] rounded-[28px] px-3 pt-4 pb-5 shadow-[0_12px_40px_rgba(0,0,0,0.25)] max-w-[260px] mx-auto">
            {/* notch */}
            <div className="w-[60px] h-1.5 bg-[#333] rounded-[3px] mx-auto mb-3.5" />

            {/* product mock */}
            <div className="bg-white rounded-2xl px-3 py-3.5">
              {/* product image placeholder */}
              <div className="bg-gray-100 rounded-[10px] h-[100px] mb-2.5 flex items-center justify-center">
                <span className="text-[28px]">👟</span>
              </div>
              <p className="text-[12px] font-bold text-gray-900 mb-1">
                Product Name
              </p>
              <p className="text-[11px] text-gray-400 mb-3">Rs. 2,500</p>

              {/* BUTTONS */}
              {settings.mode !== "replace" && settings.mode !== "cod_only" && (
                <button
                  className="w-full py-[9px] bg-white border-[1.5px] border-gray-300 text-[11px] font-medium text-gray-700 mb-1.5 cursor-default"
                  style={{ borderRadius: `${settings.borderRadius}px` }}
                >
                  Add to cart
                </button>
              )}

              {settings.mode !== "replace_buy_now" &&
                settings.mode !== "cod_only" && (
                  <button
                    className="w-full py-[9px] bg-gray-900 border-none text-[11px] font-semibold text-white mb-1.5 cursor-default"
                    style={{ borderRadius: `${settings.borderRadius}px` }}
                  >
                    Buy it now
                  </button>
                )}

              <button
                className="w-full py-2.5 border-none text-[11px] font-bold cursor-default"
                style={{
                  background: settings.bgColor,
                  color: settings.textColor,
                  borderRadius: `${settings.borderRadius}px`,
                }}
              >
                {settings.buttonText || "Buy with Cash on Delivery"}
              </button>
            </div>
          </div>

          {/* mode badge */}
          <div className="mt-3.5 bg-green-50 border border-green-200 rounded-lg px-3.5 py-2.5 text-[12px] text-green-700 font-semibold max-w-[260px] mx-auto text-center">
            ✅ {MODE_OPTIONS.find((m) => m.value === settings.mode)?.label}
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
            COD settings updated!
          </span>
        )}
      </div>
    </div>
  );
}

function ColorSwatch({ label, value, onChange }) {
  return (
    <label className="flex items-center gap-2.5 px-3 py-2 border-[1.5px] border-gray-200 rounded-lg cursor-pointer bg-neutral-50">
      <div className="relative shrink-0">
        <div
          className="w-7 h-7 rounded-md border-2 border-gray-200"
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
        <p className="text-[12px] text-gray-900 m-0 font-mono">{value}</p>
      </div>
    </label>
  );
}
