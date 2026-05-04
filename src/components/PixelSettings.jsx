export default function PixelSettings({
  pixels,
  addPixel,
  updatePixel,
  removePixel,
  savePixels,
}) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-md max-w-3xl">
      <h2 className="text-xl font-semibold mb-5">Pixels</h2>

      {pixels.map((p, i) => (
        <div key={i} className="border p-4 mb-3 rounded-xl">
          <select
            value={p.type}
            onChange={(e) => updatePixel(i, "type", e.target.value)}
            className="w-full mb-2 p-2 border rounded"
          >
            <option value="facebook">Facebook</option>
            <option value="tiktok">TikTok</option>
          </select>

          <input
            placeholder="Pixel ID"
            value={p.pixelId}
            onChange={(e) => updatePixel(i, "pixelId", e.target.value)}
            className="w-full p-2 mb-2 border rounded"
          />

          <button
            onClick={() => removePixel(i)}
            className="text-red-500 text-sm"
          >
            Remove
          </button>
        </div>
      ))}

      <button onClick={addPixel} className="bg-gray-200 px-4 py-2 rounded mr-2">
        Add Pixel
      </button>

      <button
        onClick={savePixels}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        Save Pixels
      </button>
    </div>
  );
}
