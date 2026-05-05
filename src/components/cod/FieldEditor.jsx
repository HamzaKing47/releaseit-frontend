export default function FieldEditor({ field, updateField }) {
  if (!field) {
    return (
      <div className="w-1/2 bg-white p-4 rounded-xl shadow text-gray-400">
        Select a field to edit
      </div>
    );
  }

  return (
    <div className="w-1/2 bg-white p-4 rounded-xl shadow">
      <h3 className="font-semibold mb-3">Edit Field</h3>

      {/* LABEL */}
      <label className="text-sm">Label</label>
      <input
        value={field.label}
        onChange={(e) => updateField(field.id, "label", e.target.value)}
        className="w-full p-2 border rounded mb-3"
      />

      {/* TYPE */}
      <label className="text-sm">Type</label>
      <select
        value={field.type}
        onChange={(e) => updateField(field.id, "type", e.target.value)}
        className="w-full p-2 border rounded mb-3"
      >
        <option value="text">Text</option>
        <option value="phone">Phone</option>
        <option value="select">Dropdown</option>
        <option value="hidden">Hidden</option>
      </select>

      {/* REQUIRED */}
      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={field.required}
          onChange={(e) => updateField(field.id, "required", e.target.checked)}
        />
        Required
      </label>
    </div>
  );
}
