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

  // hide flicker
  const hideStyle = document.createElement("style");
  hideStyle.innerHTML = `
    .product-form__submit,
    .shopify-payment-button {
      opacity: 0 !important;
    }
  `;
  document.head.appendChild(hideStyle);

  // 🔥 LOAD PIXELS
  const loadPixels = async (shop) => {
    try {
      const res = await fetch(`${BACKEND}/api/pixels?shop=${shop}`);
      const data = await res.json();

      if (!data.success) return;

      data.pixels.forEach((p) => {
        if (p.type === "facebook") loadFacebookPixel(p.pixelId);
        if (p.type === "tiktok") loadTikTokPixel(p.pixelId);
      });
    } catch {}
  };

  const loadFacebookPixel = (id) => {
    if (window.fbq) return;

    !(function (f, b, e, v, n, t, s) {
      if (f.fbq) return;
      n = f.fbq = function () {
        n.callMethod
          ? n.callMethod.apply(n, arguments)
          : n.queue.push(arguments);
      };
      if (!f._fbq) f._fbq = n;
      n.push = n;
      n.loaded = true;
      n.version = "2.0";
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

  const loadTikTokPixel = (id) => {
    !(function (w, d, t) {
      w.TiktokAnalyticsObject = t;
      var ttq = (w[t] = w[t] || []);
      ttq.methods = ["page", "track"];
      ttq.setAndDefer = function (t, e) {
        t[e] = function () {
          t.push([e].concat(Array.prototype.slice.call(arguments, 0)));
        };
      };
      for (var i = 0; i < ttq.methods.length; i++) {
        ttq.setAndDefer(ttq, ttq.methods[i]);
      }
      ttq.load = function (e) {
        var i = "https://analytics.tiktok.com/i18n/pixel/events.js";
        var a = d.createElement("script");
        a.async = true;
        a.src = i + "?sdkid=" + e;
        var s = d.getElementsByTagName("script")[0];
        s.parentNode.insertBefore(a, s);
      };
      ttq.load(id);
      ttq.page();
    })(window, document, "ttq");
  };

  const fetchSettings = async (shop) => {
    try {
      const res = await fetch(`${BACKEND}/api/settings?shop=${shop}`);
      const data = await res.json();
      if (data.success) settings = { ...settings, ...data };
    } catch {}
  };

  const waitForButton = () => {
    return new Promise((resolve) => {
      const interval = setInterval(() => {
        const btn =
          document.querySelector('button[name="add"]') ||
          document.querySelector(".product-form__submit");

        if (btn) {
          clearInterval(interval);
          resolve(btn);
        }
      }, 150);
    });
  };

  const start = async () => {
    const shop = window.Shopify?.shop;
    if (!shop) return;

    await fetchSettings(shop);
    await loadPixels(shop); // 🔥 important

    const addBtn = await waitForButton();
    const form = addBtn.closest("form");
    if (!form) return;

    const buyNowBtn =
      document.querySelector(".shopify-payment-button") ||
      document.querySelector(".shopify-payment-button__button");

    const codBtn = document.createElement("button");
    codBtn.innerText = settings.buttonText;

    codBtn.style.cssText = `
      background: ${settings.bgColor};
      color: ${settings.textColor};
      padding: 14px;
      width: 100%;
      font-weight: 600;
      border-radius: ${settings.borderRadius}px;
      cursor: pointer;
      margin-top: 12px;
    `;

    codBtn.onclick = (e) => {
      e.preventDefault();

      // 🔥 EVENT FIRE
      if (window.fbq) fbq("track", "InitiateCheckout");
      if (window.ttq) ttq.track("InitiateCheckout");

      const variantInput = form.querySelector('input[name="id"]');
      if (!variantInput) return;

      const variantId = variantInput.value;

      window.location.href = `https://releaseitnow.vercel.app/?shop=${shop}&variant=${variantId}`;
    };

    addBtn.insertAdjacentElement("afterend", codBtn);

    setTimeout(() => {
      hideStyle.remove();
    }, 100);
  };

  start();
})();
