export default function Sidebar({ active, setActive }) {
  const item = (key, label) => (
    <button
      onClick={() => setActive(key)}
      style={{
        width: "100%",
        textAlign: "left",
        padding: "10px 14px",
        borderRadius: "8px",
        marginBottom: "4px",
        border: "none",
        cursor: "pointer",
        fontSize: "13px",
        fontWeight: active === key ? 700 : 500,
        background: active === key ? "#111" : "transparent",
        color: active === key ? "#fff" : "#4b5563",
        transition: "all 0.15s",
      }}
      onMouseOver={(e) => {
        if (active !== key) e.currentTarget.style.background = "#f3f4f6";
      }}
      onMouseOut={(e) => {
        if (active !== key) e.currentTarget.style.background = "transparent";
      }}
    >
      {label}
    </button>
  );

  return (
    <div
      style={{
        width: "220px",
        minWidth: "220px",
        background: "#fff",
        borderRight: "1px solid #f0f0f0",
        padding: "24px 16px",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <h2 style={{ fontSize: "17px", fontWeight: 800, color: "#111", marginBottom: "24px", paddingLeft: "4px" }}>
        🚀 ReleaseIt
      </h2>

      {item("cod", "⚙️ COD Button")}
      {item("pixels", "📊 Pixels")}
      {item("thankyou", "🎉 Thank You Page")}
    </div>
  );
}
