(function () {
  if (window.releaseItLoaded) return;
  window.releaseItLoaded = true;

  console.log("🔥 ReleaseIt FINAL PRO Loaded");

  const BACKEND = "https://releaseit-backend.onrender.com";

  let settings = {
    mode: "both",
    buttonText: "Buy with Cash on Delivery",
    bgColor: "#000000",
    textColor: "#ffffff",
    borderRadius: 6,
    position: "below",
  };

  // 🔥 hide buttons (no flicker)
  const hideStyle = document.createElement("style");
  hideStyle.innerHTML = `
    .product-form__submit,
    .shopify-payment-button {
      opacity: 0 !important;
    }
  `;
  document.head.appendChild(hideStyle);

  // 🔥 dynamic button style (CSS hover)
  const injectButtonStyle = () => {
    const style = document.createElement("style");
    style.innerHTML = `
      .releaseit-btn {
        background: ${settings.bgColor};
        color: ${settings.textColor};
        padding: 14px;
        width: 100%;
        font-weight: 600;
        border: 2px solid transparent;
        border-radius: ${settings.borderRadius || 6}px;
        cursor: pointer;
        font-size: 15px;
        transition: all 0.2s ease;
        display: block;
      }

      .releaseit-btn:hover {
        border: 2px solid ${settings.bgColor};
      }
    `;
    document.head.appendChild(style);
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

    // 🔥 inject CSS AFTER settings
    injectButtonStyle();

    const addBtn = await waitForButton();
    const form = addBtn.closest("form");
    if (!form) return;

    if (form.querySelector(".releaseit-btn")) {
      hideStyle.remove();
      return;
    }

    const buyNowBtn =
      document.querySelector(".shopify-payment-button") ||
      document.querySelector(".shopify-payment-button__button");

    // 🔥 create button
    const codBtn = document.createElement("button");
    codBtn.className = "releaseit-btn";
    codBtn.type = "button";
    codBtn.innerText = settings.buttonText;

    // 🔥 spacing fix (no weird gap)
    codBtn.style.marginTop = "10px";

    // 🔥 click
    codBtn.onclick = (e) => {
      e.preventDefault();

      const variantInput = form.querySelector('input[name="id"]');
      if (!variantInput) return;

      const variantId = variantInput.value;

      const productHandle = window.location.pathname
        .split("/products/")[1]
        ?.split("?")[0];

      window.location.href =
        `https://releaseitnow.vercel.app/?shop=${shop}` +
        `&variant=${variantId}&product=${productHandle}`;
    };

    // 🔥 POSITION
    if (settings.position === "above") {
      addBtn.parentNode.insertBefore(codBtn, addBtn);
    } else if (settings.position === "below") {
      addBtn.insertAdjacentElement("afterend", codBtn);
    } else if (settings.position === "below_buy_now" && buyNowBtn) {
      buyNowBtn.insertAdjacentElement("afterend", codBtn);
    } else {
      addBtn.insertAdjacentElement("afterend", codBtn);
    }

    // 🔥 MODE
    if (settings.mode === "replace") {
      addBtn.style.display = "none";
    }

    if (settings.mode === "replace_buy_now") {
      if (buyNowBtn) buyNowBtn.style.display = "none";
    }

    if (settings.mode === "cod_only") {
      addBtn.style.display = "none";
      if (buyNowBtn) buyNowBtn.style.display = "none";
    }

    // 🔥 smooth show
    setTimeout(() => {
      hideStyle.remove();
      codBtn.style.opacity = "1";
    }, 120);

    console.log("✅ ReleaseIt Working Perfectly");
  };

  start();
})();
