import { useState } from "react";

const FIELD_TYPES = [
  { value: "text", label: "📝 Text", desc: "Single line text" },
  { value: "phone", label: "📱 Phone", desc: "Phone number input" },
  { value: "email", label: "📧 Email", desc: "Email address" },
  { value: "number", label: "🔢 Number", desc: "Numeric input" },
  { value: "select", label: "🔽 Dropdown", desc: "Multiple options" },
  { value: "textarea", label: "📄 Textarea", desc: "Multi-line text" },
  { value: "hidden", label: "👁️ Hidden", desc: "Not visible to user" },
];

const TYPE_ICONS = {
  text: "📝",
  phone: "📱",
  email: "📧",
  number: "🔢",
  select: "🔽",
  textarea: "📄",
  hidden: "👁️",
};

const DEFAULT_FIELDS = [
  {
    id: 1,
    label: "First Name",
    type: "text",
    required: true,
    placeholder: "Enter your first name",
  },
  {
    id: 2,
    label: "Phone",
    type: "phone",
    required: true,
    placeholder: "03XX-XXXXXXX",
  },
  {
    id: 3,
    label: "Address",
    type: "text",
    required: true,
    placeholder: "Enter your address",
  },
  {
    id: 4,
    label: "City",
    type: "text",
    required: false,
    placeholder: "Enter your city",
  },
];

