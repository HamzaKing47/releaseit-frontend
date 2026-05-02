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
  const style = document.createElement("style");
  style.innerHTML = `
    .product-form__submit,
    .shopify-payment-button {
      opacity: 0 !important;
    }
  `;
  document.head.appendChild(style);

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

    const addBtn = await waitForButton();
    const form = addBtn.closest("form");
    if (!form) return;

    if (form.querySelector(".releaseit-btn")) {
      style.remove();
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

    codBtn.style.cssText = `
      background: ${settings.bgColor};
      color: ${settings.textColor};
      padding: 14px;
      margin-top: 10px;
      width: 100%;
      font-weight: 600;
      border: 1px solid transparent;
      border-radius: ${settings.borderRadius}px;
      cursor: pointer;
      font-size: 15px;
      transition: all 0.25s ease;
      display: none;
    `;

    // hover
    codBtn.onmouseenter = () => {
      codBtn.style.transform = "translateY(-2px)";
      codBtn.style.border = "1px solid rgba(255,255,255,0.3)";
    };

    codBtn.onmouseleave = () => {
      codBtn.style.transform = "translateY(0)";
      codBtn.style.border = "1px solid transparent";
    };

    // click
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

    // 🔥 POSITION FIX
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

    // show smoothly
    setTimeout(() => {
      style.remove();
      codBtn.style.display = "block";
      codBtn.style.opacity = "1";
    }, 120);

    console.log("✅ ReleaseIt Working Perfectly");
  };

  start();
})();
