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
        display:block;
      }

      .releaseit-btn:hover {
        background: transparent;
        color: ${settings.bgColor};
      }
    `;
    document.head.appendChild(style);
  };

  /* =========================
     PIXELS
  ========================= */
  const loadPixels = async (shop) => {
    try {
      const res = await fetch(`${BACKEND}/api/pixels?shop=${shop}`);

      if (!res.ok) return; // 👈 FIX

      const data = await res.json();

      if (!data.success || !Array.isArray(data.pixels)) return;

      data.pixels.forEach((p) => {
        if (p.type === "facebook") loadFacebook(p.pixelId);
        if (p.type === "tiktok") loadTikTok(p.pixelId);
      });
    } catch (err) {
      console.log("Pixel load failed");
    }
  };

  const loadFacebook = (id) => {
    if (window.fbq) return;

    !(function (f, b, e, v, n, t, s) {
      if (f.fbq) return;
      n = f.fbq = function () {
        n.callMethod
          ? n.callMethod.apply(n, arguments)
          : n.queue.push(arguments);
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

  const loadTikTok = (id) => {
    if (window.ttq) return;

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
        var s = d.createElement("script");
        s.async = true;
        s.src = "https://analytics.tiktok.com/i18n/pixel/events.js?sdkid=" + e;
        d.getElementsByTagName("script")[0].parentNode.insertBefore(s, null);
      };
      ttq.load(id);
      ttq.page();
    })(window, document, "ttq");
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

      if (window.fbq) fbq("track", "InitiateCheckout");
      if (window.ttq) ttq.track("InitiateCheckout");

      const variantId = form.querySelector('input[name="id"]')?.value;
      if (!variantId) return;

      const productHandle = window.location.pathname
        .split("/products/")[1]
        ?.split("?")[0];

      window.location.href =
        `https://releaseitnow.vercel.app/?shop=${shop}` +
        `&variant=${variantId}&product=${productHandle}`;
    };

    /* POSITION FIX */
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