export default function CodBuilder({
  fields: propFields,
  setFields: setPropFields,
  save,
}) {
  const [fields, setFieldsLocal] = useState(
    propFields?.length ? propFields : DEFAULT_FIELDS,
  );
  const [selected, setSelected] = useState(null);
  const [saved, setSaved] = useState(false);

  const setFields = (val) => {
    setFieldsLocal(val);
    if (setPropFields) setPropFields(val);
  };

  const addField = () => {
    const f = {
      id: Date.now(),
      label: "New Field",
      type: "text",
      required: false,
      placeholder: "",
    };
    const updated = [...fields, f];
    setFields(updated);
    setSelected(f);
  };

  const updateField = (id, key, value) => {
    const updated = fields.map((f) =>
      f.id === id ? { ...f, [key]: value } : f,
    );
    setFields(updated);
    if (selected?.id === id) setSelected((prev) => ({ ...prev, [key]: value }));
  };

  const removeField = (id) => {
    setFields(fields.filter((f) => f.id !== id));
    if (selected?.id === id) setSelected(null);
  };

  const moveField = (index, dir) => {
    const arr = [...fields];
    const swapIdx = index + dir;
    if (swapIdx < 0 || swapIdx >= arr.length) return;
    [arr[index], arr[swapIdx]] = [arr[swapIdx], arr[index]];
    setFields(arr);
  };

  const handleSave = async () => {
    if (save) await save();
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
        maxWidth: "860px",
      }}
    >
      {/* HEADER */}
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          marginBottom: "22px",
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
            📝 Form Builder
          </h2>
          <p style={{ fontSize: "13px", color: "#9ca3af" }}>
            Design your COD order form. Add, edit, and reorder fields.
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
            whiteSpace: "nowrap",
          }}
          onMouseOver={(e) => (e.currentTarget.style.background = "#333")}
          onMouseOut={(e) => (e.currentTarget.style.background = "#111")}
        >
          + Add Field
        </button>
      </div>

      <div style={{ borderTop: "1px solid #f3f4f6", marginBottom: "22px" }} />

      {/* TWO COLUMN */}
      <div
        style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}
      >
        {/* ── LEFT: FIELD LIST ── */}
        <div>
          <p
            style={{
              fontSize: "11px",
              fontWeight: 700,
              color: "#6b7280",
              textTransform: "uppercase",
              letterSpacing: "0.05em",
              marginBottom: "10px",
            }}
          >
            Fields ({fields.length})
          </p>

          {fields.length === 0 ? (
            <div
              style={{
                border: "2px dashed #e5e7eb",
                borderRadius: "10px",
                padding: "32px",
                textAlign: "center",
              }}
            >
              <p style={{ fontSize: "24px", marginBottom: "8px" }}>📋</p>
              <p style={{ fontSize: "13px", color: "#9ca3af" }}>
                No fields yet. Click "+ Add Field".
              </p>
            </div>
          ) : (
            <div
              style={{ display: "flex", flexDirection: "column", gap: "6px" }}
            >
              {fields.map((f, idx) => {
                const isSelected = selected?.id === f.id;
                return (
                  <div
                    key={f.id}
                    onClick={() => setSelected(f)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      padding: "11px 14px",
                      borderRadius: "9px",
                      border: `1.5px solid ${isSelected ? "#111" : "#e5e7eb"}`,
                      background: isSelected ? "#f9fafb" : "#fff",
                      cursor: "pointer",
                      transition: "all 0.12s",
                    }}
                  >
                    {/* drag handle / order buttons */}
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "2px",
                      }}
                    >
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          moveField(idx, -1);
                        }}
                        disabled={idx === 0}
                        style={{
                          background: "none",
                          border: "none",
                          cursor: idx === 0 ? "default" : "pointer",
                          color: idx === 0 ? "#d1d5db" : "#6b7280",
                          fontSize: "10px",
                          padding: "0",
                          lineHeight: 1,
                        }}
                      >
                        ▲
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          moveField(idx, 1);
                        }}
                        disabled={idx === fields.length - 1}
                        style={{
                          background: "none",
                          border: "none",
                          cursor:
                            idx === fields.length - 1 ? "default" : "pointer",
                          color:
                            idx === fields.length - 1 ? "#d1d5db" : "#6b7280",
                          fontSize: "10px",
                          padding: "0",
                          lineHeight: 1,
                        }}
                      >
                        ▼
                      </button>
                    </div>

                    {/* icon */}
                    <span style={{ fontSize: "16px", flexShrink: 0 }}>
                      {TYPE_ICONS[f.type] || "📝"}
                    </span>

                    {/* info */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p
                        style={{
                          fontSize: "13px",
                          fontWeight: 600,
                          color: "#111",
                          margin: 0,
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
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
                        {f.type}
                        {f.required ? " · required" : ""}
                      </p>
                    </div>

                    {/* remove */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        removeField(f.id);
                      }}
                      style={{
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        color: "#ef4444",
                        fontSize: "14px",
                        padding: "2px 4px",
                        borderRadius: "4px",
                        flexShrink: 0,
                      }}
                      onMouseOver={(e) =>
                        (e.currentTarget.style.background = "#fef2f2")
                      }
                      onMouseOut={(e) =>
                        (e.currentTarget.style.background = "none")
                      }
                    >
                      ✕
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* ── RIGHT: EDITOR ── */}
        <div>
          <p
            style={{
              fontSize: "11px",
              fontWeight: 700,
              color: "#6b7280",
              textTransform: "uppercase",
              letterSpacing: "0.05em",
              marginBottom: "10px",
            }}
          >
            Edit Field
          </p>

          {!selected ? (
            <div
              style={{
                border: "2px dashed #e5e7eb",
                borderRadius: "10px",
                padding: "48px 20px",
                textAlign: "center",
              }}
            >
              <p style={{ fontSize: "24px", marginBottom: "8px" }}>👈</p>
              <p style={{ fontSize: "13px", color: "#9ca3af" }}>
                Select a field from the left to edit it.
              </p>
            </div>
          ) : (
            <div
              style={{
                border: "1.5px solid #e5e7eb",
                borderRadius: "10px",
                padding: "18px",
                display: "flex",
                flexDirection: "column",
                gap: "16px",
              }}
            >
              {/* LABEL */}
              <EditorField label="Label">
                <input
                  value={selected.label}
                  onChange={(e) =>
                    updateField(selected.id, "label", e.target.value)
                  }
                  style={inputStyle}
                />
              </EditorField>

              {/* PLACEHOLDER */}
              <EditorField label="Placeholder">
                <input
                  value={selected.placeholder || ""}
                  onChange={(e) =>
                    updateField(selected.id, "placeholder", e.target.value)
                  }
                  placeholder="Hint text shown inside field"
                  style={inputStyle}
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
                  {FIELD_TYPES.map((t) => {
                    const active = selected.type === t.value;
                    return (
                      <div
                        key={t.value}
                        onClick={() =>
                          updateField(selected.id, "type", t.value)
                        }
                        style={{
                          padding: "8px 10px",
                          borderRadius: "7px",
                          border: `1.5px solid ${active ? "#111" : "#e5e7eb"}`,
                          background: active ? "#111" : "#fff",
                          cursor: "pointer",
                          transition: "all 0.12s",
                        }}
                      >
                        <p
                          style={{
                            fontSize: "12px",
                            fontWeight: 600,
                            color: active ? "#fff" : "#111",
                            margin: 0,
                          }}
                        >
                          {t.label}
                        </p>
                        <p
                          style={{
                            fontSize: "10px",
                            color: active ? "#ccc" : "#9ca3af",
                            margin: 0,
                          }}
                        >
                          {t.desc}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </EditorField>

              {/* DROPDOWN OPTIONS */}
              {selected.type === "select" && (
                <EditorField label="Options (one per line)">
                  <textarea
                    rows={4}
                    value={(selected.options || []).join("\n")}
                    onChange={(e) =>
                      updateField(
                        selected.id,
                        "options",
                        e.target.value.split("\n"),
                      )
                    }
                    placeholder={"Option 1\nOption 2\nOption 3"}
                    style={{ ...inputStyle, resize: "vertical" }}
                  />
                </EditorField>
              )}

              {/* REQUIRED TOGGLE */}
              <div
                onClick={() =>
                  updateField(selected.id, "required", !selected.required)
                }
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "12px 14px",
                  borderRadius: "8px",
                  border: "1.5px solid #e5e7eb",
                  cursor: "pointer",
                  background: "#fafafa",
                }}
              >
                <div>
                  <p
                    style={{
                      fontSize: "13px",
                      fontWeight: 600,
                      color: "#111",
                      margin: 0,
                    }}
                  >
                    Required field
                  </p>
                  <p style={{ fontSize: "11px", color: "#9ca3af", margin: 0 }}>
                    Customer must fill this field
                  </p>
                </div>
                {/* toggle pill */}
                <div
                  style={{
                    width: "40px",
                    height: "22px",
                    borderRadius: "11px",
                    background: selected.required ? "#111" : "#d1d5db",
                    position: "relative",
                    transition: "background 0.2s",
                    flexShrink: 0,
                  }}
                >
                  <div
                    style={{
                      position: "absolute",
                      top: "3px",
                      left: selected.required ? "21px" : "3px",
                      width: "16px",
                      height: "16px",
                      borderRadius: "50%",
                      background: "#fff",
                      transition: "left 0.2s",
                      boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
                    }}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* FORM PREVIEW */}
      {fields.length > 0 && (
        <>
          <div style={{ borderTop: "1px solid #f3f4f6", margin: "24px 0" }} />
          <div>
            <p
              style={{
                fontSize: "11px",
                fontWeight: 700,
                color: "#6b7280",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
                marginBottom: "12px",
              }}
            >
              Form Preview
            </p>
            <div
              style={{
                background: "#f9fafb",
                borderRadius: "12px",
                padding: "20px",
                border: "1px solid #e5e7eb",
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "12px",
              }}
            >
              {fields.map((f) => (
                <div key={f.id}>
                  <label
                    style={{
                      fontSize: "12px",
                      fontWeight: 600,
                      color: "#374151",
                      display: "block",
                      marginBottom: "4px",
                    }}
                  >
                    {f.label}{" "}
                    {f.required && <span style={{ color: "#ef4444" }}>*</span>}
                  </label>
                  {f.type === "select" ? (
                    <select
                      disabled
                      style={{
                        ...inputStyle,
                        background: "#fff",
                        cursor: "default",
                        color: "#9ca3af",
                      }}
                    >
                      <option>{f.placeholder || "Select option..."}</option>
                    </select>
                  ) : f.type === "textarea" ? (
                    <textarea
                      disabled
                      rows={2}
                      placeholder={f.placeholder || f.label}
                      style={{
                        ...inputStyle,
                        resize: "none",
                        background: "#fff",
                      }}
                    />
                  ) : (
                    <input
                      disabled
                      placeholder={f.placeholder || f.label}
                      style={{
                        ...inputStyle,
                        background: "#fff",
                        color: "#9ca3af",
                      }}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        </>
      )}

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
          {saved ? "✅ Saved!" : "Save Form"}
        </button>
        {saved && (
          <span style={{ fontSize: "13px", color: "#16a34a", fontWeight: 600 }}>
            Form layout saved!
          </span>
        )}
      </div>
    </div>
  );
}

function EditorField({ label, children }) {
  return (
    <div>
      <label
        style={{
          fontSize: "11px",
          fontWeight: 700,
          color: "#6b7280",
          display: "block",
          marginBottom: "6px",
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
  borderRadius: "7px",
  fontSize: "13px",
  color: "#111",
  boxSizing: "border-box",
  background: "#fafafa",
  fontFamily: "inherit",
};
