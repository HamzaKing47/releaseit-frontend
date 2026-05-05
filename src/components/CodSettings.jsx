import { useState } from "react";

const S = {
  card: {
    background: "#fff",
    borderRadius: "16px",
    boxShadow: "0 1px 8px rgba(0,0,0,0.08)",
    padding: "28px",
    maxWidth: "860px",
  },
  label: {
    fontSize: "12px",
    fontWeight: 700,
    color: "#6b7280",
    display: "block",
    marginBottom: "6px",
    textTransform: "uppercase",
    letterSpacing: "0.04em",
  },
  input: {
    width: "100%",
    padding: "10px 14px",
    border: "1.5px solid #e5e7eb",
    borderRadius: "9px",
    fontSize: "14px",
    boxSizing: "border-box",
    outline: "none",
    transition: "border 0.15s",
    fontFamily: "inherit",
    background: "#fafafa",
  },
  select: {
    width: "100%",
    padding: "10px 14px",
    border: "1.5px solid #e5e7eb",
    borderRadius: "9px",
    fontSize: "14px",
    boxSizing: "border-box",
    background: "#fafafa",
    cursor: "pointer",
    fontFamily: "inherit",
  },
  divider: {
    borderTop: "1px solid #f3f4f6",
    margin: "22px 0",
  },
  row: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "18px",
    marginBottom: "18px",
  },
  group: { marginBottom: "18px" },
};

