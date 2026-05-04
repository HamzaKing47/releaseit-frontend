export default function Sidebar({ active, setActive }) {
  const item = (key, label) => (
    <button
      onClick={() => setActive(key)}
      className={`w-full text-left px-4 py-3 rounded-lg mb-2 transition ${
        active === key
          ? "bg-black text-white"
          : "hover:bg-gray-100 text-gray-700"
      }`}
    >
      {label}
    </button>
  );

  return (
    <div className="w-64 bg-white border-r p-5">
      <h2 className="text-xl font-bold mb-6">ReleaseIt</h2>

      {item("cod", "⚙️ COD Button")}
      {item("pixels", "📊 Pixels")}

      {/* Future modules */}
      {/* {item("whatsapp", "💬 WhatsApp")} */}
    </div>
  );
}
