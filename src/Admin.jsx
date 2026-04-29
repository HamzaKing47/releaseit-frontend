import { useState, useEffect } from "react";

function Admin() {
  const [mode, setMode] = useState("both");

  const shop = new URLSearchParams(window.location.search).get("shop");

  useEffect(() => {
    fetch(`https://releaseit-backend.onrender.com/api/settings?shop=${shop}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setMode(data.mode);
      });
  }, []);

  const save = async () => {
    await fetch(
      `https://releaseit-backend.onrender.com/api/save-settings?shop=${shop}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ mode }),
      },
    );

    alert("Saved!");
  };

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">ReleaseIt Settings</h1>

      <select
        value={mode}
        onChange={(e) => setMode(e.target.value)}
        className="border p-2"
      >
        <option value="both">Both Buttons</option>
        <option value="replace">Replace Add to Cart</option>
        <option value="cod_only">Only COD Button</option> {/* 🔥 NEW */}
      </select>

      <button onClick={save} className="ml-3 bg-black text-white px-4 py-2">
        Save
      </button>
    </div>
  );
}

export default Admin;