export default function CodSettings({ settings, update, save }) {
  const [saved, setSaved] = useState(false);

  const handleSave = async () => {
    await save();
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const MODE_OPTIONS = [
    {
      value: "both",
      label: "Show All Buttons",
      desc: "Add to cart + Buy Now + COD",
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
    {
      value: "cod_only",
      label: "COD Button Only",
      desc: "Hide all other buttons",
    },
  ];

  const POSITION_OPTIONS = [
    { value: "below", label: "Below Add to Cart" },
    { value: "above", label: "Above Add to Cart" },
    { value: "below_buy_now", label: "Below Buy Now" },
  ];

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
          Customize how the Cash on Delivery button appears on your store.
        </p>
      </div>

      <div style={S.divider} />

      {/* TWO COLUMN LAYOUT */}
      <div
        style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "32px" }}
      >
        {/* LEFT — CONTROLS */}
        <div>
          {/* BUTTON MODE */}
          <div style={S.group}>
            <label style={S.label}>Button Mode</label>
            <div
              style={{ display: "flex", flexDirection: "column", gap: "8px" }}
            >
              {MODE_OPTIONS.map((opt) => (
                <label
                  key={opt.value}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    padding: "10px 14px",
                    border: `1.5px solid ${settings.mode === opt.value ? "#111" : "#e5e7eb"}`,
                    borderRadius: "10px",
                    cursor: "pointer",
                    background:
                      settings.mode === opt.value ? "#f9fafb" : "#fff",
                    transition: "all 0.15s",
                  }}
                >
                  <input
                    type="radio"
                    name="mode"
                    value={opt.value}
                    checked={settings.mode === opt.value}
                    onChange={() => update("mode", opt.value)}
                    style={{ accentColor: "#111" }}
                  />
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
                      style={{ fontSize: "11px", color: "#9ca3af", margin: 0 }}
                    >
                      {opt.desc}
                    </p>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* BUTTON POSITION */}
          <div style={S.group}>
            <label style={S.label}>Button Position</label>
            <select
              value={settings.position || "below"}
              onChange={(e) => update("position", e.target.value)}
              style={S.select}
            >
              {POSITION_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>

          {/* BUTTON TEXT */}
          <div style={S.group}>
            <label style={S.label}>Button Text</label>
            <input
              style={S.input}
              value={settings.buttonText}
              placeholder="e.g. Buy with Cash on Delivery"
              onChange={(e) => update("buttonText", e.target.value)}
            />
          </div>

          {/* COLORS */}
          <div style={{ ...S.row, marginBottom: "18px" }}>
            <div>
              <label style={S.label}>Background Color</label>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  padding: "8px 12px",
                  border: "1.5px solid #e5e7eb",
                  borderRadius: "9px",
                  background: "#fafafa",
                }}
              >
                <input
                  type="color"
                  value={settings.bgColor}
                  onChange={(e) => update("bgColor", e.target.value)}
                  style={{
                    width: "32px",
                    height: "32px",
                    border: "none",
                    cursor: "pointer",
                    background: "none",
                  }}
                />
                <span
                  style={{
                    fontSize: "13px",
                    color: "#374151",
                    fontFamily: "monospace",
                  }}
                >
                  {settings.bgColor}
                </span>
              </div>
            </div>
            <div>
              <label style={S.label}>Text Color</label>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  padding: "8px 12px",
                  border: "1.5px solid #e5e7eb",
                  borderRadius: "9px",
                  background: "#fafafa",
                }}
              >
                <input
                  type="color"
                  value={settings.textColor}
                  onChange={(e) => update("textColor", e.target.value)}
                  style={{
                    width: "32px",
                    height: "32px",
                    border: "none",
                    cursor: "pointer",
                    background: "none",
                  }}
                />
                <span
                  style={{
                    fontSize: "13px",
                    color: "#374151",
                    fontFamily: "monospace",
                  }}
                >
                  {settings.textColor}
                </span>
              </div>
            </div>
          </div>

          {/* BORDER RADIUS */}
          <div style={S.group}>
            <label style={S.label}>
              Border Radius
              <span
                style={{
                  fontWeight: 400,
                  color: "#9ca3af",
                  marginLeft: "6px",
                  textTransform: "none",
                  letterSpacing: 0,
                }}
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

        {/* RIGHT — LIVE PREVIEW */}
        <div>
          <label style={S.label}>Live Preview</label>
          <div
            style={{
              background: "#f3f4f6",
              borderRadius: "14px",
              padding: "28px 20px",
              border: "1px solid #e5e7eb",
            }}
          >
            {/* Simulated product image */}
            <div
              style={{
                width: "100%",
                height: "120px",
                background: "#e5e7eb",
                borderRadius: "10px",
                marginBottom: "16px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <span style={{ fontSize: "28px" }}>🛍️</span>
            </div>

            {/* Add to Cart */}
            {settings.mode !== "replace" && settings.mode !== "cod_only" && (
              <button
                style={{
                  width: "100%",
                  padding: "13px",
                  marginBottom: "8px",
                  border: "1.5px solid #d1d5db",
                  borderRadius: "8px",
                  background: "#fff",
                  fontSize: "14px",
                  fontWeight: 500,
                  cursor: "default",
                }}
              >
                Add to cart
              </button>
            )}

            {/* Buy Now */}
            {settings.mode !== "replace_buy_now" &&
              settings.mode !== "cod_only" && (
                <button
                  style={{
                    width: "100%",
                    padding: "13px",
                    marginBottom: "8px",
                    border: "none",
                    borderRadius: "8px",
                    background: "#111",
                    color: "#fff",
                    fontSize: "14px",
                    fontWeight: 500,
                    cursor: "default",
                  }}
                >
                  Buy it now
                </button>
              )}

            {/* COD Button — position preview simplified */}
            <button
              style={{
                width: "100%",
                padding: "14px",
                background: settings.bgColor,
                color: settings.textColor,
                borderRadius: `${settings.borderRadius}px`,
                border: `2px solid ${settings.bgColor}`,
                fontWeight: 700,
                fontSize: "14px",
                cursor: "default",
                transition: "all 0.2s",
              }}
            >
              {settings.buttonText || "Buy with Cash on Delivery"}
            </button>
          </div>

          {/* Color swatches quick pick */}
          <div style={{ marginTop: "14px" }}>
            <label style={{ ...S.label, marginBottom: "8px" }}>
              Quick Colors
            </label>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
              {[
                ["#000000", "#ffffff"],
                ["#e53e3e", "#ffffff"],
                ["#2563eb", "#ffffff"],
                ["#16a34a", "#ffffff"],
                ["#7c3aed", "#ffffff"],
                ["#ea580c", "#ffffff"],
                ["#ffffff", "#000000"],
              ].map(([bg, text]) => (
                <button
                  key={bg}
                  onClick={() => {
                    update("bgColor", bg);
                    update("textColor", text);
                  }}
                  title={bg}
                  style={{
                    width: "28px",
                    height: "28px",
                    background: bg,
                    border:
                      settings.bgColor === bg
                        ? "2px solid #111"
                        : "1.5px solid #e5e7eb",
                    borderRadius: "6px",
                    cursor: "pointer",
                    boxShadow:
                      settings.bgColor === bg
                        ? "0 0 0 2px #fff, 0 0 0 4px #111"
                        : "none",
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      <div style={S.divider} />

      {/* SAVE */}
      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        <button
          onClick={handleSave}
          style={{
            background: saved ? "#16a34a" : "#111",
            color: "#fff",
            border: "none",
            borderRadius: "9px",
            padding: "11px 26px",
            fontSize: "14px",
            fontWeight: 700,
            cursor: "pointer",
            transition: "background 0.3s",
          }}
        >
          {saved ? "✅ Saved!" : "Save Settings"}
        </button>
        {saved && (
          <span style={{ fontSize: "13px", color: "#16a34a", fontWeight: 500 }}>
            Changes applied to your store.
          </span>
        )}
      </div>
    </div>
  );
}
