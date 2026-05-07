import { useState } from "react";

const S = {
  card: {
    background: "#fff",
    borderRadius: "16px",
    boxShadow: "0 1px 8px rgba(0,0,0,0.07)",
    padding: "28px",
    maxWidth: "860px",
  },
  label: {
    fontSize: "11px",
    fontWeight: 700,
    color: "#6b7280",
    display: "block",
    marginBottom: "6px",
    textTransform: "uppercase",
    letterSpacing: "0.05em",
  },
  input: {
    width: "100%",
    padding: "10px 14px",
    border: "1.5px solid #e5e7eb",
    borderRadius: "8px",
    fontSize: "14px",
    color: "#111",
    boxSizing: "border-box",
    background: "#fafafa",
  },
  select: {
    width: "100%",
    padding: "10px 14px",
    border: "1.5px solid #e5e7eb",
    borderRadius: "8px",
    fontSize: "14px",
    color: "#111",
    boxSizing: "border-box",
    background: "#fafafa",
    cursor: "pointer",
  },
  row: { marginBottom: "20px" },
  divider: { borderTop: "1px solid #f3f4f6", margin: "24px 0" },
};

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
    <div style={S.card}>
      {/* HEADER */}
      <div style={{ marginBottom: "22px" }}>
        <h2
          style={{
            fontSize: "18px",
            fontWeight: 800,
            color: "#111",
            marginBottom: "4px",
          }}
        >
          ⚙️ COD Button Settings
        </h2>
        <p style={{ fontSize: "13px", color: "#9ca3af" }}>
          Customize your Cash on Delivery button appearance and behavior.
        </p>
      </div>

      <div style={S.divider} />

      <div
        style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "32px" }}
      >
        {/* ── LEFT: CONTROLS ── */}
        <div>
          {/* MODE — radio cards */}
          <div style={S.row}>
            <label style={S.label}>Button Mode</label>
            <div
              style={{ display: "flex", flexDirection: "column", gap: "7px" }}
            >
              {MODE_OPTIONS.map((opt) => {
                const active = settings.mode === opt.value;
                return (
                  <div
                    key={opt.value}
                    onClick={() => update("mode", opt.value)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "12px",
                      padding: "10px 14px",
                      borderRadius: "8px",
                      border: `1.5px solid ${active ? "#111" : "#e5e7eb"}`,
                      background: active ? "#fafafa" : "#fff",
                      cursor: "pointer",
                      transition: "all 0.15s",
                    }}
                  >
                    <div
                      style={{
                        width: "16px",
                        height: "16px",
                        borderRadius: "50%",
                        flexShrink: 0,
                        border: `2px solid ${active ? "#111" : "#d1d5db"}`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      {active && (
                        <div
                          style={{
                            width: "8px",
                            height: "8px",
                            borderRadius: "50%",
                            background: "#111",
                          }}
                        />
                      )}
                    </div>
                    <div>
                      <p
                        style={{
                          fontSize: "13px",
                          fontWeight: 600,
                          color: "#111",
                          margin: 0,
                        }}
                      >
                        {opt.label}
                      </p>
                      <p
                        style={{
                          fontSize: "11px",
                          color: "#9ca3af",
                          margin: 0,
                        }}
                      >
                        {opt.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* POSITION */}
          <div style={S.row}>
            <label style={S.label}>Button Position</label>
            <select
              value={settings.position || "below"}
              onChange={(e) => update("position", e.target.value)}
              style={S.select}
            >
              {POSITION_OPTIONS.map((p) => (
                <option key={p.value} value={p.value}>
                  {p.label}
                </option>
              ))}
            </select>
          </div>

          {/* TEXT */}
          <div style={S.row}>
            <label style={S.label}>Button Text</label>
            <input
              value={settings.buttonText}
              onChange={(e) => update("buttonText", e.target.value)}
              placeholder="Buy with Cash on Delivery"
              style={S.input}
            />
          </div>

          {/* COLORS */}
          <div style={S.row}>
            <label style={S.label}>Colors</label>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "10px",
              }}
            >
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
          <div style={S.row}>
            <label style={S.label}>
              Border Radius &nbsp;
              <span
                style={{ color: "#111", fontWeight: 800, fontSize: "13px" }}
              >
                {settings.borderRadius}px
              </span>
            </label>
            <input
              type="range"
              min="0"
              max="30"
              value={settings.borderRadius}
              onChange={(e) => update("borderRadius", Number(e.target.value))}
              style={{ width: "100%", accentColor: "#111" }}
            />
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontSize: "10px",
                color: "#9ca3af",
                marginTop: "2px",
              }}
            >
              <span>Square</span>
              <span>Rounded</span>
              <span>Pill</span>
            </div>
          </div>
        </div>

        {/* ── RIGHT: PREVIEW ── */}
        <div>
          <label style={S.label}>Live Preview</label>

          {/* PHONE MOCKUP */}
          <div
            style={{
              background: "#1a1a1a",
              borderRadius: "28px",
              padding: "16px 12px 20px",
              boxShadow: "0 12px 40px rgba(0,0,0,0.25)",
              maxWidth: "260px",
              margin: "0 auto",
            }}
          >
            {/* notch */}
            <div
              style={{
                width: "60px",
                height: "6px",
                background: "#333",
                borderRadius: "3px",
                margin: "0 auto 14px",
              }}
            />

            {/* product mock */}
            <div
              style={{
                background: "#fff",
                borderRadius: "16px",
                padding: "14px 12px",
              }}
            >
              {/* product image placeholder */}
              <div
                style={{
                  background: "#f3f4f6",
                  borderRadius: "10px",
                  height: "100px",
                  marginBottom: "10px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <span style={{ fontSize: "28px" }}>👟</span>
              </div>
              <p
                style={{
                  fontSize: "12px",
                  fontWeight: 700,
                  color: "#111",
                  marginBottom: "4px",
                }}
              >
                Product Name
              </p>
              <p
                style={{
                  fontSize: "11px",
                  color: "#9ca3af",
                  marginBottom: "12px",
                }}
              >
                Rs. 2,500
              </p>

              {/* BUTTONS */}
              {settings.mode !== "replace" && settings.mode !== "cod_only" && (
                <button
                  style={{
                    width: "100%",
                    padding: "9px",
                    background: "#fff",
                    border: "1.5px solid #d1d5db",
                    borderRadius: `${settings.borderRadius}px`,
                    fontSize: "11px",
                    fontWeight: 500,
                    color: "#374151",
                    marginBottom: "6px",
                    cursor: "default",
                  }}
                >
                  Add to cart
                </button>
              )}

              {settings.mode !== "replace_buy_now" &&
                settings.mode !== "cod_only" && (
                  <button
                    style={{
                      width: "100%",
                      padding: "9px",
                      background: "#111",
                      border: "none",
                      borderRadius: `${settings.borderRadius}px`,
                      fontSize: "11px",
                      fontWeight: 600,
                      color: "#fff",
                      marginBottom: "6px",
                      cursor: "default",
                    }}
                  >
                    Buy it now
                  </button>
                )}

              <button
                style={{
                  width: "100%",
                  padding: "10px",
                  background: settings.bgColor,
                  color: settings.textColor,
                  borderRadius: `${settings.borderRadius}px`,
                  border: "none",
                  fontSize: "11px",
                  fontWeight: 700,
                  cursor: "default",
                }}
              >
                {settings.buttonText || "Buy with Cash on Delivery"}
              </button>
            </div>
          </div>

          {/* mode badge */}
          <div
            style={{
              marginTop: "14px",
              background: "#f0fdf4",
              border: "1px solid #bbf7d0",
              borderRadius: "8px",
              padding: "9px 14px",
              fontSize: "12px",
              color: "#15803d",
              fontWeight: 600,
              maxWidth: "260px",
              margin: "14px auto 0",
              textAlign: "center",
            }}
          >
            ✅ {MODE_OPTIONS.find((m) => m.value === settings.mode)?.label}
          </div>
        </div>
      </div>

      <div style={S.divider} />

      {/* SAVE */}
      <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
        <button
          onClick={handleSave}
          style={{
            background: saved ? "#16a34a" : "#111",
            color: "#fff",
            border: "none",
            borderRadius: "10px",
            padding: "12px 28px",
            fontSize: "14px",
            fontWeight: 700,
            cursor: "pointer",
            transition: "background 0.3s",
          }}
        >
          {saved ? "✅ Saved!" : "Save Settings"}
        </button>
        {saved && (
          <span style={{ fontSize: "13px", color: "#16a34a", fontWeight: 600 }}>
            COD settings updated!
          </span>
        )}
      </div>
    </div>
  );
}

function ColorSwatch({ label, value, onChange }) {
  return (
    <label
      style={{
        display: "flex",
        alignItems: "center",
        gap: "10px",
        padding: "9px 12px",
        border: "1.5px solid #e5e7eb",
        borderRadius: "8px",
        cursor: "pointer",
        background: "#fafafa",
      }}
    >
      <div style={{ position: "relative", flexShrink: 0 }}>
        <div
          style={{
            width: "28px",
            height: "28px",
            borderRadius: "6px",
            background: value,
            border: "2px solid #e5e7eb",
          }}
        />
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          style={{
            position: "absolute",
            inset: 0,
            opacity: 0,
            cursor: "pointer",
            width: "100%",
            height: "100%",
          }}
        />
      </div>
      <div>
        <p
          style={{
            fontSize: "10px",
            fontWeight: 700,
            color: "#6b7280",
            margin: 0,
            textTransform: "uppercase",
          }}
        >
          {label}
        </p>
        <p
          style={{
            fontSize: "12px",
            color: "#111",
            margin: 0,
            fontFamily: "monospace",
          }}
        >
          {value}
        </p>
      </div>
    </label>
  );
}
