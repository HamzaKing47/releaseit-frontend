const NAV = [
  { key: "cod", icon: "⚙️", label: "COD Button" },
  { key: "form", icon: "📝", label: "Form Builder" },
  { key: "pixels", icon: "📊", label: "Pixels" },
  { key: "whatsapp", icon: "💬", label: "WhatsApp" },
  { key: "fraud", icon: "🛡️", label: "Fraud Prevention" },
  { key: "thankyou", icon: "🎉", label: "Thank You Page" },
  { key: "pricing", icon: "💎", label: "Pricing & Plans" },
  { key: "contact", icon: "💬", label: "Contact Support" },
];

export default function Sidebar({ active, setActive, shop }) {
  return (
    <aside className="w-60 flex-shrink-0 h-screen bg-white border-r border-gray-100 flex flex-col">
      {/* Brand */}
      <div className="flex-shrink-0 px-5 pt-6 pb-5 border-b border-gray-100">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-gray-900 to-gray-700 flex items-center justify-center text-white text-base font-bold shadow-sm">
            R
          </div>
          <div>
            <h2 className="text-[15px] font-extrabold text-gray-900 leading-tight">
              ReleaseIt
            </h2>
            <p className="text-[10.5px] text-gray-400 mt-0.5 font-medium">
              COD App Dashboard
            </p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 flex flex-col gap-1">
        <p className="text-[10px] font-bold text-gray-300 uppercase tracking-wider px-3 pb-2">
          Menu
        </p>
        {NAV.map(({ key, icon, label }) => (
          <button
            key={key}
            onClick={() => setActive(key)}
            className={`flex items-center gap-2.5 w-full text-left px-3 py-2.5 rounded-lg text-[13px] font-medium transition-all border-none cursor-pointer
              ${
                active === key
                  ? "bg-gray-900 text-white font-bold shadow-sm"
                  : "bg-transparent text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              }`}
          >
            <span className="text-[15px]">{icon}</span>
            <span className="flex-1">{label}</span>
            {active === key && (
              <span className="w-1.5 h-1.5 rounded-full bg-white/70" />
            )}
          </button>
        ))}
      </nav>

      {/* Footer */}
      <div className="flex-shrink-0 border-t border-gray-100 px-4 py-4">
        <div className="flex items-center gap-2 text-[11px] text-gray-400">
          <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
          <span className="truncate font-medium" title={shop}>
            {shop ? shop.replace(".myshopify.com", "") : "Not connected"}
          </span>
        </div>
        <p className="text-[10px] text-gray-300 mt-2">v1.0 • ReleaseIt</p>
      </div>
    </aside>
  );
}
