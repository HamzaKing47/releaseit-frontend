import { useState, useEffect } from "react";
import { BACKEND } from "../backend.js";

const DEFAULT_SB = {
  quantityOffersEnabled: false,
  quantityOffers: [],
  addonsEnabled: false,
  addons: [],
};

export default function SalesBooster({ shop }) {
  const [tab, setTab] = useState("quantity");
  const [sb, setSb] = useState(DEFAULT_SB);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!shop) return;
    fetch(`${BACKEND}/api/settings?shop=${shop}`)
      .then((r) => r.json())
      .then((d) => {
        if (d.success && d.salesBooster)
          setSb({ ...DEFAULT_SB, ...d.salesBooster });
      })
      .catch(() => {});
  }, [shop]);

  const upd = (k, v) => setSb((p) => ({ ...p, [k]: v }));

  const handleSave = async () => {
    setLoading(true);
    await fetch(`${BACKEND}/api/settings?shop=${shop}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ salesBooster: sb }),
    });
    setSaved(true);
    setLoading(false);
    setTimeout(() => setSaved(false), 2500);
  };

  /* ── Quantity offers handlers ── */
  const addOffer = () =>
    upd("quantityOffers", [
      ...sb.quantityOffers,
      { minQty: 2, discountPercent: 10 },
    ]);
  const updOffer = (i, key, val) => {
    const arr = [...sb.quantityOffers];
    arr[i] = { ...arr[i], [key]: Number(val) };
    upd("quantityOffers", arr);
  };
  const removeOffer = (i) =>
    upd(
      "quantityOffers",
      sb.quantityOffers.filter((_, idx) => idx !== i),
    );

  /* ── Add-ons handlers ── */
  const addAddon = () =>
    upd("addons", [
      ...sb.addons,
      { id: Date.now(), title: "Shipping Protection", price: 99, description: "" },
    ]);
  const updAddon = (i, key, val) => {
    const arr = [...sb.addons];
    arr[i] = { ...arr[i], [key]: key === "price" ? Number(val) : val };
    upd("addons", arr);
  };
  const removeAddon = (i) =>
    upd(
      "addons",
      sb.addons.filter((_, idx) => idx !== i),
    );

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-7">
      {/* HEADER */}
      <div className="mb-5">
        <h2 className="text-[18px] font-extrabold text-gray-900 mb-1">
          🚀 Sales Booster
        </h2>
        <p className="text-[13px] text-gray-400">
          Increase your average order value with quantity offers and add-ons —
          shown directly on the COD form.
        </p>
      </div>

      {/* TABS */}
      <div className="flex gap-1 bg-gray-100 rounded-xl p-1 mb-6 max-w-md">
        <TabBtn active={tab === "quantity"} onClick={() => setTab("quantity")}>
          🛒 Quantity Offers
        </TabBtn>
        <TabBtn active={tab === "addons"} onClick={() => setTab("addons")}>
          ➕ Order Add-ons
        </TabBtn>
      </div>

      {/* ── QUANTITY OFFERS ── */}
      {tab === "quantity" && (
        <div>
          <ToggleRow
            label="Enable Quantity Offers"
            desc="Reward customers for buying more — e.g. Buy 2 save 10%"
            on={sb.quantityOffersEnabled}
            onChange={(v) => upd("quantityOffersEnabled", v)}
            big
          />

          <div
            className={`mt-5 ${!sb.quantityOffersEnabled ? "opacity-40 pointer-events-none" : ""}`}
          >
            <div className="flex items-center justify-between mb-3">
              <p className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                Discount Tiers
              </p>
              <button
                onClick={addOffer}
                className="text-[12px] font-bold bg-gray-900 text-white px-3 py-1.5 rounded-lg hover:bg-gray-700"
              >
                + Add Tier
              </button>
            </div>

            {sb.quantityOffers.length === 0 ? (
              <EmptyState text="No tiers yet. Add one to encourage bulk orders." />
            ) : (
              <div className="space-y-2">
                {sb.quantityOffers.map((o, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 flex-wrap border border-gray-200 rounded-xl p-3 text-[13px] text-gray-600"
                  >
                    Buy
                    <input
                      type="number"
                      min="2"
                      value={o.minQty}
                      onChange={(e) => updOffer(i, "minQty", e.target.value)}
                      className="w-16 px-2 py-1.5 border border-gray-200 rounded-lg text-center bg-gray-50"
                    />
                    or more, get
                    <input
                      type="number"
                      min="1"
                      max="90"
                      value={o.discountPercent}
                      onChange={(e) =>
                        updOffer(i, "discountPercent", e.target.value)
                      }
                      className="w-16 px-2 py-1.5 border border-gray-200 rounded-lg text-center bg-gray-50"
                    />
                    % off
                    <button
                      onClick={() => removeOffer(i)}
                      className="ml-auto text-red-500 hover:text-red-700 text-[13px]"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── ADD-ONS ── */}
      {tab === "addons" && (
        <div>
          <ToggleRow
            label="Enable Order Add-ons"
            desc="Optional extras customers can tick — shipping protection, gift wrap, etc."
            on={sb.addonsEnabled}
            onChange={(v) => upd("addonsEnabled", v)}
            big
          />

          <div
            className={`mt-5 ${!sb.addonsEnabled ? "opacity-40 pointer-events-none" : ""}`}
          >
            <div className="flex items-center justify-between mb-3">
              <p className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                Add-ons
              </p>
              <button
                onClick={addAddon}
                className="text-[12px] font-bold bg-gray-900 text-white px-3 py-1.5 rounded-lg hover:bg-gray-700"
              >
                + Add Add-on
              </button>
            </div>

            {sb.addons.length === 0 ? (
              <EmptyState text="No add-ons yet. Add one to boost order value." />
            ) : (
              <div className="space-y-3">
                {sb.addons.map((a, i) => (
                  <div
                    key={a.id || i}
                    className="border border-gray-200 rounded-xl p-4"
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div className="sm:col-span-2">
                        <label className="text-[10.5px] font-bold text-gray-400 uppercase block mb-1">
                          Title
                        </label>
                        <input
                          value={a.title}
                          onChange={(e) => updAddon(i, "title", e.target.value)}
                          placeholder="Shipping Protection"
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg text-[13px] bg-gray-50"
                        />
                      </div>
                      <div>
                        <label className="text-[10.5px] font-bold text-gray-400 uppercase block mb-1">
                          Price (PKR)
                        </label>
                        <input
                          type="number"
                          min="0"
                          value={a.price}
                          onChange={(e) => updAddon(i, "price", e.target.value)}
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg text-[13px] bg-gray-50"
                        />
                      </div>
                    </div>
                    <div className="mt-3">
                      <label className="text-[10.5px] font-bold text-gray-400 uppercase block mb-1">
                        Short description (optional)
                      </label>
                      <input
                        value={a.description || ""}
                        onChange={(e) =>
                          updAddon(i, "description", e.target.value)
                        }
                        placeholder="Protect your order against damage in transit"
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-[13px] bg-gray-50"
                      />
                    </div>
                    <button
                      onClick={() => removeAddon(i)}
                      className="mt-2 text-[12px] text-red-500 hover:text-red-700 font-semibold"
                    >
                      Remove add-on
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* SAVE */}
      <div className="border-t border-gray-100 mt-7 pt-5 flex items-center gap-4">
        <button
          onClick={handleSave}
          disabled={loading}
          className={`px-7 py-3 rounded-xl text-[14px] font-bold text-white transition disabled:opacity-50 ${
            saved ? "bg-green-600" : "bg-gray-900 hover:bg-gray-700"
          }`}
        >
          {saved ? "✅ Saved!" : loading ? "Saving..." : "Save Sales Booster"}
        </button>
        {saved && (
          <span className="text-[13px] text-green-600 font-semibold">
            Settings saved!
          </span>
        )}
      </div>
    </div>
  );
}

function TabBtn({ active, onClick, children }) {
  return (
    <button
      onClick={onClick}
      className={`flex-1 py-2 rounded-lg text-[12.5px] font-bold transition ${
        active ? "bg-white shadow-sm text-gray-900" : "text-gray-500"
      }`}
    >
      {children}
    </button>
  );
}

function EmptyState({ text }) {
  return (
    <div className="border-2 border-dashed border-gray-200 rounded-xl py-10 text-center">
      <p className="text-[24px] mb-2">📦</p>
      <p className="text-[13px] text-gray-400">{text}</p>
    </div>
  );
}

function ToggleRow({ label, desc, on, onChange, big }) {
  return (
    <div
      onClick={() => onChange(!on)}
      className={`flex items-center justify-between cursor-pointer rounded-xl border transition hover:bg-gray-50 ${
        big ? "p-4 border-gray-200 bg-gray-50" : "p-3 border-gray-200 bg-white"
      }`}
    >
      <div>
        <p
          className={`font-semibold text-gray-900 ${big ? "text-[14px]" : "text-[13px]"}`}
        >
          {label}
        </p>
        <p className="text-[11px] text-gray-400 mt-0.5">{desc}</p>
      </div>
      <div
        className={`rounded-full relative transition-colors flex-shrink-0 ml-3 ${
          on ? "bg-gray-900" : "bg-gray-300"
        } ${big ? "w-12 h-[26px]" : "w-10 h-[22px]"}`}
      >
        <div
          className={`absolute top-[3px] rounded-full bg-white shadow transition-all ${
            big ? "w-5 h-5" : "w-4 h-4"
          } ${on ? (big ? "left-[26px]" : "left-[22px]") : "left-[3px]"}`}
        />
      </div>
    </div>
  );
}
