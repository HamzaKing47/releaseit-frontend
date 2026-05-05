(function () {
  if (window.releaseItLoaded) return;
  window.releaseItLoaded = true;

  const BACKEND = "https://releaseit-backend.onrender.com";

  let settings = {
    mode: "both",
    buttonText: "Buy with Cash on Delivery",
    bgColor: "#000000",
    textColor: "#ffffff",
    borderRadius: 6,
    position: "below",
  };

  /* =========================
     HIDE FLICKER
  ========================= */
  const hideStyle = document.createElement("style");
  hideStyle.innerHTML = `
    .product-form__submit,
    .shopify-payment-button {
      opacity: 0 !important;
    }
  `;
  document.head.appendChild(hideStyle);

  /* =========================
     BUTTON STYLE
  ========================= */
  const injectStyle = () => {
    const style = document.createElement("style");
    style.innerHTML = `
      .releaseit-btn {
        width: 100%;
        padding: 14px;
        font-weight: 600;
        border-radius: ${settings.borderRadius}px;
        border: 2px solid ${settings.bgColor};
        background: ${settings.bgColor};
        color: ${settings.textColor};
        cursor: pointer;
        transition: all 0.2s ease;
        margin-top: 10px;
        display: block;
      }
      .releaseit-btn:hover {
        background: transparent;
        color: ${settings.bgColor};
      }
    `;
    document.head.appendChild(style);
  };

  /* ==========================================
     PIXEL LOADERS
  ========================================== */

  // 📘 FACEBOOK
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
    fbq("track", "PageView");
  };

  // 📊 GOOGLE GA4
  const loadGoogle = (id) => {
    if (window._gaLoaded) return;
    window._gaLoaded = true;
    const script = document.createElement("script");
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${id}`;
    document.head.appendChild(script);
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { window.dataLayer.push(arguments); };
    gtag("js", new Date());
    gtag("config", id);
  };

  // 🎵 TIKTOK
  const loadTikTok = (id) => {
    if (window.ttq) return;
    !(function (w, d, t) {
      w.TiktokAnalyticsObject = t;
      var ttq = (w[t] = w[t] || []);
      ttq.methods = ["page", "track", "identify", "instances", "debug", "on", "off", "once", "ready", "alias", "group", "enableCookie", "disableCookie"];
      ttq.setAndDefer = function (t, e) {
        t[e] = function () { t.push([e].concat(Array.prototype.slice.call(arguments, 0))); };
      };
      for (var i = 0; i < ttq.methods.length; i++) ttq.setAndDefer(ttq, ttq.methods[i]);
      ttq.load = function (e, n) {
        var r = "https://analytics.tiktok.com/i18n/pixel/events.js?sdkid=" + e;
        var o = document.createElement("script");
        o.type = "text/javascript";
        o.async = true;
        o.src = r;
        document.getElementsByTagName("script")[0].parentNode.insertBefore(o, null);
      };
      ttq.load(id);
      ttq.page();
    })(window, document, "ttq");
  };

  // 👻 SNAPCHAT
  const loadSnapchat = (id) => {
    if (window.snaptr) return;
    !(function (e, t, n) {
      if (e.snaptr) return;
      var a = (e.snaptr = function () {
        a.handleRequest ? a.handleRequest.apply(a, arguments) : a.queue.push(arguments);
      });
      a.queue = [];
      var s = "script";
      var r = t.createElement(s);
      r.async = true;
      r.src = n;
      var u = t.getElementsByTagName(s)[0];
      u.parentNode.insertBefore(r, u);
    })(window, document, "https://sc-static.net/scevent.min.js");
    snaptr("init", id);
    snaptr("track", "PAGE_VIEW");
  };

  // 📌 PINTEREST
  const loadPinterest = (id) => {
    if (window.pintrk) return;
    window.pintrk = function () {
      window.pintrk.queue.push(Array.prototype.slice.call(arguments));
    };
    window.pintrk.queue = [];
    window.pintrk.version = "3.0";
    var script = document.createElement("script");
    script.async = true;
    script.src = "https://s.pinimg.com/ct/core.js";
    document.head.appendChild(script);
    pintrk("load", id);
    pintrk("page");
  };

  // 💬 SHARECHAT
  const loadShareChat = (id) => {
    if (window._scPixelLoaded) return;
    window._scPixelLoaded = true;
    var script = document.createElement("script");
    script.async = true;
    script.src = "https://sc-analytics.sharechat.com/pixel.js";
    script.onload = function () {
      if (window.SCPixel) {
        SCPixel.init(id);
        SCPixel.track("PageView");
      }
    };
    document.head.appendChild(script);
  };

  // 📢 TABOOLA
  const loadTaboola = (id) => {
    if (window._tfa) return;
    window._tfa = window._tfa || [];
    _tfa.push({ notify: "event", name: "page_view", id: id });
    !(function (t, f, a, x) {
      if (!document.getElementById(x)) {
        t.async = 1;
        t.src = a;
        t.id = x;
        f.parentNode.insertBefore(t, f);
      }
    })(
      document.createElement("script"),
      document.getElementsByTagName("script")[0],
      "//cdn.taboola.com/libtrc/unip/" + id + "/tfa.js",
      "tb_tfa_script"
    );
  };

  // 🎬 KWAI
  const loadKwai = (id) => {
    if (window.kwaiPixel) return;
    var script = document.createElement("script");
    script.async = true;
    script.src = "https://s.kwai.com/s/kwai-pixel.js";
    script.onload = function () {
      if (window.kwaiPixel) {
        kwaiPixel.init(id);
        kwaiPixel.track("PAGE_VIEW");
      }
    };
    document.head.appendChild(script);
  };

  /* =========================
     FIRE PURCHASE EVENT
     (Thank You page pe call karo)
  ========================= */
  window.releaseItPurchase = function (orderId, value, currency) {
    currency = currency || "PKR";

    // Facebook
    if (window.fbq) fbq("track", "Purchase", { value: value, currency: currency });

    // Google GA4
    if (window.gtag) gtag("event", "purchase", { transaction_id: orderId, value: value, currency: currency });

    // TikTok
    if (window.ttq) ttq.track("CompletePayment", { value: value, currency: currency });

    // Snapchat
    if (window.snaptr) snaptr("track", "PURCHASE", { price: value, currency: currency });

    // Pinterest
    if (window.pintrk) pintrk("track", "checkout", { value: value, currency: currency, order_id: orderId });

    // ShareChat
    if (window.SCPixel) SCPixel.track("Purchase", { value: value, currency: currency });

    // Taboola
    if (window._tfa) _tfa.push({ notify: "event", name: "make_purchase" });

    // Kwai
    if (window.kwaiPixel) kwaiPixel.track("PURCHASE", { value: value });
  };

  /* =========================
     FIRE INITIATE CHECKOUT
  ========================= */
  const fireInitiateCheckout = () => {
    if (window.fbq) fbq("track", "InitiateCheckout");
    if (window.gtag) gtag("event", "begin_checkout");
    if (window.ttq) ttq.track("InitiateCheckout");
    if (window.snaptr) snaptr("track", "START_CHECKOUT");
    if (window.pintrk) pintrk("track", "checkout");
    if (window.SCPixel) SCPixel.track("InitiateCheckout");
    if (window._tfa) _tfa.push({ notify: "event", name: "start_checkout" });
    if (window.kwaiPixel) kwaiPixel.track("BEGIN_CHECKOUT");
  };

  /* =========================
     LOAD ALL PIXELS FROM API
  ========================= */
  const loadPixels = async (shop) => {
    try {
      const res = await fetch(`${BACKEND}/api/pixels?shop=${shop}`);
      if (!res.ok) return;
      const data = await res.json();
      if (!data.success || !Array.isArray(data.pixels)) return;

      data.pixels.forEach((p) => {
        if (!p.pixelId) return;
        switch (p.type) {
          case "facebook":   loadFacebook(p.pixelId);   break;
          case "google":     loadGoogle(p.pixelId);     break;
          case "tiktok":     loadTikTok(p.pixelId);     break;
          case "snapchat":   loadSnapchat(p.pixelId);   break;
          case "pinterest":  loadPinterest(p.pixelId);  break;
          case "sharechat":  loadShareChat(p.pixelId);  break;
          case "taboola":    loadTaboola(p.pixelId);    break;
          case "kwai":       loadKwai(p.pixelId);       break;
        }
      });
    } catch (err) {
      console.log("[ReleaseIt] Pixel load failed:", err.message);
    }
  };

  /* =========================
     FETCH SETTINGS
  ========================= */
  const fetchSettings = async (shop) => {
    try {
      const res = await fetch(`${BACKEND}/api/settings?shop=${shop}`);
      const data = await res.json();
      if (data.success) settings = { ...settings, ...data };
    } catch {}
  };

  const waitForButton = () =>
    new Promise((resolve) => {
      const i = setInterval(() => {
        const btn =
          document.querySelector('button[name="add"]') ||
          document.querySelector(".product-form__submit");
        if (btn) {
          clearInterval(i);
          resolve(btn);
        }
      }, 120);
    });

  /* =========================
     START
  ========================= */
  const start = async () => {
    const shop = window.Shopify?.shop;
    if (!shop) return;

    await fetchSettings(shop);
    await loadPixels(shop);
    injectStyle();

    const addBtn = await waitForButton();
    const form = addBtn.closest("form");
    if (!form) return;

    const buyNowBtn =
      document.querySelector(".shopify-payment-button") ||
      document.querySelector(".shopify-payment-button__button");

    const codBtn = document.createElement("button");
    codBtn.className = "releaseit-btn";
    codBtn.innerText = settings.buttonText;

    codBtn.onclick = (e) => {
      e.preventDefault();

      fireInitiateCheckout();

      const variantId = form.querySelector('input[name="id"]')?.value;
      if (!variantId) return;

      const productHandle = window.location.pathname
        .split("/products/")[1]
        ?.split("?")[0];

      window.location.href =
        `https://releaseitnow.vercel.app/?shop=${shop}` +
        `&variant=${variantId}&product=${productHandle}`;
    };

    /* POSITION */
    if (settings.position === "above") {
      addBtn.parentNode.insertBefore(codBtn, addBtn);
    } else if (settings.position === "below_buy_now" && buyNowBtn) {
      buyNowBtn.insertAdjacentElement("afterend", codBtn);
    } else {
      addBtn.insertAdjacentElement("afterend", codBtn);
    }

    /* MODE */
    if (settings.mode === "replace") addBtn.style.display = "none";
    if (settings.mode === "replace_buy_now" && buyNowBtn)
      buyNowBtn.style.display = "none";
    if (settings.mode === "cod_only") {
      addBtn.style.display = "none";
      if (buyNowBtn) buyNowBtn.style.display = "none";
    }

    setTimeout(() => {
      hideStyle.remove();
    }, 120);
  };

  start();
})();
