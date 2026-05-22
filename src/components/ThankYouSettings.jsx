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
    <div
      style={{
        background: "#fff",
        borderRadius: "16px",
        boxShadow: "0 1px 8px rgba(0,0,0,0.07)",
        padding: "28px",
      }}
    >
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
          🎉 Thank You Page
        </h2>
        <p style={{ fontSize: "13px", color: "#9ca3af" }}>
          Customize the message shown to customers after order is placed. Any
          language works.
        </p>
      </div>

      <div style={{ borderTop: "1px solid #f3f4f6", marginBottom: "22px" }} />

      {/* TWO COLUMN */}
      <div
        style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "32px" }}
      >
        {/* LEFT — FIELDS */}
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
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
            <label style={labelStyle}>Colors</label>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "10px",
              }}
            >
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
          <label style={labelStyle}>Live Preview</label>
          <div
            style={{
              background: ty.bgColor ?? DEFAULTS.bgColor,
              borderRadius: "14px",
              padding: "28px 20px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              minHeight: "300px",
              border: "1px solid #e5e7eb",
              transition: "background 0.2s",
            }}
          >
            <div
              style={{
                background: ty.cardColor ?? DEFAULTS.cardColor,
                borderRadius: "14px",
                padding: "24px 20px",
                textAlign: "center",
                width: "100%",
                boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
              }}
            >
              <div
                style={{
                  width: "48px",
                  height: "48px",
                  borderRadius: "50%",
                  background: (ty.headingColor ?? DEFAULTS.headingColor) + "20",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 12px",
                  fontSize: "22px",
                }}
              >
                ✅
              </div>

              <h3
                style={{
                  color: ty.headingColor ?? DEFAULTS.headingColor,
                  fontWeight: 700,
                  fontSize: "16px",
                  marginBottom: "8px",
                }}
              >
                {ty.heading || DEFAULTS.heading}
              </h3>
              <p
                style={{
                  color: ty.textColor ?? DEFAULTS.textColor,
                  fontSize: "13px",
                  marginBottom: "6px",
                  lineHeight: 1.5,
                }}
              >
                {ty.subtext || DEFAULTS.subtext}
              </p>
              <p
                style={{
                  color: "#9ca3af",
                  fontSize: "11px",
                  marginBottom: "16px",
                  lineHeight: 1.5,
                }}
              >
                {ty.note || DEFAULTS.note}
              </p>
              <div
                style={{
                  background: "#111",
                  color: "#fff",
                  borderRadius: "8px",
                  padding: "8px 18px",
                  fontSize: "12px",
                  fontWeight: 600,
                  display: "inline-block",
                }}
              >
                {ty.buttonText || DEFAULTS.buttonText}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div style={{ borderTop: "1px solid #f3f4f6", margin: "24px 0" }} />

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
            Thank You page updated!
          </span>
        )}
      </div>
    </div>
  );
}

/* ── HELPERS ── */
const labelStyle = {
  fontSize: "11px",
  fontWeight: 700,
  color: "#6b7280",
  display: "block",
  marginBottom: "6px",
  textTransform: "uppercase",
  letterSpacing: "0.05em",
};

function Field({ label, value, onChange, placeholder, multiline }) {
  const style = {
    width: "100%",
    padding: "10px 12px",
    border: "1.5px solid #e5e7eb",
    borderRadius: "8px",
    fontSize: "13px",
    color: "#111",
    boxSizing: "border-box",
    background: "#fafafa",
    fontFamily: "inherit",
    resize: "vertical",
  };
  return (
    <div>
      <label style={labelStyle}>{label}</label>
      {multiline ? (
        <textarea
          rows={2}
          value={value}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
          style={style}
        />
      ) : (
        <input
          type="text"
          value={value}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
          style={style}
        />
      )}
    </div>
  );
}

function ColorPicker({ label, value, onChange }) {
  return (
    <label
      style={{
        display: "flex",
        alignItems: "center",
        gap: "8px",
        padding: "8px 10px",
        border: "1.5px solid #e5e7eb",
        borderRadius: "8px",
        cursor: "pointer",
        background: "#fafafa",
      }}
    >
      <div style={{ position: "relative" }}>
        <div
          style={{
            width: "26px",
            height: "26px",
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
            fontSize: "11px",
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
