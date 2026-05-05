import { useEffect, useState } from "react";

const BACKEND = "https://releaseit-backend.onrender.com";

const DEFAULTS = {
  heading: "Order Confirmed!",
  subtext: "Thank you! Your order has been placed successfully.",
  note: "Our team will contact you soon to confirm your order.",
  buttonText: "Back to Store",
  bgColor: "#f3f4f6",
  cardColor: "#ffffff",
  headingColor: "#16a34a",
  textColor: "#374151",
};

/* ============================================================
   PIXEL LOADERS
============================================================ */
const loadFacebook = (id) => {
  if (window.fbq) return;
  !(function (f, b, e, v, n, t, s) {
    if (f.fbq) return;
    n = f.fbq = function () {
      n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
    };
    if (!f._fbq) f._fbq = n;
    n.queue = [];
    t = b.createElement(e); t.async = true;
    t.src = "https://connect.facebook.net/en_US/fbevents.js";
    s = b.getElementsByTagName(e)[0];
    s.parentNode.insertBefore(t, s);
  })(window, document, "script");
  fbq("init", id);
};

const loadGoogle = (id) => {
  if (window._gaLoaded) return;
  window._gaLoaded = true;
  const s = document.createElement("script");
  s.async = true;
  s.src = `https://www.googletagmanager.com/gtag/js?id=${id}`;
  document.head.appendChild(s);
  window.dataLayer = window.dataLayer || [];
  window.gtag = function () { window.dataLayer.push(arguments); };
  gtag("js", new Date());
  gtag("config", id);
};

const loadTikTok = (id) => {
  if (window.ttq) return;
  !(function (w, d, t) {
    w.TiktokAnalyticsObject = t;
    var ttq = (w[t] = w[t] || []);
    ttq.methods = ["page", "track", "identify"];
    ttq.setAndDefer = function (t, e) {
      t[e] = function () { t.push([e].concat(Array.prototype.slice.call(arguments, 0))); };
    };
    for (var i = 0; i < ttq.methods.length; i++) ttq.setAndDefer(ttq, ttq.methods[i]);
    ttq.load = function (e) {
      var s = d.createElement("script"); s.async = true;
      s.src = "https://analytics.tiktok.com/i18n/pixel/events.js?sdkid=" + e;
      d.getElementsByTagName("script")[0].parentNode.insertBefore(s, null);
    };
    ttq.load(id);
  })(window, document, "ttq");
};

const loadSnapchat = (id) => {
  if (window.snaptr) return;
  !(function (e, t, n) {
    if (e.snaptr) return;
    var a = (e.snaptr = function () {
      a.handleRequest ? a.handleRequest.apply(a, arguments) : a.queue.push(arguments);
    });
    a.queue = [];
    var r = t.createElement("script"); r.async = true;
    r.src = n;
    t.getElementsByTagName("script")[0].parentNode.insertBefore(r, t.getElementsByTagName("script")[0]);
  })(window, document, "https://sc-static.net/scevent.min.js");
  snaptr("init", id);
};

const loadPinterest = (id) => {
  if (window.pintrk) return;
  window.pintrk = function () { window.pintrk.queue.push(Array.prototype.slice.call(arguments)); };
  window.pintrk.queue = []; window.pintrk.version = "3.0";
  var s = document.createElement("script"); s.async = true;
  s.src = "https://s.pinimg.com/ct/core.js";
  document.head.appendChild(s);
  pintrk("load", id);
};

const loadTaboola = (id) => {
  if (window._tfa) return;
  window._tfa = [];
  var s = document.createElement("script"); s.async = true;
  s.src = "//cdn.taboola.com/libtrc/unip/" + id + "/tfa.js";
  document.head.appendChild(s);
};

const firePurchase = (pixels, orderId, value) => {
  setTimeout(() => {
    const val = parseFloat(value) || 0;
    const oid = String(orderId || "");
    pixels.forEach((p) => {
      switch (p.type) {
        case "facebook":
          if (window.fbq) fbq("track", "Purchase", { value: val, currency: "PKR", order_id: oid });
          break;
        case "google":
          if (window.gtag) gtag("event", "purchase", { transaction_id: oid, value: val, currency: "PKR" });
          break;
        case "tiktok":
          if (window.ttq) ttq.track("CompletePayment", { value: val, currency: "PKR", order_id: oid });
          break;
        case "snapchat":
          if (window.snaptr) snaptr("track", "PURCHASE", { price: val, currency: "PKR" });
          break;
        case "pinterest":
          if (window.pintrk) pintrk("track", "checkout", { value: val, currency: "PKR", order_id: oid });
          break;
        case "taboola":
          if (window._tfa) _tfa.push({ notify: "event", name: "make_purchase", id: p.pixelId });
          break;
      }
    });
  }, 1500);
};

