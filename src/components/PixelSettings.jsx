import { useState } from "react";

const PIXEL_PLATFORMS = [
  {
    value: "facebook",
    label: "Facebook",
    icon: "📘",
    color: "#1877F2",
    idLabel: "Pixel ID",
    idPlaceholder: "e.g. 1234567890123456",
    events: ["PageView", "InitiateCheckout", "Purchase"],
    hasAPI: true,
    apiLabel: "Conversions API Access Token",
    apiPlaceholder: "Paste your Facebook CAPI access token",
    apiDocs:
      "https://developers.facebook.com/docs/marketing-api/conversions-api/get-started",
    hasTestCode: true,
  },
  {
    value: "tiktok",
    label: "TikTok",
    icon: "🎵",
    color: "#010101",
    idLabel: "Pixel ID",
    idPlaceholder: "e.g. CXXXXXXXXXXXXXXXXX",
    events: ["PageView", "InitiateCheckout", "PlaceAnOrder", "CompletePayment"],
    hasAPI: true,
    apiLabel: "Events API Access Token",
    apiPlaceholder: "Paste your TikTok Events API token",
    apiDocs: "https://business-api.tiktok.com/portal/docs",
  },
  {
    value: "snapchat",
    label: "Snapchat",
    icon: "👻",
    color: "#FFFC00",
    iconBg: "#000",
    idLabel: "Pixel ID",
    idPlaceholder: "e.g. xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
    events: ["PAGE_VIEW", "START_CHECKOUT", "PURCHASE"],
    hasAPI: true,
    apiLabel: "Conversions API Token",
    apiPlaceholder: "Paste your Snapchat CAPI token",
    apiDocs: "https://marketingapi.snapchat.com/docs/conversion.html",
  },
  {
    value: "pinterest",
    label: "Pinterest",
    icon: "📌",
    color: "#E60023",
    idLabel: "Ad Account ID",
    idPlaceholder: "e.g. 1234567890123",
    events: ["pagevisit", "checkout"],
    hasAPI: true,
    apiLabel: "Conversions API Token",
    apiPlaceholder: "Paste your Pinterest CAPI token",
    apiDocs: "https://developers.pinterest.com/docs/conversions/conversions/",
  },
  {
    value: "google",
    label: "Google Analytics (GA4)",
    icon: "📊",
    color: "#E37400",
    idLabel: "Measurement ID",
    idPlaceholder: "e.g. G-XXXXXXXXXX",
    events: ["page_view", "begin_checkout", "purchase"],
    hasAPI: false,
  },
  {
    value: "taboola",
    label: "Taboola",
    icon: "📢",
    color: "#1D9BF0",
    idLabel: "Account ID",
    idPlaceholder: "e.g. 1234567",
    events: ["start_checkout", "make_purchase"],
    hasAPI: false,
  },
  {
    value: "kwai",
    label: "Kwai",
    icon: "🎬",
    color: "#FF5A00",
    idLabel: "Pixel ID",
    idPlaceholder: "e.g. KW-XXXXXXXXX",
    events: ["purchase"],
    hasAPI: false,
  },
];

/* ── INPUT STYLES ── */
const inp =
  "w-full px-3 py-2.5 border border-gray-200 rounded-lg text-[13px] bg-gray-50 focus:outline-none focus:border-gray-400 transition";

