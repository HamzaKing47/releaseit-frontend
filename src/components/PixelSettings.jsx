import { useState } from "react";

/* ============================================================
   PIXEL CONFIG — har platform ka label, events, ID placeholder
============================================================ */
const PIXEL_PLATFORMS = [
  {
    value: "facebook",
    label: "Facebook Pixel",
    icon: "📘",
    color: "#1877F2",
    idLabel: "Pixel ID",
    placeholder: "e.g. 1234567890123456",
    events: ["PageView", "InitiateCheckout", "Purchase"],
    extra: "Facebook Conversions API ke liye alag se API key daalna hoga.",
  },
  {
    value: "google",
    label: "Google Analytics (GA4)",
    icon: "📊",
    color: "#E37400",
    idLabel: "Measurement ID",
    placeholder: "e.g. G-XXXXXXXXXX",
    events: ["page_view", "begin_checkout", "purchase"],
    extra: null,
  },
  {
    value: "tiktok",
    label: "TikTok Pixel",
    icon: "🎵",
    color: "#010101",
    idLabel: "Pixel ID",
    placeholder: "e.g. CXXXXXXXXXXXXXXXXX",
    events: ["PageView", "InitiateCheckout", "PlaceAnOrder", "CompletePayment"],
    extra: null,
  },
  {
    value: "snapchat",
    label: "Snapchat Pixel",
    icon: "👻",
    color: "#FFFC00",
    iconBg: "#000",
    idLabel: "Pixel ID",
    placeholder: "e.g. xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
    events: ["PAGE_VIEW", "START_CHECKOUT", "PURCHASE"],
    extra: null,
  },
  {
    value: "pinterest",
    label: "Pinterest Tag",
    icon: "📌",
    color: "#E60023",
    idLabel: "Tag ID",
    placeholder: "e.g. 1234567890123",
    events: ["pagevisit", "checkout"],
    extra: null,
  },
  {
    value: "sharechat",
    label: "ShareChat Tag",
    icon: "💬",
    color: "#3A6BC9",
    idLabel: "Tag ID",
    placeholder: "e.g. SC-XXXXXXXXX",
    events: ["Initiate checkout", "Purchase"],
    extra: null,
  },
  {
    value: "taboola",
    label: "Taboola Tag",
    icon: "📢",
    color: "#1D9BF0",
    idLabel: "Account ID",
    placeholder: "e.g. 1234567",
    events: ["start_checkout", "make_purchase"],
    extra: null,
  },
  {
    value: "kwai",
    label: "Kwai Tag",
    icon: "🎬",
    color: "#FF5A00",
    idLabel: "Pixel ID",
    placeholder: "e.g. KW-XXXXXXXXX",
    events: ["purchase"],
    extra: null,
  },
];

