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
    name: "firstName",
    label: "First Name",
    type: "text",
    required: true,
    placeholder: "Enter your first name",
  },
  {
    id: 2,
    name: "lastName",
    label: "Last Name",
    type: "text",
    required: false,
    placeholder: "Enter your last name",
  },
  {
    id: 3,
    name: "phone",
    label: "Phone",
    type: "phone",
    required: true,
    placeholder: "03XX-XXXXXXX",
  },
  {
    id: 4,
    name: "address",
    label: "Address",
    type: "text",
    required: true,
    placeholder: "Enter your address",
  },
  {
    id: 5,
    name: "city",
    label: "City",
    type: "text",
    required: true,
    placeholder: "Enter your city",
  },
];

const SECTION_LABEL_CLS =
  "text-[11px] font-bold text-gray-500 uppercase tracking-[0.05em] mb-2.5";
const INPUT_CLS =
  "w-full px-3 py-2.5 border-[1.5px] border-gray-200 rounded-[7px] text-[13px] text-gray-900 bg-neutral-50 font-[inherit] focus:outline-none focus:border-gray-400 transition-colors";

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

  const slugify = (s) =>
    (s || "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "_")
      .replace(/^_|_$/g, "");

  const addField = () => {
    const baseName = `field_${fields.length + 1}`;
    const f = {
      id: Date.now(),
      name: baseName,
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
    const updated = fields.map((f) => {
      if (f.id !== id) return f;
      const next = { ...f, [key]: value };
      // Auto-derive `name` from label if user hasn't set one
      if (key === "label" && (!f.name || f.name.startsWith("field_"))) {
        next.name = slugify(value) || `field_${id}`;
      }
      return next;
    });
    setFields(updated);
    if (selected?.id === id) {
      setSelected((prev) => {
        const next = { ...prev, [key]: value };
        if (key === "label" && (!prev.name || prev.name.startsWith("field_"))) {
          next.name = slugify(value) || `field_${id}`;
        }
        return next;
      });
    }
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
    <div className="bg-white rounded-2xl shadow-[0_1px_8px_rgba(0,0,0,0.07)] p-7">
      {/* HEADER */}
      <div className="flex items-start justify-between mb-[22px]">
        <div>
          <h2 className="text-[18px] font-extrabold text-gray-900 mb-1">
            📝 Form Builder
          </h2>
          <p className="text-[13px] text-gray-400">
            Design your COD order form. Add, edit, and reorder fields.
          </p>
        </div>
        <button
          onClick={addField}
          className="flex items-center gap-1.5 bg-gray-900 hover:bg-gray-700 text-white border-none rounded-[9px] px-[18px] py-2.5 text-[13px] font-bold cursor-pointer whitespace-nowrap transition-colors"
        >
          + Add Field
        </button>
      </div>

      <div className="border-t border-gray-100 mb-[22px]" />

      {/* TWO COLUMN */}
      <div className="grid grid-cols-2 gap-5">
        {/* ── LEFT: FIELD LIST ── */}
        <div>
          <p className={SECTION_LABEL_CLS}>Fields ({fields.length})</p>

          {fields.length === 0 ? (
            <div className="border-2 border-dashed border-gray-200 rounded-[10px] p-8 text-center">
              <p className="text-2xl mb-2">📋</p>
              <p className="text-[13px] text-gray-400">
                No fields yet. Click "+ Add Field".
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-1.5">
              {fields.map((f, idx) => {
                const isSelected = selected?.id === f.id;
                return (
                  <div
                    key={f.id}
                    onClick={() => setSelected(f)}
                    className={`flex items-center gap-2.5 px-3.5 py-3 rounded-[9px] border-[1.5px] cursor-pointer transition-all ${
                      isSelected
                        ? "border-gray-900 bg-gray-50"
                        : "border-gray-200 bg-white"
                    }`}
                  >
                    {/* drag handle / order buttons */}
                    <div className="flex flex-col gap-0.5">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          moveField(idx, -1);
                        }}
                        disabled={idx === 0}
                        className="bg-none border-none p-0 leading-none text-[10px] text-gray-500 disabled:text-gray-300 disabled:cursor-default cursor-pointer"
                      >
                        ▲
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          moveField(idx, 1);
                        }}
                        disabled={idx === fields.length - 1}
                        className="bg-none border-none p-0 leading-none text-[10px] text-gray-500 disabled:text-gray-300 disabled:cursor-default cursor-pointer"
                      >
                        ▼
                      </button>
                    </div>

                    {/* icon */}
                    <span className="text-[16px] shrink-0">
                      {TYPE_ICONS[f.type] || "📝"}
                    </span>

                    {/* info */}
                    <div className="flex-1 min-w-0">
                      <p className="text-[13px] font-semibold text-gray-900 m-0 truncate">
                        {f.label}
                      </p>
                      <p className="text-[11px] text-gray-400 m-0">
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
                      className="bg-none border-none cursor-pointer text-red-500 hover:bg-red-50 text-[14px] px-1 py-0.5 rounded shrink-0 transition-colors"
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
          <p className={SECTION_LABEL_CLS}>Edit Field</p>

          {!selected ? (
            <div className="border-2 border-dashed border-gray-200 rounded-[10px] px-5 py-12 text-center">
              <p className="text-2xl mb-2">👈</p>
              <p className="text-[13px] text-gray-400">
                Select a field from the left to edit it.
              </p>
            </div>
          ) : (
            <div className="border-[1.5px] border-gray-200 rounded-[10px] p-[18px] flex flex-col gap-4">
              {/* LABEL */}
              <EditorField label="Label">
                <input
                  value={selected.label}
                  onChange={(e) =>
                    updateField(selected.id, "label", e.target.value)
                  }
                  className={INPUT_CLS}
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
                  className={INPUT_CLS}
                />
              </EditorField>

              {/* TYPE */}
              <EditorField label="Field Type">
                <div className="grid grid-cols-2 gap-1.5">
                  {FIELD_TYPES.map((t) => {
                    const active = selected.type === t.value;
                    return (
                      <div
                        key={t.value}
                        onClick={() =>
                          updateField(selected.id, "type", t.value)
                        }
                        className={`px-2.5 py-2 rounded-[7px] border-[1.5px] cursor-pointer transition-all ${
                          active
                            ? "border-gray-900 bg-gray-900"
                            : "border-gray-200 bg-white"
                        }`}
                      >
                        <p
                          className={`text-[12px] font-semibold m-0 ${
                            active ? "text-white" : "text-gray-900"
                          }`}
                        >
                          {t.label}
                        </p>
                        <p
                          className={`text-[10px] m-0 ${
                            active ? "text-gray-300" : "text-gray-400"
                          }`}
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
                    className={INPUT_CLS + " resize-y"}
                  />
                </EditorField>
              )}

              {/* REQUIRED TOGGLE */}
              <div
                onClick={() =>
                  updateField(selected.id, "required", !selected.required)
                }
                className="flex items-center justify-between px-3.5 py-3 rounded-lg border-[1.5px] border-gray-200 cursor-pointer bg-neutral-50"
              >
                <div>
                  <p className="text-[13px] font-semibold text-gray-900 m-0">
                    Required field
                  </p>
                  <p className="text-[11px] text-gray-400 m-0">
                    Customer must fill this field
                  </p>
                </div>
                {/* toggle pill */}
                <div
                  className={`w-10 h-[22px] rounded-[11px] relative transition-colors shrink-0 ${
                    selected.required ? "bg-gray-900" : "bg-gray-300"
                  }`}
                >
                  <div
                    className={`absolute top-[3px] w-4 h-4 rounded-full bg-white shadow-[0_1px_3px_rgba(0,0,0,0.2)] transition-all ${
                      selected.required ? "left-[21px]" : "left-[3px]"
                    }`}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* FORM PREVIEW — mirrors customer-facing App.jsx exactly */}
      {fields.length > 0 && (
        <>
          <div className="border-t border-gray-100 my-6" />
          <div>
            <p className="text-[11px] font-bold text-gray-500 uppercase tracking-[0.05em] mb-3">
              Customer Preview
            </p>
            <p className="text-[11px] text-gray-400 mb-4">
              This is exactly what customers will see on the checkout page.
            </p>
            <CustomerFormPreview fields={fields} />
          </div>
        </>
      )}

      <div className="border-t border-gray-100 my-6" />

      {/* SAVE */}
      <div className="flex items-center gap-3.5">
        <button
          onClick={handleSave}
          className={`text-white border-none rounded-[10px] px-7 py-3 text-[14px] font-bold cursor-pointer transition-colors ${
            saved ? "bg-green-600" : "bg-gray-900 hover:bg-gray-700"
          }`}
        >
          {saved ? "✅ Saved!" : "Save Form"}
        </button>
        {saved && (
          <span className="text-[13px] text-green-600 font-semibold">
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
      <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-[0.04em] mb-1.5">
        {label}
      </label>
      {children}
    </div>
  );
}

/* ────────────────────────────────────────────────
   CustomerFormPreview — mirrors App.jsx visually
   ──────────────────────────────────────────────── */
function CustomerFormPreview({ fields }) {
  const contactNames = ["firstName", "lastName", "phone", "email"];
  const visible = fields.filter((f) => f.type !== "hidden");
  const contactFields = visible.filter((f) => contactNames.includes(f.name));
  const otherFields = visible.filter((f) => !contactNames.includes(f.name));
  const firstName = contactFields.find((f) => f.name === "firstName");
  const lastName = contactFields.find((f) => f.name === "lastName");
  const restContact = contactFields.filter(
    (f) => f.name !== "firstName" && f.name !== "lastName",
  );

  const PREVIEW_INPUT_CLS =
    "w-full px-3 py-2.5 text-[14px] text-gray-400 border border-gray-200 rounded-lg bg-gray-50 font-[inherit]";

  const renderInput = (f) => {
    if (!f) return null;
    if (f.type === "phone") {
      return (
        <div className={PREVIEW_INPUT_CLS + " flex items-center gap-2"}>
          <span className="text-[13px]">🇵🇰 +92</span>
          <span className="text-gray-300">|</span>
          <span className="text-gray-400 text-[13px]">
            {f.placeholder || "300 1234567"}
          </span>
        </div>
      );
    }
    if (f.type === "select") {
      return (
        <select disabled className={PREVIEW_INPUT_CLS}>
          <option>{f.placeholder || `Select ${f.label}`}</option>
        </select>
      );
    }
    if (f.type === "textarea") {
      return (
        <textarea
          disabled
          rows={3}
          placeholder={f.placeholder || f.label}
          className={PREVIEW_INPUT_CLS + " resize-none"}
        />
      );
    }
    return (
      <input
        disabled
        placeholder={f.placeholder || f.label}
        className={PREVIEW_INPUT_CLS}
      />
    );
  };

  return (
    <div className="bg-gradient-to-b from-gray-50 to-gray-100 rounded-2xl px-4 py-6 border border-gray-200">
      <div className="max-w-[440px] mx-auto">
        {/* Header */}
        <div className="text-center mb-5">
          <div className="inline-flex items-center gap-1.5 bg-white border border-gray-200 rounded-full px-3 py-1.5 text-[11px] font-semibold text-gray-600 mb-2.5 shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
            Secure Checkout
          </div>
          <h3 className="text-[20px] font-extrabold text-gray-900 m-0">
            Cash on Delivery
          </h3>
          <p className="text-[12px] text-gray-500 mt-1">
            Pay when you receive your order
          </p>
        </div>

        {/* Form card */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-[0_1px_8px_rgba(0,0,0,0.05)]">
          {/* Contact section */}
          {contactFields.length > 0 && (
            <div className="mb-3.5">
              <p className="text-[10.5px] font-bold text-gray-400 uppercase tracking-[0.05em] mb-2.5">
                Contact Information
              </p>
              {(firstName || lastName) && (
                <div className="grid grid-cols-2 gap-2.5">
                  {firstName && <div>{renderInput(firstName)}</div>}
                  {lastName && <div>{renderInput(lastName)}</div>}
                </div>
              )}
              {restContact.map((f) => (
                <div key={f.name} className="mt-2.5">
                  {renderInput(f)}
                </div>
              ))}
            </div>
          )}

          {/* Shipping section */}
          {otherFields.length > 0 && (
            <div>
              <p className="text-[10.5px] font-bold text-gray-400 uppercase tracking-[0.05em] mb-2.5">
                Shipping Address
              </p>
              {otherFields.map((f, idx) => (
                <div key={f.name} className={idx === 0 ? "" : "mt-2.5"}>
                  {renderInput(f)}
                </div>
              ))}
            </div>
          )}

          {/* Place Order button */}
          <button
            disabled
            className="w-full mt-4 bg-gray-900 text-white border-none rounded-[10px] py-3 text-[14px] font-bold cursor-default"
          >
            Place Order
          </button>

          <p className="text-center text-[11px] text-gray-400 mt-2.5">
            🔒 Your information is secure and never shared
          </p>
        </div>

        {/* Footer */}
        <p className="text-center text-[11px] text-gray-400 mt-3">
          Powered by{" "}
          <span className="font-semibold text-gray-600">Order Now</span>
        </p>
      </div>
    </div>
  );
}
