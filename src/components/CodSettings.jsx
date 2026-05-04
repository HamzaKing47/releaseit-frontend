export default function CodSettings({ settings, update, save }) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-md max-w-3xl">
      <h2 className="text-xl font-semibold mb-5">COD Button Settings</h2>

      {/* MODE */}
      <label className="text-sm font-medium">Button Mode</label>
      <select
        value={settings.mode}
        onChange={(e) => update("mode", e.target.value)}
        className="w-full p-3 border rounded-lg mb-4"
      >
        <option value="both">Show All</option>
        <option value="replace">Replace Add to Cart</option>
        <option value="replace_buy_now">Replace Buy Now</option>
        <option value="cod_only">Only COD Button</option>
      </select>

      {/* TEXT */}
      <label className="text-sm font-medium">Button Text</label>
      <input
        value={settings.buttonText}
        onChange={(e) => update("buttonText", e.target.value)}
        className="w-full p-3 border rounded-lg mb-4"
      />

      {/* COLORS */}
      <div className="flex gap-4 mb-4">
        <input
          type="color"
          value={settings.bgColor}
          onChange={(e) => update("bgColor", e.target.value)}
        />
        <input
          type="color"
          value={settings.textColor}
          onChange={(e) => update("textColor", e.target.value)}
        />
      </div>

      {/* RADIUS */}
      <label className="text-sm font-medium">Border Radius</label>
      <input
        type="range"
        min="0"
        max="20"
        value={settings.borderRadius}
        onChange={(e) => update("borderRadius", Number(e.target.value))}
        className="w-full mb-5"
      />

      {/* PREVIEW */}
      <div className="bg-gray-100 p-5 rounded-xl mb-5">
        <button className="w-full border p-3 mb-2 bg-white">Add to cart</button>

        <button className="w-full bg-black text-white p-3 mb-2">
          Buy it now
        </button>

        <button
          style={{
            width: "100%",
            padding: "14px",
            background: settings.bgColor,
            color: settings.textColor,
            borderRadius: settings.borderRadius,
            fontWeight: 600,
          }}
        >
          {settings.buttonText}
        </button>
      </div>

      <button
        onClick={save}
        className="bg-black text-white px-6 py-3 rounded-lg"
      >
        Save Settings
      </button>
    </div>
  );
}