function PixelCard({ pixel, index, updatePixel, removePixel }) {
  const [open, setOpen] = useState(true);
  const [showToken, setShowToken] = useState(false);

  const platform =
    PIXEL_PLATFORMS.find((p) => p.value === pixel.type) || PIXEL_PLATFORMS[0];
  const hasServerAPI = platform.hasAPI && pixel.accessToken;

  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden bg-white shadow-sm mb-3">
      {/* HEADER */}
      <div
        onClick={() => setOpen((p) => !p)}
        className={`flex items-center justify-between px-4 py-3 cursor-pointer transition ${open ? "bg-gray-50 border-b border-gray-100" : "bg-white"}`}
      >
        <div className="flex items-center gap-3">
          <span
            className="w-8 h-8 flex items-center justify-center rounded-lg text-lg"
            style={{ background: platform.iconBg || platform.color + "18" }}
          >
            {platform.icon}
          </span>
          <div>
            <p className="text-[13px] font-semibold text-gray-900">
              {platform.label}
            </p>
            <div className="flex items-center gap-2 mt-0.5">
              {pixel.pixelId && (
                <span className="text-[11px] text-gray-400">
                  ID: {pixel.pixelId}
                </span>
              )}
              {hasServerAPI && (
                <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-green-100 text-green-700">
                  ✅ Server-side ON
                </span>
              )}
              {platform.hasAPI && !pixel.accessToken && (
                <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-yellow-100 text-yellow-700">
                  ⚠️ Browser only
                </span>
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={(e) => {
              e.stopPropagation();
              removePixel(index);
            }}
            className="text-[12px] text-red-500 hover:bg-red-50 px-2 py-1 rounded-md transition"
          >
            Remove
          </button>
          <span className="text-gray-400 text-sm">{open ? "▲" : "▼"}</span>
        </div>
      </div>

      {/* BODY */}
      {open && (
        <div className="p-4 flex flex-col gap-4">
          {/* PLATFORM SELECT */}
          <div>
            <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">
              Platform
            </label>
            <select
              value={pixel.type}
              onChange={(e) => updatePixel(index, "type", e.target.value)}
              className={inp}
            >
              {PIXEL_PLATFORMS.map((p) => (
                <option key={p.value} value={p.value}>
                  {p.icon} {p.label}
                </option>
              ))}
            </select>
          </div>

          {/* TWO COLUMN: ID + LABEL */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                {platform.idLabel}
              </label>
              <input
                placeholder={platform.idPlaceholder}
                value={pixel.pixelId || ""}
                onChange={(e) => updatePixel(index, "pixelId", e.target.value)}
                className={inp}
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                Label{" "}
                <span className="font-normal text-gray-400">(optional)</span>
              </label>
              <input
                placeholder="e.g. My Main Pixel"
                value={pixel.label || ""}
                onChange={(e) => updatePixel(index, "label", e.target.value)}
                className={inp}
              />
            </div>
          </div>

          {/* SERVER-SIDE API SECTION */}
          {platform.hasAPI && (
            <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="text-[13px] font-bold text-blue-900">
                    🚀 Server-Side API
                  </p>
                  <p className="text-[11px] text-blue-600 mt-0.5">
                    Bypasses ad blockers — more accurate than browser pixel
                  </p>
                </div>
                {platform.apiDocs && (
                  <a
                    href={platform.apiDocs}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[11px] text-blue-500 hover:underline whitespace-nowrap"
                    onClick={(e) => e.stopPropagation()}
                  >
                    How to get token →
                  </a>
                )}
              </div>

              {/* ACCESS TOKEN */}
              <div className="mb-3">
                <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                  {platform.apiLabel}
                </label>
                <div className="relative">
                  <input
                    type={showToken ? "text" : "password"}
                    placeholder={platform.apiPlaceholder}
                    value={pixel.accessToken || ""}
                    onChange={(e) =>
                      updatePixel(index, "accessToken", e.target.value)
                    }
                    className={inp + " pr-16"}
                  />
                  <button
                    type="button"
                    onClick={() => setShowToken((p) => !p)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-[11px] text-gray-400 hover:text-gray-600 px-1"
                  >
                    {showToken ? "Hide" : "Show"}
                  </button>
                </div>
              </div>

              {/* FACEBOOK TEST CODE */}
              {platform.hasTestCode && (
                <div>
                  <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                    Test Event Code{" "}
                    <span className="font-normal text-gray-400">
                      (optional, for testing)
                    </span>
                  </label>
                  <input
                    placeholder="e.g. TEST12345"
                    value={pixel.testCode || ""}
                    onChange={(e) =>
                      updatePixel(index, "testCode", e.target.value)
                    }
                    className={inp}
                  />
                  <p className="text-[11px] text-gray-400 mt-1">
                    Find this in Facebook Events Manager → Test Events tab
                  </p>
                </div>
              )}
            </div>
          )}

          {/* AUTO EVENTS BADGES */}
          <div className="bg-gray-50 border border-gray-100 rounded-lg px-3 py-2.5">
            <p className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-2">
              Auto Events
            </p>
            <div className="flex flex-wrap gap-1.5">
              {platform.events.map((ev, i) => (
                <span
                  key={i}
                  className="text-[11px] font-semibold px-2 py-0.5 rounded-md"
                  style={{
                    background: platform.color + "15",
                    color: platform.color,
                    border: `1px solid ${platform.color}30`,
                  }}
                >
                  {ev}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function PixelSettings({
  pixels,
  addPixel,
  updatePixel,
  removePixel,
  savePixels,
}) {
  const [saved, setSaved] = useState(false);

  const handleSave = async () => {
    await savePixels();
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const serverSideCount = pixels.filter(
    (p) =>
      PIXEL_PLATFORMS.find((pl) => pl.value === p.type)?.hasAPI &&
      p.accessToken,
  ).length;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-7">
      {/* HEADER */}
      <div className="mb-5">
        <h2 className="text-[20px] font-extrabold text-gray-900 mb-1 flex items-center gap-2.5">
          <span className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-600 to-violet-600 text-white flex items-center justify-center text-[16px] shadow-sm">
            📊
          </span>
          Pixels
        </h2>
        <p className="text-[13px] text-gray-400">
          Add tracking pixels. Events fire automatically on checkout and
          purchase.
        </p>
      </div>

      {/* STATUS BAR */}
      {pixels.length > 0 && (
        <div className="flex items-center gap-3 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 mb-5">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-green-500"></span>
            <span className="text-[12px] font-semibold text-gray-700">
              {pixels.length} pixel{pixels.length > 1 ? "s" : ""} added
            </span>
          </div>
          <span className="text-gray-300">|</span>
          <div className="flex items-center gap-1.5">
            <span
              className={`w-2 h-2 rounded-full ${serverSideCount > 0 ? "bg-blue-500" : "bg-gray-300"}`}
            ></span>
            <span className="text-[12px] font-semibold text-gray-700">
              {serverSideCount} server-side API
              {serverSideCount !== 1 ? "s" : ""} active
            </span>
          </div>
        </div>
      )}

      <div className="border-t border-gray-100 mb-5" />

      {/* ADD BUTTON */}
      <button
        onClick={() =>
          addPixel({
            type: "facebook",
            pixelId: "",
            label: "",
            accessToken: "",
            testCode: "",
          })
        }
        className="flex items-center gap-2 bg-gray-900 hover:bg-gray-700 text-white text-[13px] font-bold px-4 py-2.5 rounded-lg transition mb-5"
      >
        + Add Pixel
      </button>

      {/* PIXEL LIST */}
      {pixels.length === 0 ? (
        <div className="border-2 border-dashed border-gray-200 rounded-xl p-10 text-center mb-5">
          <p className="text-3xl mb-2">📡</p>
          <p className="text-[13px] text-gray-400">
            No pixels yet. Click "Add Pixel" to start tracking.
          </p>
        </div>
      ) : (
        <div className="mb-5">
          {pixels.map((p, i) => (
            <PixelCard
              key={i}
              pixel={p}
              index={i}
              updatePixel={updatePixel}
              removePixel={removePixel}
            />
          ))}
        </div>
      )}

      {/* HOW IT WORKS */}
      <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 mb-6">
        <p className="text-[12px] font-bold text-gray-700 mb-3">
          ⚡ How tracking works
        </p>
        <div className="grid grid-cols-2 gap-2">
          {[
            {
              icon: "🌐",
              title: "Browser Pixel",
              desc: "PageView + InitiateCheckout fires when customer clicks COD button",
            },
            {
              icon: "🖥️",
              title: "Server-Side API",
              desc: "Purchase fires from our server — bypasses ad blockers & iOS 14+",
            },
            {
              icon: "🔒",
              title: "Deduplication",
              desc: "Same event_id used for browser + server — no double counting",
            },
            {
              icon: "📱",
              title: "Phone Hashing",
              desc: "Customer phone is SHA256 hashed before sending to any platform",
            },
          ].map((item, i) => (
            <div
              key={i}
              className="bg-white rounded-lg p-3 border border-gray-100"
            >
              <p className="text-[12px] font-bold text-gray-800 mb-1">
                {item.icon} {item.title}
              </p>
              <p className="text-[11px] text-gray-500 leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* SAVE */}
      <div className="border-t border-gray-100 pt-5 flex items-center gap-4">
        <button
          onClick={handleSave}
          className={`px-7 py-3 rounded-xl text-[14px] font-bold text-white transition ${saved ? "bg-green-600" : "bg-gray-900 hover:bg-gray-700"}`}
        >
          {saved ? "✅ Saved!" : "Save Pixels"}
        </button>
        {saved && (
          <span className="text-[13px] text-green-600 font-semibold">
            Pixels saved!
          </span>
        )}
      </div>
    </div>
  );
}