/* ============================================================
   COMPONENT
============================================================ */
function ThankYou() {
  const [shopUrl, setShopUrl] = useState("");
  const [ty, setTy] = useState(DEFAULTS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const shop = params.get("shop");
    const product = params.get("product");
    const orderId = params.get("orderId");
    const value = params.get("value");

    if (shop && product) {
      setShopUrl(`https://${shop}/products/${decodeURIComponent(product)}`);
    } else if (shop) {
      setShopUrl(`https://${shop}`);
    }

    if (!shop) { setLoading(false); return; }

    // 🔥 Settings + Pixels parallel fetch
    Promise.all([
      fetch(`${BACKEND}/api/settings?shop=${shop}`).then((r) => r.json()),
      fetch(`${BACKEND}/api/pixels?shop=${shop}`).then((r) => r.json()),
    ])
      .then(([settingsData, pixelsData]) => {
        // Custom thank you text apply karo
        if (settingsData.success && settingsData.thankYou) {
          setTy({ ...DEFAULTS, ...settingsData.thankYou });
        }

        // Pixels load + Purchase fire
        if (pixelsData.success && Array.isArray(pixelsData.pixels)) {
          const pixels = pixelsData.pixels.filter((p) => p.pixelId);
          pixels.forEach((p) => {
            switch (p.type) {
              case "facebook":  loadFacebook(p.pixelId);  break;
              case "google":    loadGoogle(p.pixelId);    break;
              case "tiktok":    loadTikTok(p.pixelId);    break;
              case "snapchat":  loadSnapchat(p.pixelId);  break;
              case "pinterest": loadPinterest(p.pixelId); break;
              case "taboola":   loadTaboola(p.pixelId);   break;
            }
          });
          firePurchase(pixels, orderId, value);
        }
      })
      .catch((err) => console.log("[ReleaseIt]", err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#f3f4f6" }}>
        <div style={{ width: "36px", height: "36px", border: "3px solid #e5e7eb", borderTop: "3px solid #111", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: ty.bgColor,
        padding: "16px",
        transition: "background 0.3s",
      }}
    >
      <div
        style={{
          background: ty.cardColor,
          borderRadius: "20px",
          boxShadow: "0 8px 32px rgba(0,0,0,0.10)",
          padding: "40px 32px",
          textAlign: "center",
          maxWidth: "420px",
          width: "100%",
        }}
      >
        <div
          style={{
            width: "64px", height: "64px", borderRadius: "50%",
            background: ty.headingColor + "20",
            display: "flex", alignItems: "center", justifyContent: "center",
            margin: "0 auto 16px", fontSize: "30px",
          }}
        >
          ✅
        </div>

        <h1 style={{ color: ty.headingColor, fontWeight: 700, fontSize: "22px", marginBottom: "10px" }}>
          {ty.heading}
        </h1>

        <p style={{ color: ty.textColor, fontSize: "15px", marginBottom: "8px", lineHeight: "1.6" }}>
          {ty.subtext}
        </p>

        <p style={{ color: "#9ca3af", fontSize: "13px", marginBottom: "28px", lineHeight: "1.6" }}>
          {ty.note}
        </p>

        {shopUrl && (
          <button
            onClick={() => (window.location.href = shopUrl)}
            style={{
              background: "#111", color: "#fff", border: "none",
              borderRadius: "10px", padding: "13px 28px",
              fontSize: "14px", fontWeight: 600, cursor: "pointer",
              transition: "background 0.2s",
            }}
            onMouseOver={(e) => (e.currentTarget.style.background = "#333")}
            onMouseOut={(e) => (e.currentTarget.style.background = "#111")}
          >
            {ty.buttonText}
          </button>
        )}
      </div>
    </div>
  );
}

export default ThankYou;
