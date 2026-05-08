import { useState, useEffect, useRef } from "react";

const BACKEND = "https://releaseit-backend.onrender.com";

const DEFAULT_TEMPLATE = `🛍️ *New Order!*

Hello {{name}}!

Your order has been placed successfully.

📦 *Order:* {{orderName}}
💰 *Amount:* {{currency}} {{total}}
📍 *Address:* {{address}}

1️⃣ - Confirm Order
2️⃣ - Update Address
3️⃣ - Cancel Order`;

export default function WhatsappSettings({ shop }) {
  const [settings, setSettings] = useState({
    whatsappNumber: "",
    enabled: true,
    sendOnOrderCreate: true,
    sendOnFulfillment: true,
    sendOnCancellation: false,
    messageTemplate: DEFAULT_TEMPLATE,
  });

  const [status, setStatus] = useState("disconnected");
  const [qrCode, setQrCode] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [testPhone, setTestPhone] = useState("");
  const [testMsg, setTestMsg] = useState("");
  const pollRef = useRef(null);

  /* ── LOAD ── */
  useEffect(() => {
    if (!shop) return;
    fetch(`${BACKEND}/api/whatsapp/settings?shop=${shop}`)
      .then((r) => r.json())
      .then((d) => {
        if (d.success) {
          setSettings({
            whatsappNumber: d.whatsappNumber || "",
            enabled: d.enabled ?? true,
            sendOnOrderCreate: d.sendOnOrderCreate ?? true,
            sendOnFulfillment: d.sendOnFulfillment ?? true,
            sendOnCancellation: d.sendOnCancellation ?? false,
            messageTemplate: d.messageTemplate || DEFAULT_TEMPLATE,
          });
          setStatus(d.status || "disconnected");
        }
      });
  }, [shop]);

  /* ── POLL ── */
  useEffect(() => {
    if (status !== "waiting_qr") {
      clearInterval(pollRef.current);
      return;
    }
    pollRef.current = setInterval(async () => {
      const r = await fetch(`${BACKEND}/api/whatsapp/status?shop=${shop}`);
      const d = await r.json();
      if (d.status === "connected") {
        setStatus("connected");
        setQrCode(null);
        clearInterval(pollRef.current);
      }
    }, 3000);
    return () => clearInterval(pollRef.current);
  }, [status]);

  const upd = (k, v) => setSettings((p) => ({ ...p, [k]: v }));

  /* ── SAVE ── */
  const handleSave = async () => {
    setLoading(true);
    await fetch(`${BACKEND}/api/whatsapp/settings`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ shop, ...settings }),
    });
    setSaved(true);
    setLoading(false);
    setTimeout(() => setSaved(false), 2500);
  };

  /* ── CONNECT ── */
  const handleConnect = async () => {
    setLoading(true);
    setQrCode(null);
    await fetch(`${BACKEND}/api/whatsapp/settings`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ shop, ...settings }),
    });
    const r = await fetch(`${BACKEND}/api/whatsapp/connect?shop=${shop}`);
    const d = await r.json();
    setLoading(false);
    if (d.status === "connected") {
      setStatus("connected");
    } else if (d.qrCode) {
      setQrCode(d.qrCode);
      setStatus("waiting_qr");
    } else alert(d.message || "Connection failed.");
  };

  /* ── DISCONNECT ── */
  const handleDisconnect = async () => {
    if (!confirm("Disconnect WhatsApp?")) return;
    await fetch(`${BACKEND}/api/whatsapp/disconnect`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ shop }),
    });
    setStatus("disconnected");
    setQrCode(null);
  };

  /* ── TEST ── */
  const handleTest = async () => {
    if (!testPhone) return;
    setTestMsg("Sending...");
    const r = await fetch(`${BACKEND}/api/whatsapp/test`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ shop, phone: testPhone }),
    });
    const d = await r.json();
    setTestMsg(d.success ? "✅ Sent!" : `❌ ${d.message}`);
    setTimeout(() => setTestMsg(""), 3000);
  };

  // wa.me link preview
  const formatWaNum = (n) =>
    n.replace(/\D/g, "").replace(/^0(\d{10})$/, "92$1");
  const waNum = formatWaNum(settings.whatsappNumber);
  const sampleLink = waNum ? `https://wa.me/${waNum}?text=CONFIRM-1001` : null;

  const SC = {
    connected: {
      dot: "bg-green-500",
      badge: "bg-green-50 text-green-700 border-green-200",
      label: "Connected",
    },
    waiting_qr: {
      dot: "bg-yellow-400",
      badge: "bg-yellow-50 text-yellow-700 border-yellow-200",
      label: "Scan QR",
    },
    connecting: {
      dot: "bg-blue-400",
      badge: "bg-blue-50 text-blue-700 border-blue-200",
      label: "Connecting...",
    },
    disconnected: {
      dot: "bg-gray-300",
      badge: "bg-gray-50 text-gray-500 border-gray-200",
      label: "Disconnected",
    },
  };
  const sc = SC[status] || SC.disconnected;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-7 max-w-3xl">
      {/* HEADER */}
      <div className="flex items-start justify-between mb-5">
        <div>
          <h2 className="text-[18px] font-extrabold text-gray-900 mb-1">
            💬 WhatsApp Automation
          </h2>
          <p className="text-[13px] text-gray-400">
            Free automated order messages with clickable action links.
          </p>
        </div>
        <span
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[12px] font-bold border ${sc.badge}`}
        >
          <span className={`w-2 h-2 rounded-full ${sc.dot}`} />
          {sc.label}
        </span>
      </div>

      <div className="border-t border-gray-100 mb-6" />

      {/* MASTER TOGGLE */}
      <ToggleRow
        label="Enable WhatsApp Automation"
        desc="Turn on/off all automated WhatsApp messages"
        on={settings.enabled}
        onChange={(v) => upd("enabled", v)}
        big
      />

      <div
        className={`mt-6 transition-all ${!settings.enabled ? "opacity-40 pointer-events-none" : ""}`}
      >
        {/* ── STEP 1: WhatsApp NUMBER ── */}
        <div className="mb-7">
          <StepLabel n="1" title="Your Store WhatsApp Number" />
          <p className="text-[12px] text-gray-400 mt-1 mb-3 ml-8">
            This number receives customer replies. Must match the connected
            WhatsApp.
          </p>

          <input
            value={settings.whatsappNumber}
            onChange={(e) => upd("whatsappNumber", e.target.value)}
            placeholder="e.g. 03001234567 or 923001234567"
            className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-[13px] bg-gray-50 focus:outline-none focus:border-gray-400 transition"
          />

          {/* Link Preview */}
          {sampleLink && (
            <div className="mt-3 bg-green-50 border border-green-100 rounded-xl p-3">
              <p className="text-[11px] font-bold text-green-700 mb-1.5">
                ✅ Sample link that will be sent to customers:
              </p>
              <code className="text-[11px] text-green-800 bg-white px-2 py-1 rounded-md border border-green-100 break-all">
                {sampleLink}
              </code>
              <p className="text-[11px] text-green-600 mt-1.5">
                Customer clicks → WhatsApp opens → "CONFIRM-1001" auto-sent 🎉
              </p>
            </div>
          )}
        </div>

        {/* ── STEP 2: CONNECT ── */}
        <div className="mb-7">
          <StepLabel n="2" title="Connect WhatsApp" />

          {status === "connected" ? (
            <div className="flex items-center gap-3 mt-3">
              <div className="flex-1 flex items-center gap-3 bg-green-50 border border-green-200 rounded-xl px-4 py-3">
                <span className="text-2xl">✅</span>
                <div>
                  <p className="text-[13px] font-bold text-green-800">
                    WhatsApp Connected!
                  </p>
                  <p className="text-[11px] text-green-600 mt-0.5">
                    Messages will be sent automatically on new orders.
                  </p>
                </div>
              </div>
              <button
                onClick={handleDisconnect}
                className="px-4 py-2.5 border border-red-200 text-red-500 hover:bg-red-50 text-[12px] font-bold rounded-xl transition"
              >
                Disconnect
              </button>
            </div>
          ) : qrCode ? (
            <div className="mt-3 border border-gray-200 rounded-xl p-6 text-center">
              <p className="text-[14px] font-bold text-gray-900 mb-1">
                📱 Scan with WhatsApp
              </p>
              <p className="text-[12px] text-gray-400 mb-5">
                Open WhatsApp → Menu → <strong>Linked Devices</strong> →{" "}
                <strong>Link a Device</strong>
              </p>
              <img
                src={qrCode}
                alt="QR"
                className="w-52 h-52 mx-auto rounded-xl border-2 border-gray-100 shadow-sm mb-4"
              />
              <div className="flex items-center justify-center gap-2">
                <span className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse" />
                <p className="text-[12px] text-yellow-700 font-semibold">
                  Waiting for scan...
                </p>
              </div>
              <button
                onClick={() => {
                  setQrCode(null);
                  setStatus("disconnected");
                }}
                className="mt-4 text-[11px] text-gray-400 hover:text-gray-600"
              >
                Cancel
              </button>
            </div>
          ) : (
            <div className="mt-3">
              <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 mb-4 text-[12px] text-amber-800">
                <p className="font-bold mb-1">⚠️ Use a Dedicated Number</p>
                <p className="text-amber-700">
                  Use a separate SIM — not your personal number.
                </p>
              </div>
              <button
                onClick={handleConnect}
                disabled={loading || !settings.whatsappNumber}
                className="flex items-center gap-2 bg-[#25D366] hover:bg-[#1ebe5a] disabled:opacity-50 text-white font-bold px-6 py-3 rounded-xl text-[14px] transition shadow-sm"
              >
                {loading ? "⏳ Connecting..." : "📱 Connect WhatsApp"}
              </button>
              {!settings.whatsappNumber && (
                <p className="text-[11px] text-red-400 mt-2">
                  ⚠️ Enter your WhatsApp number first (Step 1)
                </p>
              )}
            </div>
          )}
        </div>

        {/* ── STEP 3: MESSAGE TEMPLATE ── */}
        <div className="mb-7">
          <StepLabel n="3" title="Order Confirmation Message" />
          <div className="mt-3 bg-gray-50 border border-gray-200 rounded-xl p-3 mb-3">
            <p className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-2">
              Variables
            </p>
            <div className="flex flex-wrap gap-1.5">
              {[
                "{{name}}",
                "{{orderName}}",
                "{{currency}}",
                "{{total}}",
                "{{address}}",
              ].map((v) => (
                <code
                  key={v}
                  className="text-[11px] bg-white border border-gray-200 px-2 py-0.5 rounded-md text-blue-600"
                >
                  {v}
                </code>
              ))}
            </div>
            <p className="text-[11px] text-gray-400 mt-2">
              Keep{" "}
              <code className="bg-white px-1 rounded text-gray-600">
                1️⃣ - Confirm Order
              </code>
              ,{" "}
              <code className="bg-white px-1 rounded text-gray-600">
                2️⃣ - Update Address
              </code>
              ,{" "}
              <code className="bg-white px-1 rounded text-gray-600">
                3️⃣ - Cancel Order
              </code>{" "}
              exactly as-is — links auto-inject honge.
            </p>
          </div>

          <textarea
            rows={12}
            value={settings.messageTemplate}
            onChange={(e) => upd("messageTemplate", e.target.value)}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl text-[13px] bg-gray-50 focus:outline-none focus:border-gray-400 transition font-mono resize-y"
          />

          {/* Live Preview */}
          <div className="mt-3 bg-[#e9fbe5] border border-[#c3f0b0] rounded-xl p-4">
            <p className="text-[11px] font-bold text-green-700 uppercase tracking-wider mb-2">
              📱 Customer Will See
            </p>
            <pre className="text-[12px] text-gray-700 whitespace-pre-wrap font-sans leading-relaxed">
              {settings.messageTemplate
                .replace(/{{name}}/g, "Ahmed")
                .replace(/{{orderName}}/g, "#1001")
                .replace(/{{currency}}/g, "PKR")
                .replace(/{{total}}/g, "2,500")
                .replace(/{{address}}/g, "House 12, Lahore")
                .replace(
                  "1️⃣ - Confirm Order",
                  waNum
                    ? `✅ *Confirm Order:*\nhttps://wa.me/${waNum}?text=CONFIRM-1001`
                    : "1️⃣ - Confirm Order",
                )
                .replace(
                  "2️⃣ - Update Address",
                  waNum
                    ? `📍 *Update Address:*\nhttps://wa.me/${waNum}?text=ADDRESS-1001`
                    : "2️⃣ - Update Address",
                )
                .replace(
                  "3️⃣ - Cancel Order",
                  waNum
                    ? `❌ *Cancel Order:*\nhttps://wa.me/${waNum}?text=CANCEL-1001`
                    : "3️⃣ - Cancel Order",
                )}
            </pre>
          </div>
        </div>

        {/* ── STEP 4: TRIGGERS ── */}
        <div className="mb-7">
          <StepLabel n="4" title="When to Send" />
          <div className="mt-3 flex flex-col gap-2">
            <ToggleRow
              label="New Order Placed"
              desc="Send confirmation + action links on COD order"
              on={settings.sendOnOrderCreate}
              onChange={(v) => upd("sendOnOrderCreate", v)}
            />
            <ToggleRow
              label="Order Fulfilled"
              desc="Notify when order is dispatched"
              on={settings.sendOnFulfillment}
              onChange={(v) => upd("sendOnFulfillment", v)}
            />
            <ToggleRow
              label="Order Cancelled"
              desc="Notify customer on cancellation"
              on={settings.sendOnCancellation}
              onChange={(v) => upd("sendOnCancellation", v)}
            />
          </div>
        </div>

        {/* ── TEST ── */}
        {status === "connected" && (
          <div className="mb-7 bg-gray-50 border border-gray-200 rounded-xl p-4">
            <p className="text-[13px] font-bold text-gray-800 mb-3">
              🧪 Send Test Message
            </p>
            <div className="flex gap-2">
              <input
                value={testPhone}
                onChange={(e) => setTestPhone(e.target.value)}
                placeholder="03001234567"
                className="flex-1 px-3 py-2.5 border border-gray-200 rounded-lg text-[13px] bg-white focus:outline-none focus:border-gray-400"
              />
              <button
                onClick={handleTest}
                disabled={!testPhone}
                className="bg-gray-900 hover:bg-gray-700 disabled:opacity-50 text-white text-[13px] font-bold px-5 rounded-lg transition"
              >
                Send
              </button>
            </div>
            {testMsg && (
              <p
                className={`text-[12px] mt-2 font-semibold ${testMsg.startsWith("✅") ? "text-green-600" : "text-red-500"}`}
              >
                {testMsg}
              </p>
            )}
          </div>
        )}
      </div>

      {/* SAVE */}
      <div className="border-t border-gray-100 pt-5 flex items-center gap-4">
        <button
          onClick={handleSave}
          disabled={loading}
          className={`px-7 py-3 rounded-xl text-[14px] font-bold text-white transition disabled:opacity-50
            ${saved ? "bg-green-600" : "bg-gray-900 hover:bg-gray-700"}`}
        >
          {saved ? "✅ Saved!" : loading ? "Saving..." : "Save Settings"}
        </button>
        {saved && (
          <span className="text-[13px] text-green-600 font-semibold">
            Settings saved!
          </span>
        )}
      </div>
    </div>
  );
}

