const NAV = [
  { key: "cod", icon: "⚙️", label: "COD Button" },
  { key: "form", icon: "📝", label: "Form Builder" },
  { key: "pixels", icon: "📊", label: "Pixels" },
  { key: "thankyou", icon: "🎉", label: "Thank You Page" },
];

export default function Sidebar({ active, setActive }) {
  return (
    <div
      style={{
        width: "220px",
        minWidth: "220px",
        background: "#fff",
        borderRight: "1px solid #f0f0f0",
        padding: "24px 14px",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* LOGO */}
      <div style={{ paddingLeft: "6px", marginBottom: "28px" }}>
        <h2
          style={{
            fontSize: "16px",
            fontWeight: 800,
            color: "#111",
            margin: 0,
          }}
        >
          🚀 ReleaseIt
        </h2>
        <p style={{ fontSize: "11px", color: "#9ca3af", margin: "2px 0 0" }}>
          COD App Dashboard
        </p>
      </div>

      {/* NAV ITEMS */}
      <nav style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
        {NAV.map(({ key, icon, label }) => {
          const isActive = active === key;
          return (
            <button
              key={key}
              onClick={() => setActive(key)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                width: "100%",
                textAlign: "left",
                padding: "10px 12px",
                borderRadius: "9px",
                border: "none",
                cursor: "pointer",
                fontSize: "13px",
                fontWeight: isActive ? 700 : 500,
                background: isActive ? "#111" : "transparent",
                color: isActive ? "#fff" : "#4b5563",
                transition: "all 0.15s",
              }}
              onMouseOver={(e) => {
                if (!isActive) e.currentTarget.style.background = "#f3f4f6";
              }}
              onMouseOut={(e) => {
                if (!isActive) e.currentTarget.style.background = "transparent";
              }}
            >
              <span style={{ fontSize: "15px" }}>{icon}</span>
              {label}
            </button>
          );
        })}
      </nav>
    </div>
  );
}
