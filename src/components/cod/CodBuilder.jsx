import { useState } from "react";

const FIELD_TYPES = [
  { value: "text", label: "Text", icon: "T" },
  { value: "phone", label: "Phone", icon: "📞" },
  { value: "email", label: "Email", icon: "✉️" },
  { value: "number", label: "Number", icon: "#" },
  { value: "select", label: "Dropdown", icon: "▼" },
  { value: "textarea", label: "Text Area", icon: "≡" },
];

const DEFAULT_FIELDS = [
  { id: 1, label: "First Name", type: "text", required: true, placeholder: "" },
  { id: 2, label: "Phone", type: "phone", required: true, placeholder: "" },
];

export default function CodBuilder({
  fields: propFields,
  setFields: setPropFields,
}) {
  const [fields, setFields] = useState(
    propFields?.length ? propFields : DEFAULT_FIELDS,
  );
  const [selectedId, setSelectedId] = useState(null);

  const sync = (newFields) => {
    setFields(newFields);
    if (setPropFields) setPropFields(newFields);
  };

  const addField = () => {
    const newField = {
      id: Date.now(),
      label: "New Field",
      type: "text",
      required: false,
      placeholder: "",
    };
    const updated = [...fields, newField];
    sync(updated);
    setSelectedId(newField.id);
  };

  const updateField = (id, key, value) => {
    sync(fields.map((f) => (f.id === id ? { ...f, [key]: value } : f)));
  };

  const removeField = (id) => {
    sync(fields.filter((f) => f.id !== id));
    if (selectedId === id) setSelectedId(null);
  };

  const moveField = (id, dir) => {
    const idx = fields.findIndex((f) => f.id === id);
    const newIdx = idx + dir;
    if (newIdx < 0 || newIdx >= fields.length) return;
    const arr = [...fields];
    [arr[idx], arr[newIdx]] = [arr[newIdx], arr[idx]];
    sync(arr);
  };

  const selected = fields.find((f) => f.id === selectedId);

  return (
    <div
      style={{
        background: "#fff",
        borderRadius: "16px",
        boxShadow: "0 1px 8px rgba(0,0,0,0.08)",
        padding: "28px",
        maxWidth: "860px",
      }}
    >
      {/* HEADER */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "6px",
        }}
      >
        <div>
          <h2
            style={{
              fontSize: "18px",
              fontWeight: 800,
              color: "#111",
              marginBottom: "4px",
            }}
          >
            📋 Form Builder
          </h2>
          <p style={{ fontSize: "13px", color: "#9ca3af" }}>
            Fields that customers fill in the COD order form.
          </p>
        </div>
        <button
          onClick={addField}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
            background: "#111",
            color: "#fff",
            border: "none",
            borderRadius: "9px",
            padding: "10px 18px",
            fontSize: "13px",
            fontWeight: 700,
            cursor: "pointer",
            transition: "background 0.15s",
            whiteSpace: "nowrap",
          }}
          onMouseOver={(e) => (e.currentTarget.style.background = "#333")}
          onMouseOut={(e) => (e.currentTarget.style.background = "#111")}
        >
          + Add Field
        </button>
      </div>

      <div style={{ borderTop: "1px solid #f3f4f6", margin: "18px 0" }} />

      <div
        style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}
      >
        {/* LEFT — FIELD LIST */}
        <div>
          <p
            style={{
              fontSize: "12px",
              fontWeight: 700,
              color: "#6b7280",
              textTransform: "uppercase",
              letterSpacing: "0.04em",
              marginBottom: "10px",
            }}
          >
            Form Fields
          </p>

          {fields.length === 0 ? (
            <div
              style={{
                textAlign: "center",
                padding: "32px 16px",
                background: "#fafafa",
                borderRadius: "10px",
                border: "1.5px dashed #e5e7eb",
              }}
            >
              <p style={{ fontSize: "22px", marginBottom: "8px" }}>📝</p>
              <p style={{ fontSize: "13px", color: "#9ca3af" }}>
                No fields yet. Click "+ Add Field".
              </p>
            </div>
          ) : (
            <div
              style={{ display: "flex", flexDirection: "column", gap: "6px" }}
            >
              {fields.map((f, idx) => {
                const typeInfo = FIELD_TYPES.find((t) => t.value === f.type);
                const isSelected = f.id === selectedId;

                return (
                  <div
                    key={f.id}
                    onClick={() => setSelectedId(f.id)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      padding: "10px 14px",
                      border: `1.5px solid ${isSelected ? "#111" : "#e5e7eb"}`,
                      borderRadius: "10px",
                      background: isSelected ? "#f9fafb" : "#fff",
                      cursor: "pointer",
                      transition: "all 0.15s",
                    }}
                  >
                    {/* Type badge */}
                    <span
                      style={{
                        width: "28px",
                        height: "28px",
                        borderRadius: "6px",
                        background: "#f3f4f6",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "12px",
                        fontWeight: 700,
                        flexShrink: 0,
                      }}
                    >
                      {typeInfo?.icon || "T"}
                    </span>

                    {/* Label */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p
                        style={{
                          fontSize: "13px",
                          fontWeight: 600,
                          color: "#111",
                          margin: 0,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {f.label}
                      </p>
                      <p
                        style={{
                          fontSize: "11px",
                          color: "#9ca3af",
                          margin: 0,
                        }}
                      >
                        {typeInfo?.label}
                        {f.required ? " · Required" : ""}
                      </p>
                    </div>

                    {/* Actions */}
                    <div style={{ display: "flex", gap: "2px", flexShrink: 0 }}>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          moveField(f.id, -1);
                        }}
                        disabled={idx === 0}
                        style={{ ...iconBtn, opacity: idx === 0 ? 0.3 : 1 }}
                        title="Move up"
                      >
                        ↑
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          moveField(f.id, 1);
                        }}
                        disabled={idx === fields.length - 1}
                        style={{
                          ...iconBtn,
                          opacity: idx === fields.length - 1 ? 0.3 : 1,
                        }}
                        title="Move down"
                      >
                        ↓
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          removeField(f.id);
                        }}
                        style={{ ...iconBtn, color: "#ef4444" }}
                        title="Remove"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* RIGHT — FIELD EDITOR */}
        <div>
          <p
            style={{
              fontSize: "12px",
              fontWeight: 700,
              color: "#6b7280",
              textTransform: "uppercase",
              letterSpacing: "0.04em",
              marginBottom: "10px",
            }}
          >
            Edit Field
          </p>

          {!selected ? (
            <div
              style={{
                background: "#fafafa",
                borderRadius: "10px",
                border: "1.5px dashed #e5e7eb",
                padding: "48px 16px",
                textAlign: "center",
              }}
            >
              <p style={{ fontSize: "22px", marginBottom: "8px" }}>👈</p>
              <p style={{ fontSize: "13px", color: "#9ca3af" }}>
                Select a field to edit
              </p>
            </div>
          ) : (
            <div
              style={{
                background: "#fafafa",
                borderRadius: "12px",
                border: "1.5px solid #e5e7eb",
                padding: "18px",
              }}
            >
              {/* LABEL */}
              <EditorField label="Label">
                <input
                  style={inputStyle}
                  value={selected.label}
                  onChange={(e) =>
                    updateField(selected.id, "label", e.target.value)
                  }
                  placeholder="e.g. Full Name"
                />
              </EditorField>

              {/* PLACEHOLDER */}
              <EditorField label="Placeholder">
                <input
                  style={inputStyle}
                  value={selected.placeholder || ""}
                  onChange={(e) =>
                    updateField(selected.id, "placeholder", e.target.value)
                  }
                  placeholder="e.g. Enter your name"
                />
              </EditorField>

              {/* TYPE */}
              <EditorField label="Field Type">
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "6px",
                  }}
                >
                  {FIELD_TYPES.map((t) => (
                    <label
                      key={t.value}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        padding: "8px 10px",
                        border: `1.5px solid ${selected.type === t.value ? "#111" : "#e5e7eb"}`,
                        borderRadius: "8px",
                        background:
                          selected.type === t.value ? "#fff" : "transparent",
                        cursor: "pointer",
                        fontSize: "12px",
                        fontWeight: 500,
                      }}
                    >
                      <input
                        type="radio"
                        name={`type-${selected.id}`}
                        value={t.value}
                        checked={selected.type === t.value}
                        onChange={() =>
                          updateField(selected.id, "type", t.value)
                        }
                        style={{ accentColor: "#111" }}
                      />
                      {t.icon} {t.label}
                    </label>
                  ))}
                </div>
              </EditorField>

              {/* DROPDOWN OPTIONS */}
              {selected.type === "select" && (
                <EditorField label="Options (one per line)">
                  <textarea
                    rows={4}
                    style={{ ...inputStyle, resize: "vertical" }}
                    value={(selected.options || []).join("\n")}
                    onChange={(e) =>
                      updateField(
                        selected.id,
                        "options",
                        e.target.value.split("\n").filter(Boolean),
                      )
                    }
                    placeholder={"Option 1\nOption 2\nOption 3"}
                  />
                </EditorField>
              )}

              {/* REQUIRED TOGGLE */}
              <label
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  padding: "10px 12px",
                  background: "#fff",
                  borderRadius: "8px",
                  border: "1.5px solid #e5e7eb",
                  cursor: "pointer",
                  marginTop: "4px",
                }}
              >
                <input
                  type="checkbox"
                  checked={selected.required}
                  onChange={(e) =>
                    updateField(selected.id, "required", e.target.checked)
                  }
                  style={{ width: "16px", height: "16px", accentColor: "#111" }}
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
                    Required
                  </p>
                  <p style={{ fontSize: "11px", color: "#9ca3af", margin: 0 }}>
                    Customer must fill this field
                  </p>
                </div>
              </label>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ===== HELPERS ===== */
function EditorField({ label, children }) {
  return (
    <div style={{ marginBottom: "14px" }}>
      <label
        style={{
          fontSize: "11px",
          fontWeight: 700,
          color: "#6b7280",
          display: "block",
          marginBottom: "5px",
          textTransform: "uppercase",
          letterSpacing: "0.04em",
        }}
      >
        {label}
      </label>
      {children}
    </div>
  );
}

const inputStyle = {
  width: "100%",
  padding: "9px 12px",
  border: "1.5px solid #e5e7eb",
  borderRadius: "8px",
  fontSize: "13px",
  boxSizing: "border-box",
  background: "#fff",
  fontFamily: "inherit",
};

const iconBtn = {
  width: "26px",
  height: "26px",
  border: "none",
  background: "none",
  cursor: "pointer",
  borderRadius: "5px",
  fontSize: "13px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: "#6b7280",
  transition: "background 0.1s",
};