function StepLabel({ n, title }) {
  return (
    <div className="flex items-center gap-2">
      <span className="w-6 h-6 bg-gray-900 text-white rounded-full text-[11px] font-bold flex items-center justify-center flex-shrink-0">
        {n}
      </span>
      <p className="text-[13px] font-bold text-gray-800">{title}</p>
    </div>
  );
}

function ToggleRow({ label, desc, on, onChange, big }) {
  return (
    <div
      onClick={() => onChange(!on)}
      className={`flex items-center justify-between cursor-pointer rounded-xl border transition hover:bg-gray-50
        ${big ? "p-4 border-gray-200 bg-gray-50" : "p-3 border-gray-200 bg-white"}`}
    >
      <div>
        <p
          className={`font-semibold text-gray-900 ${big ? "text-[14px]" : "text-[13px]"}`}
        >
          {label}
        </p>
        <p className="text-[11px] text-gray-400 mt-0.5">{desc}</p>
      </div>
      <div
        className={`rounded-full relative transition-colors flex-shrink-0 ml-3
        ${on ? "bg-gray-900" : "bg-gray-300"} ${big ? "w-12 h-[26px]" : "w-10 h-[22px]"}`}
      >
        <div
          className={`absolute top-[3px] rounded-full bg-white shadow transition-all
          ${big ? "w-5 h-5" : "w-4 h-4"}
          ${on ? (big ? "left-[26px]" : "left-[22px]") : "left-[3px]"}`}
        />
      </div>
    </div>
  );
}
