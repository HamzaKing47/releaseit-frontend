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
  const [previewLang, setPreviewLang] = useState("en");

  const ty = settings.thankYou || DEFAULTS;
  const updateTY = (key, val) => {
    update("thankYou", { ...ty, [key]: val });
  };

  const handleSave = async () => {
    await save();
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const EXAMPLES = {
    en: {
      heading: "Order Confirmed!",
      subtext: "Thank you! Your order has been placed successfully.",
      note: "Our team will contact you soon to confirm your order.",
      buttonText: "Back to Store",
    },
    ur: {
      heading: "آرڈر کامیاب ہو گیا! 🎉",
      subtext: "شکریہ! آپ کا آرڈر کامیابی سے رجسٹر ہو گیا ہے۔",
      note: "ہماری ٹیم جلد آپ سے رابطہ کرے گی۔",
      buttonText: "واپس اسٹور پر جائیں",
    },
    roman: {
      heading: "Order Aa Gaya! 🎉",
      subtext: "Shukriya! Aapka order successfully place ho gaya.",
      note: "Hamari team jald hi aapse rabta karegi.",
      buttonText: "Store Par Wapis Jayen",
    },
    ar: {
      heading: "تم تأكيد الطلب! 🎉",
      subtext: "شكراً لك! تم تقديم طلبك بنجاح.",
      note: "سيتصل بك فريقنا قريباً لتأكيد طلبك.",
      buttonText: "العودة إلى المتجر",
    },
    tr: {
      heading: "Siparişiniz Onaylandı! 🎉",
      subtext: "Teşekkürler! Siparişiniz başarıyla alındı.",
      note: "Ekibimiz siparişinizi onaylamak için yakında sizinle iletişime geçecek.",
      buttonText: "Mağazaya Dön",
    },
  };

  const applyExample = (lang) => {
    const ex = EXAMPLES[lang];
    Object.entries(ex).forEach(([k, v]) => updateTY(k, v));
    setPreviewLang(lang);
  };

  return (
    <div
      style={{
        background: "#fff",
        borderRadius: "16px",
        boxShadow: "0 2px 12px rgba(0,0,0,0.07)",
        padding: "28px",
        maxWidth: "800px",
      }}
    >
      {/* HEADING */}
      <h2 style={{ fontSize: "20px", fontWeight: 700, color: "#111", marginBottom: "4px" }}>
        🎉 Thank You Page
      </h2>
      <p style={{ fontSize: "13px", color: "#6b7280", marginBottom: "20px" }}>
        Customize the text shown to customers after order is placed. Any language works!
      </p>

      <div style={{ borderTop: "1px solid #f0f0f0", marginBottom: "20px" }} />

      {/* QUICK LANGUAGE EXAMPLES */}
      <div style={{ marginBottom: "22px" }}>
        <p style={{ fontSize: "12px", fontWeight: 700, color: "#6b7280", marginBottom: "8px" }}>
          ⚡ Quick Fill — Example Languages:
        </p>
        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
          {[
            { key: "en", label: "🇬🇧 English" },
            { key: "roman", label: "🇵🇰 Roman Urdu" },
            { key: "ur", label: "🇵🇰 اردو" },
            { key: "ar", label: "🇸🇦 Arabic" },
            { key: "tr", label: "🇹🇷 Turkish" },
          ].map(({ key, label }) => (
            <button
              key={key}
              onClick={() => applyExample(key)}
              style={{
                padding: "6px 14px",
                borderRadius: "20px",
                border: "1px solid #e5e7eb",
                background: previewLang === key ? "#111" : "#f9fafb",
                color: previewLang === key ? "#fff" : "#374151",
                fontSize: "12px",
                fontWeight: 600,
                cursor: "pointer",
                transition: "all 0.15s",
              }}
            >
              {label}
            </button>
          ))}
        </div>
        <p style={{ fontSize: "11px", color: "#9ca3af", marginTop: "6px" }}>
          Click to auto-fill fields. You can edit them after.
        </p>
      </div>

      {/* TWO COLUMN: FIELDS + PREVIEW */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "28px" }}>

        {/* LEFT — FIELDS */}
        <div>
          <Field
            label="Heading"
            placeholder="e.g. Order Confirmed!"
            value={ty.heading ?? DEFAULTS.heading}
            onChange={(v) => updateTY("heading", v)}
          />
          <Field
            label="Sub Text"
            placeholder="e.g. Thank you! Your order has been placed."
            value={ty.subtext ?? DEFAULTS.subtext}
            onChange={(v) => updateTY("subtext", v)}
            multiline
          />
          <Field
            label="Note (small text)"
            placeholder="e.g. Our team will contact you soon."
            value={ty.note ?? DEFAULTS.note}
            onChange={(v) => updateTY("note", v)}
            multiline
          />
          <Field
            label="Button Text"
            placeholder="e.g. Back to Store"
            value={ty.buttonText ?? DEFAULTS.buttonText}
            onChange={(v) => updateTY("buttonText", v)}
          />

          {/* COLORS */}
          <div style={{ marginTop: "16px" }}>
            <p style={{ fontSize: "12px", fontWeight: 700, color: "#6b7280", marginBottom: "10px" }}>
              🎨 Colors
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
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
                label="Heading Color"
                value={ty.headingColor ?? DEFAULTS.headingColor}
                onChange={(v) => updateTY("headingColor", v)}
              />
              <ColorPicker
                label="Text Color"
                value={ty.textColor ?? DEFAULTS.textColor}
                onChange={(v) => updateTY("textColor", v)}
              />
            </div>
          </div>
        </div>

        {/* RIGHT — LIVE PREVIEW */}
        <div>
          <p style={{ fontSize: "12px", fontWeight: 700, color: "#6b7280", marginBottom: "10px" }}>
            👁️ Live Preview
          </p>
          <div
            style={{
              background: ty.bgColor ?? DEFAULTS.bgColor,
              borderRadius: "12px",
              padding: "24px 16px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              minHeight: "280px",
              border: "1px solid #e5e7eb",
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
              <p style={{ color: ty.textColor ?? DEFAULTS.textColor, fontSize: "13px", marginBottom: "6px" }}>
                {ty.subtext || DEFAULTS.subtext}
              </p>
              <p style={{ color: "#9ca3af", fontSize: "11px", marginBottom: "16px" }}>
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

      {/* SAVE */}
      <div
        style={{
          borderTop: "1px solid #f0f0f0",
          marginTop: "24px",
          paddingTop: "20px",
          display: "flex",
          alignItems: "center",
          gap: "12px",
        }}
      >
        <button
          onClick={handleSave}
          style={{
            background: saved ? "#16a34a" : "#111",
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
          {saved ? "✅ Saved!" : "Save Settings"}
        </button>
        {saved && (
          <span style={{ fontSize: "13px", color: "#16a34a" }}>
            Thank You page updated!
          </span>
        )}
      </div>
    </div>
  );
}

/* ============================================================
   HELPER COMPONENTS
============================================================ */
function Field({ label, placeholder, value, onChange, multiline }) {
  const style = {
    width: "100%",
    padding: "10px 12px",
    border: "1px solid #d1d5db",
    borderRadius: "8px",
    fontSize: "13px",
    boxSizing: "border-box",
    resize: "vertical",
    fontFamily: "inherit",
  };

  return (
    <div style={{ marginBottom: "14px" }}>
      <label
        style={{
          fontSize: "12px",
          fontWeight: 600,
          color: "#6b7280",
          display: "block",
          marginBottom: "5px",
        }}
      >
        {label}
      </label>
      {multiline ? (
        <textarea
          rows={2}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          style={style}
        />
      ) : (
        <input
          type="text"
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          style={style}
        />
      )}
    </div>
  );
}

function ColorPicker({ label, value, onChange }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "8px",
        background: "#f9fafb",
        border: "1px solid #e5e7eb",
        borderRadius: "8px",
        padding: "8px 10px",
      }}
    >
      <input
        type="color"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{ width: "28px", height: "28px", border: "none", cursor: "pointer", background: "none" }}
      />
      <span style={{ fontSize: "11px", color: "#6b7280", fontWeight: 600 }}>{label}</span>
    </div>
  );
}
