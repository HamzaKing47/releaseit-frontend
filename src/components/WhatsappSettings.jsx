import { useState, useEffect, useRef } from "react";
import { BACKEND } from "../backend.js";

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
  const [connectMsg, setConnectMsg] = useState("");
  const [usage, setUsage] = useState(null);

  const pollRef = useRef(null);
  const isMounted = useRef(true);

  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
      clearInterval(pollRef.current);
    };
  }, []);

  /* ── LOAD ── */
  useEffect(() => {
    if (!shop) return;
    fetch(`${BACKEND}/api/whatsapp/settings?shop=${shop}`)
      .then((r) => r.json())
      .then((d) => {
        if (!d.success || !isMounted.current) return;
        setSettings({
          whatsappNumber: d.whatsappNumber || "",
          enabled: d.enabled ?? true,
          sendOnOrderCreate: d.sendOnOrderCreate ?? true,
          sendOnFulfillment: d.sendOnFulfillment ?? true,
          sendOnCancellation: d.sendOnCancellation ?? false,
          messageTemplate: d.messageTemplate || DEFAULT_TEMPLATE,
        });
        setStatus(d.status || "disconnected");
        if (d.usage) setUsage(d.usage);
      })
      .catch(console.error);
  }, [shop]);

  /* ── POLL FOR QR ── */
  const startPolling = () => {
    clearInterval(pollRef.current);
    let attempts = 0;
    const MAX_ATTEMPTS = 40; // 40 x 3s = 2 minutes

    pollRef.current = setInterval(async () => {
      if (!isMounted.current) {
        clearInterval(pollRef.current);
        return;
      }

      attempts++;
      if (attempts > MAX_ATTEMPTS) {
        clearInterval(pollRef.current);
        if (isMounted.current) {
          setStatus("disconnected");
          setLoading(false);
          setConnectMsg("❌ Connection timed out. Please try again.");
        }
        return;
      }

      try {
        const r = await fetch(`${BACKEND}/api/whatsapp/qr?shop=${shop}`);
        const d = await r.json();
        if (!isMounted.current) return;

        if (d.status === "connected") {
          clearInterval(pollRef.current);
          setStatus("connected");
          setQrCode(null);
          setLoading(false);
          setConnectMsg("");
        } else if (d.status === "waiting_qr" && d.qrCode) {
          setQrCode(d.qrCode);
          setStatus("waiting_qr");
          setLoading(false);
          setConnectMsg("");
        } else if (d.status === "starting") {
          setConnectMsg(`⏳ Starting WhatsApp session... (${attempts * 3}s)`);
        }
      } catch (err) {
        console.error("[WA Poll]", err.message);
      }
    }, 3000);
  };

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

  /* ── CONNECT — saves first, then starts async connection ── */
  const handleConnect = async () => {
    if (!settings.whatsappNumber) return;
    setLoading(true);
    setQrCode(null);
    setConnectMsg("⏳ Saving settings...");

    // Save first
    await fetch(`${BACKEND}/api/whatsapp/settings`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ shop, ...settings }),
    });

    setConnectMsg("⏳ Starting WhatsApp connection...");

    // Start connection — backend immediately returns "starting"
    const r = await fetch(`${BACKEND}/api/whatsapp/connect?shop=${shop}`);
    const d = await r.json();

    if (d.status === "connected") {
      setStatus("connected");
      setLoading(false);
      setConnectMsg("");
      return;
    }

    if (d.status === "waiting_qr" && d.qrCode) {
      setQrCode(d.qrCode);
      setStatus("waiting_qr");
      setLoading(false);
      setConnectMsg("");
      return;
    }

    // "starting" — poll karo
    if (d.status === "starting" || d.success) {
      setConnectMsg("⏳ Initializing WhatsApp, please wait...");
      startPolling();
    } else {
      setLoading(false);
      setConnectMsg(`❌ ${d.message || "Connection failed."}`);
    }
  };

  /* ── DISCONNECT ── */
  const handleDisconnect = async () => {
    if (!confirm("Disconnect WhatsApp? Session will be cleared.")) return;
    clearInterval(pollRef.current);
    await fetch(`${BACKEND}/api/whatsapp/disconnect`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ shop }),
    });
    setStatus("disconnected");
    setQrCode(null);
    setConnectMsg("");
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

  const formatWaNum = (n) =>
    n.replace(/\D/g, "").replace(/^0(\d{10})$/, "92$1");
  const waNum = formatWaNum(settings.whatsappNumber || "");
  const sampleLink =
    waNum.length >= 10 ? `https://wa.me/${waNum}?text=CONFIRM-1001` : null;

  const SC = {
    connected: {
      dot: "bg-green-500",
      badge: "bg-green-50 text-green-700 border-green-200",
      label: "Connected",
    },
    waiting_qr: {
      dot: "bg-yellow-400",
      badge: "bg-yellow-50 text-yellow-700 border-yellow-200",
      label: "Scan QR Code",
    },
    connecting: {
      dot: "bg-blue-400",
      badge: "bg-blue-50 text-blue-700 border-blue-200",
      label: "Connecting...",
    },
    starting: {
      dot: "bg-blue-400",
      badge: "bg-blue-50 text-blue-700 border-blue-200",
      label: "Starting...",
    },
    disconnected: {
      dot: "bg-gray-300",
      badge: "bg-gray-50 text-gray-500 border-gray-200",
      label: "Disconnected",
    },
  };
  const sc = SC[status] || SC.disconnected;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-7">
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
          <span
            className={`w-2 h-2 rounded-full ${sc.dot} ${status === "connecting" || status === "starting" ? "animate-pulse" : ""}`}
          />
          {sc.label}
        </span>
      </div>

      <div className="border-t border-gray-100 mb-6" />

      {/* USAGE BAR */}
      {usage && <UsageBar usage={usage} />}

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
        {/* ── STEP 1: NUMBER ── */}
        <div className="mb-7">
          <StepLabel n="1" title="Your Store WhatsApp Number" />
          <p className="text-[12px] text-gray-400 mt-1 mb-3 ml-8">
            This is the number customers will send replies to. Must match the
            connected WhatsApp.
          </p>
          <input
            value={settings.whatsappNumber}
            onChange={(e) => upd("whatsappNumber", e.target.value)}
            placeholder="e.g. 03001234567 or 923001234567"
            className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-[13px] bg-gray-50 focus:outline-none focus:border-gray-400 transition"
          />
          {sampleLink && (
            <div className="mt-3 bg-green-50 border border-green-100 rounded-xl p-3">
              <p className="text-[11px] font-bold text-green-700 mb-1.5">
                ✅ Sample link for customers:
              </p>
              <code className="text-[11px] text-green-800 bg-white px-2 py-1 rounded-md border border-green-100 break-all block">
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
              <div className="flex items-center justify-center gap-2 mb-3">
                <span className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse" />
                <p className="text-[12px] text-yellow-700 font-semibold">
                  Waiting for scan... auto-detects
                </p>
              </div>
              <button
                onClick={() => {
                  clearInterval(pollRef.current);
                  setQrCode(null);
                  setStatus("disconnected");
                  setConnectMsg("");
                }}
                className="text-[11px] text-gray-400 hover:text-gray-600"
              >
                Cancel
              </button>
            </div>
          ) : (
            <div className="mt-3">
              <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 mb-4 text-[12px] text-amber-800">
                <p className="font-bold mb-1">⚠️ Use a Dedicated Number</p>
                <p className="text-amber-700">
                  Use a separate SIM card — not your personal or main business
                  number.
                </p>
              </div>

              {connectMsg && (
                <div className="bg-blue-50 border border-blue-100 rounded-xl px-4 py-3 mb-4">
                  <p className="text-[12px] text-blue-700 font-semibold">
                    {connectMsg}
                  </p>
                  <p className="text-[11px] text-blue-500 mt-1">
                    This may take 30-60 seconds on first run. Please wait...
                  </p>
                </div>
              )}

              <button
                onClick={handleConnect}
                disabled={loading || !settings.whatsappNumber}
                className="flex items-center gap-2 bg-[#25D366] hover:bg-[#1ebe5a] disabled:opacity-50 text-white font-bold px-6 py-3 rounded-xl text-[14px] transition shadow-sm"
              >
                {loading ? (
                  <>
                    <span className="animate-spin inline-block">⏳</span>{" "}
                    Connecting...
                  </>
                ) : (
                  <>📱 Connect WhatsApp</>
                )}
              </button>
              {!settings.whatsappNumber && (
                <p className="text-[11px] text-red-400 mt-2">
                  ⚠️ Enter your WhatsApp number first (Step 1)
                </p>
              )}
            </div>
          )}
        </div>

        {/* ── STEP 3: TEMPLATE ── */}
        <div className="mb-7">
          <StepLabel n="3" title="Order Confirmation Message" />
          <div className="mt-3 bg-gray-50 border border-gray-200 rounded-xl p-3 mb-4">
            <p className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-2">
              Variables
            </p>
            <div className="flex flex-wrap gap-1.5 mb-2">
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
            <p className="text-[11px] text-gray-400">
              Keep{" "}
              <code className="bg-white px-1 rounded">1️⃣ - Confirm Order</code>,{" "}
              <code className="bg-white px-1 rounded">2️⃣ - Update Address</code>
              , <code className="bg-white px-1 rounded">3️⃣ - Cancel Order</code>{" "}
              exactly — links will be auto-injected.
            </p>
          </div>

          {/* Two-column on wide screens — editor left, live preview right */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div>
              <p className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-2">
                ✏️ Template Editor
              </p>
              <textarea
                rows={18}
                value={settings.messageTemplate}
                onChange={(e) => upd("messageTemplate", e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-[13px] bg-gray-50 focus:outline-none focus:border-gray-400 transition font-mono resize-y h-full min-h-[360px]"
              />
            </div>
            <div>
              <p className="text-[11px] font-bold text-green-700 uppercase tracking-wider mb-2">
                📱 Customer Will See
              </p>
              <div className="bg-[#e9fbe5] border border-[#c3f0b0] rounded-xl p-4 h-full min-h-[360px] overflow-auto">
                <pre className="text-[12px] text-gray-700 whitespace-pre-wrap font-sans leading-relaxed">
                  {settings.messageTemplate
                    .replace(/{{name}}/g, "Ahmed")
                    .replace(/{{orderName}}/g, "#1001")
                    .replace(/{{currency}}/g, "PKR")
                    .replace(/{{total}}/g, "2,500")
                    .replace(/{{address}}/g, "House 12, Lahore")
                    .replace(
                      "1️⃣ - Confirm Order",
                      waNum.length >= 10
                        ? `✅ *Confirm Order:*\nhttps://wa.me/${waNum}?text=CONFIRM-1001`
                        : "1️⃣ - Confirm Order",
                    )
                    .replace(
                      "2️⃣ - Update Address",
                      waNum.length >= 10
                        ? `📍 *Update Address:*\nhttps://wa.me/${waNum}?text=ADDRESS-1001`
                        : "2️⃣ - Update Address",
                    )
                    .replace(
                      "3️⃣ - Cancel Order",
                      waNum.length >= 10
                        ? `❌ *Cancel Order:*\nhttps://wa.me/${waNum}?text=CANCEL-1001`
                        : "3️⃣ - Cancel Order",
                    )}
                </pre>
              </div>
            </div>
          </div>
        </div>

        {/* ── STEP 4: TRIGGERS ── */}
        <div className="mb-7">
          <StepLabel n="4" title="When to Send" />
          <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-3">
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

function UsageBar({ usage }) {
  const {
    plan,
    sent,
    limit,
    remaining,
    percentUsed,
    cycleEnd,
    dailySent = 0,
    dailyCap = 0,
    warmingUp = false,
    warmupDaysLeft = 0,
  } = usage;
  const planLabel =
    { free: "Free", starter: "Starter", growth: "Growth", pro: "Pro" }[plan] ||
    "Free";

  // Color shifts as monthly usage climbs
  const barColor =
    percentUsed >= 100
      ? "bg-red-500"
      : percentUsed >= 80
        ? "bg-amber-500"
        : "bg-green-500";
  const isOver = remaining <= 0;
  const isNear = percentUsed >= 80 && !isOver;

  // Daily cap status
  const dailyPct = dailyCap > 0 ? Math.min(100, (dailySent / dailyCap) * 100) : 0;
  const dailyOver = dailyCap > 0 && dailySent >= dailyCap;

  const resetDate = cycleEnd
    ? new Date(cycleEnd).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
      })
    : "";

  return (
    <div
      className={`mb-6 rounded-xl border p-4 ${
        isOver
          ? "bg-red-50 border-red-200"
          : isNear
            ? "bg-amber-50 border-amber-200"
            : "bg-gray-50 border-gray-200"
      }`}
    >
      {/* Monthly */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="text-[13px] font-bold text-gray-900">
            Message Usage
          </span>
          <span className="text-[10px] font-bold uppercase tracking-wide bg-gray-900 text-white px-2 py-0.5 rounded-full">
            {planLabel} Plan
          </span>
        </div>
        <span className="text-[12px] font-semibold text-gray-600">
          {sent.toLocaleString()} / {limit.toLocaleString()}
        </span>
      </div>

      <div className="w-full h-2.5 bg-gray-200 rounded-full overflow-hidden">
        <div
          className={`h-full ${barColor} transition-all duration-500`}
          style={{ width: `${Math.min(100, percentUsed)}%` }}
        />
      </div>

      <div className="flex items-center justify-between mt-2">
        <p className="text-[11px] text-gray-500">
          {isOver ? (
            <span className="text-red-600 font-semibold">
              ⚠️ Monthly limit reached — resets {resetDate}
            </span>
          ) : isNear ? (
            <span className="text-amber-700 font-semibold">
              ⚠️ {remaining.toLocaleString()} messages left this cycle
            </span>
          ) : (
            <>
              {remaining.toLocaleString()} messages left · resets {resetDate}
            </>
          )}
        </p>
        {(isOver || isNear) && (
          <span className="text-[11px] font-bold text-blue-600">
            Upgrade plan →
          </span>
        )}
      </div>

      {/* Daily cap + warm-up */}
      {dailyCap > 0 && (
        <div className="mt-3 pt-3 border-t border-gray-200/70">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[11px] font-semibold text-gray-600">
              Today's sends
            </span>
            <span className="text-[11px] font-semibold text-gray-500">
              {dailySent.toLocaleString()} / {dailyCap.toLocaleString()}
            </span>
          </div>
          <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-500 ${
                dailyOver ? "bg-red-400" : "bg-blue-400"
              }`}
              style={{ width: `${dailyPct}%` }}
            />
          </div>
          {warmingUp ? (
            <p className="text-[11px] text-blue-600 mt-1.5">
              🔥 Number warm-up in progress — daily limit is reduced for the
              first few weeks to protect your number from bans. Full speed in ~
              {warmupDaysLeft} day{warmupDaysLeft === 1 ? "" : "s"}.
            </p>
          ) : dailyOver ? (
            <p className="text-[11px] text-red-600 mt-1.5 font-semibold">
              ⚠️ Daily cap reached — remaining messages resume tomorrow. This
              paces sending to keep your WhatsApp number safe.
            </p>
          ) : (
            <p className="text-[11px] text-gray-400 mt-1.5">
              Daily cap protects your number from WhatsApp bans. Unused
              messages roll into the monthly total.
            </p>
          )}
        </div>
      )}
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
