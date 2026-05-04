import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import CodSettings from "../components/CodSettings";
import PixelSettings from "../components/PixelSettings";

export default function Admin() {
  const shop = new URLSearchParams(window.location.search).get("shop");

  const [active, setActive] = useState("cod");

  const [settings, setSettings] = useState({
    mode: "both",
    buttonText: "",
    bgColor: "#ff0000",
    textColor: "#ffffff",
    borderRadius: 6,
  });

  const [pixels, setPixels] = useState([]);

  const update = (k, v) => setSettings((p) => ({ ...p, [k]: v }));

  useEffect(() => {
    fetch(`https://releaseit-backend.onrender.com/api/settings?shop=${shop}`)
      .then((r) => r.json())
      .then((d) => d.success && setSettings(d));

    fetch(`https://releaseit-backend.onrender.com/api/pixels?shop=${shop}`)
      .then((r) => r.json())
      .then((d) => d.success && setPixels(d.pixels));
  }, []);

  const save = async () => {
    await fetch(
      `https://releaseit-backend.onrender.com/api/settings?shop=${shop}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      },
    );
    alert("Saved ✅");
  };

  const savePixels = async () => {
    await fetch(`https://releaseit-backend.onrender.com/api/pixels`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ shop, pixels }),
    });
    alert("Pixels Saved ✅");
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar active={active} setActive={setActive} />

      <div className="flex-1 p-8">
        {active === "cod" && (
          <CodSettings settings={settings} update={update} save={save} />
        )}

        {active === "pixels" && (
          <PixelSettings
            pixels={pixels}
            addPixel={() =>
              setPixels([...pixels, { type: "facebook", pixelId: "" }])
            }
            updatePixel={(i, k, v) => {
              const arr = [...pixels];
              arr[i][k] = v;
              setPixels(arr);
            }}
            removePixel={(i) => {
              const arr = [...pixels];
              arr.splice(i, 1);
              setPixels(arr);
            }}
            savePixels={savePixels}
          />
        )}
      </div>
    </div>
  );
}
