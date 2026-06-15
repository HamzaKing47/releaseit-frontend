import { useState } from "react";

const LABEL_CLS =
  "block text-[11px] font-bold text-gray-500 uppercase tracking-[0.06em] mb-2";
const INPUT_CLS =
  "w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-[14px] text-gray-900 bg-white focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition";
const CARD_CLS =
  "bg-white rounded-2xl shadow-sm border border-gray-100 p-5";

const MODE_OPTIONS = [
  { value: "both", label: "Show All Buttons", desc: "Add to Cart + Buy Now + COD" },
  { value: "replace", label: "Replace Add to Cart", desc: "Hide Add to Cart, show COD" },
  { value: "replace_buy_now", label: "Replace Buy Now", desc: "Hide Buy Now, show COD" },
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
    <div className="max-w-5xl mx-auto">
      {/* HEADER */}
      <div className="mb-6">
        <h2 className="text-[22px] font-extrabold text-gray-900 flex items-center gap-2.5">
          <span className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-600 to-violet-600 text-white flex items-center justify-center text-[17px] shadow-sm">
            ⚙️
          </span>
          COD Button
        </h2>
        <p className="text-[13px] text-gray-500 mt-1.5 ml-[46px]">
          Customize your Cash on Delivery button’s look and behavior.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
        {/* ── LEFT: CONTROLS ── */}
        <div className="lg:col-span-3 space-y-5">
          {/* MODE */}
          <div className={CARD_CLS}>
            <label className={LABEL_CLS}>Button Mode</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {MODE_OPTIONS.map((opt) => {
                const active = settings.mode === opt.value;
                return (
                  <button
                    type="button"
                    key={opt.value}
                    onClick={() => update("mode", opt.value)}
                    className={`text-left flex items-start gap-3 px-3.5 py-3 rounded-xl border-2 transition ${
                      active
                        ? "border-indigo-500 bg-indigo-50/60 ring-2 ring-indigo-100"
                        : "border-gray-200 bg-white hover:border-gray-300"
                    }`}
                  >
                    <div
                      className={`mt-0.5 w-4 h-4 rounded-full shrink-0 border-2 flex items-center justify-center ${
                        active ? "border-indigo-600" : "border-gray-300"
                      }`}
                    >
                      {active && (
                        <div className="w-2 h-2 rounded-full bg-indigo-600" />
                      )}
                    </div>
                    <div>
                      <p
                        className={`text-[13px] font-bold m-0 ${
                          active ? "text-indigo-900" : "text-gray-900"
                        }`}
                      >
                        {opt.label}
                      </p>
                      <p className="text-[11px] text-gray-400 m-0 mt-0.5">
                        {opt.desc}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* POSITION + TEXT */}
          <div className={CARD_CLS + " space-y-4"}>
            <div>
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
            <div>
              <label className={LABEL_CLS}>Button Text</label>
              <input
                value={settings.buttonText}
                onChange={(e) => update("buttonText", e.target.value)}
                placeholder="Buy with Cash on Delivery"
                className={INPUT_CLS}
              />
            </div>
          </div>

          {/* COLORS + RADIUS */}
          <div className={CARD_CLS + " space-y-4"}>
            <div>
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

            <div>
              <label className={LABEL_CLS}>
                Border Radius{" "}
                <span className="text-indigo-600 font-extrabold text-[12px] ml-1">
                  {settings.borderRadius}px
                </span>
              </label>
              <input
                type="range"
                min="0"
                max="30"
                value={settings.borderRadius}
                onChange={(e) => update("borderRadius", Number(e.target.value))}
                className="w-full accent-indigo-600"
              />
              <div className="flex justify-between text-[10px] text-gray-400 mt-1">
                <span>Square</span>
                <span>Rounded</span>
                <span>Pill</span>
              </div>
            </div>
          </div>

          {/* SAVE */}
          <div className="flex items-center gap-3.5 pt-1">
            <button
              onClick={handleSave}
              className={`text-white border-none rounded-xl px-7 py-3 text-[14px] font-bold cursor-pointer transition shadow-sm ${
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

        {/* ── RIGHT: PREVIEW (sticky) ── */}
        <div className="lg:col-span-2">
          <div className={`${CARD_CLS} lg:sticky lg:top-4`}>
            <label className={LABEL_CLS}>Live Preview</label>

            {/* PHONE MOCKUP */}
            <div className="bg-[#1a1a1a] rounded-[30px] px-3 pt-4 pb-5 shadow-[0_16px_44px_rgba(0,0,0,0.28)] max-w-[250px] mx-auto">
              <div className="w-[60px] h-1.5 bg-[#333] rounded-[3px] mx-auto mb-3.5" />
              <div className="bg-white rounded-2xl px-3 py-3.5">
                <div className="bg-gradient-to-br from-gray-100 to-gray-50 rounded-xl h-[100px] mb-2.5 flex items-center justify-center">
                  <span className="text-[30px]">👟</span>
                </div>
                <p className="text-[12px] font-bold text-gray-900 mb-1">
                  Product Name
                </p>
                <p className="text-[11px] text-gray-400 mb-3">Rs. 2,500</p>

                {(() => {
                  const showAdd =
                    settings.mode !== "replace" && settings.mode !== "cod_only";
                  const showBuy =
                    settings.mode !== "replace_buy_now" &&
                    settings.mode !== "cod_only";

                  const addBtn = showAdd && (
                    <button
                      key="add"
                      className="w-full py-[9px] bg-white border-[1.5px] border-gray-300 text-[11px] font-medium text-gray-700 mb-1.5 cursor-default"
                      style={{ borderRadius: `${settings.borderRadius}px` }}
                    >
                      Add to cart
                    </button>
                  );
                  const buyBtn = showBuy && (
                    <button
                      key="buy"
                      className="w-full py-[9px] bg-gray-900 border-none text-[11px] font-semibold text-white mb-1.5 cursor-default"
                      style={{ borderRadius: `${settings.borderRadius}px` }}
                    >
                      Buy it now
                    </button>
                  );
                  const codBtn = (
                    <button
                      key="cod"
                      className="w-full py-2.5 border-none text-[11px] font-bold mb-1.5 cursor-default"
                      style={{
                        background: settings.bgColor,
                        color: settings.textColor,
                        borderRadius: `${settings.borderRadius}px`,
                      }}
                    >
                      {settings.buttonText || "Buy with Cash on Delivery"}
                    </button>
                  );

                  let order;
                  if (settings.position === "above")
                    order = [codBtn, addBtn, buyBtn];
                  else if (settings.position === "below_buy_now")
                    order = [addBtn, buyBtn, codBtn];
                  else order = [addBtn, codBtn, buyBtn];
                  return order.filter(Boolean);
                })()}
              </div>
            </div>

            <div className="mt-3.5 bg-indigo-50 border border-indigo-100 rounded-xl px-3.5 py-2.5 text-[12px] text-indigo-700 font-semibold text-center">
              ✅ {MODE_OPTIONS.find((m) => m.value === settings.mode)?.label}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ColorSwatch({ label, value, onChange }) {
  return (
    <label className="flex items-center gap-2.5 px-3 py-2 border border-gray-200 rounded-xl cursor-pointer bg-white hover:border-gray-300 transition">
      <div className="relative shrink-0">
        <div
          className="w-7 h-7 rounded-lg border-2 border-gray-200"
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
