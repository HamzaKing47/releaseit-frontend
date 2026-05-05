import { useState } from "react";
import FieldEditor from "./FieldEditor";
import FieldList from "./FieldList";

export default function CodBuilder({ save }) {
  const [fields, setFields] = useState([
    { id: 1, label: "First Name", type: "text", required: true },
    { id: 2, label: "Phone", type: "phone", required: true },
  ]);

  const [selectedField, setSelectedField] = useState(null);

  const addField = () => {
    const newField = {
      id: Date.now(),
      label: "New Field",
      type: "text",
      required: false,
    };
    setFields([...fields, newField]);
  };

  const updateField = (id, key, value) => {
    setFields(fields.map((f) => (f.id === id ? { ...f, [key]: value } : f)));
  };

  const removeField = (id) => {
    setFields(fields.filter((f) => f.id !== id));
  };

  return (
    <div className="flex gap-6">
      {/* LEFT: FIELD LIST */}
      <FieldList
        fields={fields}
        setSelectedField={setSelectedField}
        removeField={removeField}
      />

      {/* RIGHT: EDITOR */}
      <FieldEditor field={selectedField} updateField={updateField} />

      {/* ADD BUTTON */}
      <div className="absolute bottom-10 left-10">
        <button
          onClick={addField}
          className="bg-black text-white px-4 py-2 rounded"
        >
          + Add Field
        </button>
      </div>
    </div>
  );
}
