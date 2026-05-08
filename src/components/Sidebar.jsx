const NAV = [
  { key: "cod", icon: "⚙️", label: "COD Button" },
  { key: "form", icon: "📝", label: "Form Builder" },
  { key: "pixels", icon: "📊", label: "Pixels" },
  { key: "whatsapp", icon: "💬", label: "WhatsApp" },
  { key: "thankyou", icon: "🎉", label: "Thank You Page" },
];

export default function Sidebar({ active, setActive }) {
  return (
    <div className="w-56 min-w-[224px] bg-white border-r border-gray-100 flex flex-col px-3 py-6">
      <div className="px-2 mb-7">
        <h2 className="text-[15px] font-extrabold text-gray-900 leading-tight">
          🚀 ReleaseIt
        </h2>
        <p className="text-[11px] text-gray-400 mt-0.5">COD App Dashboard</p>
      </div>

      <nav className="flex flex-col gap-1">
        {NAV.map(({ key, icon, label }) => (
          <button
            key={key}
            onClick={() => setActive(key)}
            className={`flex items-center gap-2.5 w-full text-left px-3 py-2.5 rounded-lg text-[13px] font-medium transition-all border-none cursor-pointer
              ${active === key ? "bg-gray-900 text-white font-bold" : "bg-transparent text-gray-600 hover:bg-gray-100"}`}
          >
            <span className="text-base">{icon}</span>
            {label}
          </button>
        ))}
      </nav>
    </div>
  );
}
