export default function FieldList({ fields, setSelectedField, removeField }) {
  return (
    <div className="w-1/2 bg-white p-4 rounded-xl shadow">
      <h3 className="font-semibold mb-3">Form Fields</h3>

      {fields.map((f) => (
        <div
          key={f.id}
          className="border p-3 mb-2 rounded cursor-pointer hover:bg-gray-50 flex justify-between"
          onClick={() => setSelectedField(f)}
        >
          <span>{f.label}</span>

          <button
            onClick={(e) => {
              e.stopPropagation();
              removeField(f.id);
            }}
            className="text-red-500"
          >
            ✕
          </button>
        </div>
      ))}
    </div>
  );
}