/* ============================================================
   PIXEL CARD
============================================================ */
function PixelCard({ pixel, index, updatePixel, removePixel }) {
  const [open, setOpen] = useState(true);

  const platform =
    PIXEL_PLATFORMS.find((p) => p.value === pixel.type) || PIXEL_PLATFORMS[0];

  return (
    <div
      style={{
        border: "1px solid #e5e7eb",
        borderRadius: "12px",
        marginBottom: "12px",
        overflow: "hidden",
        background: "#fff",
        boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
      }}
    >
      {/* HEADER */}
      <div
        onClick={() => setOpen((p) => !p)}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "14px 18px",
          cursor: "pointer",
          background: open ? "#fafafa" : "#fff",
          borderBottom: open ? "1px solid #f0f0f0" : "none",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <span
            style={{
              fontSize: "20px",
              width: "32px",
              height: "32px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: "8px",
              background: platform.iconBg || platform.color + "15",
            }}
          >
            {platform.icon}
          </span>
          <div>
            <p style={{ fontWeight: 600, fontSize: "14px", color: "#111" }}>
              {platform.label}
            </p>
            {pixel.pixelId && (
              <p style={{ fontSize: "11px", color: "#9ca3af" }}>
                ID: {pixel.pixelId}
              </p>
            )}
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <button
            onClick={(e) => {
              e.stopPropagation();
              removePixel(index);
            }}
            style={{
              color: "#ef4444",
              fontSize: "12px",
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: "4px 8px",
              borderRadius: "6px",
              transition: "background 0.15s",
            }}
            onMouseOver={(e) => (e.target.style.background = "#fef2f2")}
            onMouseOut={(e) => (e.target.style.background = "none")}
          >
            Remove
          </button>
          <span style={{ color: "#9ca3af", fontSize: "18px" }}>
            {open ? "▲" : "▼"}
          </span>
        </div>
      </div>

      {/* BODY */}
      {open && (
        <div style={{ padding: "18px" }}>
          {/* PLATFORM SELECT */}
          <label
            style={{ fontSize: "12px", fontWeight: 600, color: "#6b7280", display: "block", marginBottom: "6px" }}
          >
            Platform
          </label>
          <select
            value={pixel.type}
            onChange={(e) => updatePixel(index, "type", e.target.value)}
            style={{
              width: "100%",
              padding: "10px 12px",
              border: "1px solid #d1d5db",
              borderRadius: "8px",
              marginBottom: "14px",
              fontSize: "13px",
              background: "#fff",
              cursor: "pointer",
            }}
          >
            {PIXEL_PLATFORMS.map((p) => (
              <option key={p.value} value={p.value}>
                {p.icon} {p.label}
              </option>
            ))}
          </select>

          {/* PIXEL ID */}
          <label
            style={{ fontSize: "12px", fontWeight: 600, color: "#6b7280", display: "block", marginBottom: "6px" }}
          >
            {platform.idLabel}
          </label>
          <input
            placeholder={platform.placeholder}
            value={pixel.pixelId}
            onChange={(e) => updatePixel(index, "pixelId", e.target.value)}
            style={{
              width: "100%",
              padding: "10px 12px",
              border: "1px solid #d1d5db",
              borderRadius: "8px",
              marginBottom: "14px",
              fontSize: "13px",
              boxSizing: "border-box",
            }}
          />

          {/* LABEL (optional) */}
          <label
            style={{ fontSize: "12px", fontWeight: 600, color: "#6b7280", display: "block", marginBottom: "6px" }}
          >
            Label <span style={{ fontWeight: 400, color: "#9ca3af" }}>(optional)</span>
          </label>
          <input
            placeholder="e.g. My Facebook Pixel"
            value={pixel.label || ""}
            onChange={(e) => updatePixel(index, "label", e.target.value)}
            style={{
              width: "100%",
              padding: "10px 12px",
              border: "1px solid #d1d5db",
              borderRadius: "8px",
              marginBottom: "14px",
              fontSize: "13px",
              boxSizing: "border-box",
            }}
          />

          {/* AUTO EVENTS */}
          <div
            style={{
              background: "#f8fafc",
              border: "1px solid #e2e8f0",
              borderRadius: "8px",
              padding: "12px 14px",
            }}
          >
            <p
              style={{ fontSize: "12px", fontWeight: 700, color: "#374151", marginBottom: "8px" }}
            >
              ✅ Auto Events:
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
              {platform.events.map((ev, i) => (
                <span
                  key={i}
                  style={{
                    background: platform.color + "15",
                    color: platform.color,
                    border: `1px solid ${platform.color}30`,
                    borderRadius: "6px",
                    padding: "3px 10px",
                    fontSize: "11px",
                    fontWeight: 600,
                  }}
                >
                  {ev}
                </span>
              ))}
            </div>

            {platform.extra && (
              <p style={{ fontSize: "11px", color: "#9ca3af", marginTop: "10px" }}>
                ℹ️ {platform.extra}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

/* ============================================================
   MAIN COMPONENT
============================================================ */
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

  return (
    <div
      style={{
        background: "#fff",
        borderRadius: "16px",
        boxShadow: "0 2px 12px rgba(0,0,0,0.07)",
        padding: "28px",
        maxWidth: "720px",
      }}
    >
      {/* HEADING */}
      <div style={{ marginBottom: "6px" }}>
        <h2 style={{ fontSize: "20px", fontWeight: 700, color: "#111" }}>
          📊 Pixels
        </h2>
        <p style={{ fontSize: "13px", color: "#6b7280", marginTop: "4px" }}>
          Apne tracking pixels add karo. Events automatically fire honge jab
          customer COD form bhare aur order place kare.
        </p>
      </div>

      {/* DIVIDER */}
      <div style={{ borderTop: "1px solid #f0f0f0", margin: "18px 0" }} />

      {/* ADD ITEM BUTTON */}
      <button
        onClick={() =>
          addPixel({ type: "facebook", pixelId: "", label: "" })
        }
        style={{
          display: "flex",
          alignItems: "center",
          gap: "6px",
          background: "#111",
          color: "#fff",
          border: "none",
          borderRadius: "8px",
          padding: "10px 18px",
          fontSize: "13px",
          fontWeight: 600,
          cursor: "pointer",
          marginBottom: "20px",
          transition: "background 0.2s",
        }}
        onMouseOver={(e) => (e.currentTarget.style.background = "#333")}
        onMouseOut={(e) => (e.currentTarget.style.background = "#111")}
      >
        + Add Item
      </button>

      {/* PIXEL LIST */}
      {pixels.length === 0 ? (
        <div
          style={{
            textAlign: "center",
            padding: "40px 20px",
            background: "#fafafa",
            borderRadius: "12px",
            border: "1px dashed #e5e7eb",
            marginBottom: "20px",
          }}
        >
          <p style={{ fontSize: "32px", marginBottom: "10px" }}>📡</p>
          <p style={{ color: "#9ca3af", fontSize: "14px" }}>
            Abhi koi pixel nahi. "Add Item" dabao.
          </p>
        </div>
      ) : (
        pixels.map((p, i) => (
          <PixelCard
            key={i}
            pixel={p}
            index={i}
            updatePixel={updatePixel}
            removePixel={removePixel}
          />
        ))
      )}

      {/* PLATFORM OVERVIEW TABLE */}
      <div
        style={{
          background: "#f8fafc",
          border: "1px solid #e2e8f0",
          borderRadius: "12px",
          padding: "18px",
          marginBottom: "20px",
        }}
      >
        <p style={{ fontSize: "13px", fontWeight: 700, color: "#374151", marginBottom: "14px" }}>
          📋 Har Platform ke Auto Events:
        </p>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "12px",
          }}
        >
          {PIXEL_PLATFORMS.map((p) => (
            <div
              key={p.value}
              style={{
                background: "#fff",
                border: "1px solid #e5e7eb",
                borderRadius: "8px",
                padding: "12px",
              }}
            >
              <p style={{ fontWeight: 700, fontSize: "13px", color: "#111", marginBottom: "6px" }}>
                {p.icon} {p.label}
              </p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "4px" }}>
                {p.events.map((ev, i) => (
                  <span
                    key={i}
                    style={{
                      background: "#f3f4f6",
                      color: "#374151",
                      borderRadius: "4px",
                      padding: "2px 7px",
                      fontSize: "10px",
                      fontWeight: 500,
                    }}
                  >
                    {ev}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SAVE BUTTON */}
      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        <button
          onClick={handleSave}
          style={{
            background: saved ? "#16a34a" : "#2563eb",
            color: "#fff",
            border: "none",
            borderRadius: "8px",
            padding: "11px 24px",
            fontSize: "14px",
            fontWeight: 600,
            cursor: "pointer",
            transition: "background 0.3s",
          }}
        >
          {saved ? "✅ Saved!" : "Save Pixels"}
        </button>
        {saved && (
          <span style={{ fontSize: "13px", color: "#16a34a" }}>
            Pixels save ho gaye!
          </span>
        )}
      </div>
    </div>
  );
}
