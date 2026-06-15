import { useEffect, useState } from "react";
import { BACKEND } from "./backend.js";

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
    t = b.createElement(e);
    t.async = true;
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
  window.gtag = function () {
    window.dataLayer.push(arguments);
  };
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
      t[e] = function () {
        t.push([e].concat(Array.prototype.slice.call(arguments, 0)));
      };
    };
    for (var i = 0; i < ttq.methods.length; i++)
      ttq.setAndDefer(ttq, ttq.methods[i]);
    ttq.load = function (e) {
      var s = d.createElement("script");
      s.async = true;
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
      a.handleRequest
        ? a.handleRequest.apply(a, arguments)
        : a.queue.push(arguments);
    });
    a.queue = [];
    var r = t.createElement("script");
    r.async = true;
    r.src = n;
    t.getElementsByTagName("script")[0].parentNode.insertBefore(
      r,
      t.getElementsByTagName("script")[0],
    );
  })(window, document, "https://sc-static.net/scevent.min.js");
  snaptr("init", id);
};

const loadPinterest = (id) => {
  if (window.pintrk) return;
  window.pintrk = function () {
    window.pintrk.queue.push(Array.prototype.slice.call(arguments));
  };
  window.pintrk.queue = [];
  window.pintrk.version = "3.0";
  var s = document.createElement("script");
  s.async = true;
  s.src = "https://s.pinimg.com/ct/core.js";
  document.head.appendChild(s);
  pintrk("load", id);
};

const loadTaboola = (id) => {
  if (window._tfa) return;
  window._tfa = [];
  var s = document.createElement("script");
  s.async = true;
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
          if (window.fbq)
            fbq("track", "Purchase", {
              value: val,
              currency: "PKR",
              order_id: oid,
            });
          break;
        case "google":
          if (window.gtag)
            gtag("event", "purchase", {
              transaction_id: oid,
              value: val,
              currency: "PKR",
            });
          break;
        case "tiktok":
          if (window.ttq)
            ttq.track("CompletePayment", {
              value: val,
              currency: "PKR",
              order_id: oid,
            });
          break;
        case "snapchat":
          if (window.snaptr)
            snaptr("track", "PURCHASE", { price: val, currency: "PKR" });
          break;
        case "pinterest":
          if (window.pintrk)
            pintrk("track", "checkout", {
              value: val,
              currency: "PKR",
              order_id: oid,
            });
          break;
        case "taboola":
          if (window._tfa)
            _tfa.push({
              notify: "event",
              name: "make_purchase",
              id: p.pixelId,
            });
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
    const orderId = params.get("orderId");
    const value = params.get("value");

    // "Back to Store" always goes to the store home (a product handle isn't
    // reliably available here, and the store root is always valid).
    if (shop) {
      setShopUrl(`https://${shop}`);
    }

    if (!shop) {
      setLoading(false);
      return;
    }

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
              case "facebook":
                loadFacebook(p.pixelId);
                break;
              case "google":
                loadGoogle(p.pixelId);
                break;
              case "tiktok":
                loadTikTok(p.pixelId);
                break;
              case "snapchat":
                loadSnapchat(p.pixelId);
                break;
              case "pinterest":
                loadPinterest(p.pixelId);
                break;
              case "taboola":
                loadTaboola(p.pixelId);
                break;
            }
          });
          firePurchase(pixels, orderId, value);
        }
      })
      .catch((err) => console.log("[Order Now]", err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="w-9 h-9 border-[3px] border-gray-200 border-t-gray-900 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 transition-colors"
      style={{ background: ty.bgColor }}
    >
      <div
        className="rounded-[20px] shadow-[0_8px_32px_rgba(0,0,0,0.10)] px-8 py-10 text-center max-w-[420px] w-full"
        style={{ background: ty.cardColor }}
      >
        <div
          className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-[30px]"
          style={{ background: ty.headingColor + "20" }}
        >
          ✅
        </div>

        <h1
          className="font-bold text-[22px] mb-2.5"
          style={{ color: ty.headingColor }}
        >
          {ty.heading}
        </h1>

        <p
          className="text-[15px] mb-2 leading-relaxed"
          style={{ color: ty.textColor }}
        >
          {ty.subtext}
        </p>

        <p className="text-gray-400 text-[13px] mb-7 leading-relaxed">
          {ty.note}
        </p>

        {shopUrl && (
          <button
            onClick={() => (window.location.href = shopUrl)}
            className="bg-gray-900 hover:bg-gray-700 text-white rounded-[10px] px-7 py-3 text-[14px] font-semibold cursor-pointer transition-colors"
          >
            {ty.buttonText}
          </button>
        )}
      </div>
    </div>
  );
}

export default ThankYou;
