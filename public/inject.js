(function () {
  if (window.releaseItLoaded) {
    console.log("ReleaseIt already loaded");
    return;
  }

  window.releaseItLoaded = true;
  console.log("🔥 ReleaseIt FINAL PRO Loaded");

  const BACKEND = "https://releaseit-backend.onrender.com";

  let settings = {
    mode: "both",
    buttonText: "Buy with Cash on Delivery",
    bgColor: "#000000",
    textColor: "#ffffff",
    borderRadius: 10,
    position: "below",
  };

  // 🔥 Hide buttons instantly (no flicker)
  const style = document.createElement("style");
  style.innerHTML = `
    form[action*="/cart/add"] button,
    .shopify-payment-button {
      opacity: 0 !important;
    }
  `;
  document.head.appendChild(style);

  // 🔥 Fetch settings
  const fetchSettings = async (shop) => {
    try {
      const res = await fetch(`${BACKEND}/api/settings?shop=${shop}`);
      const data = await res.json();

      if (data.success) {
        settings = { ...settings, ...data };
      }
    } catch {}
  };

  // 🔥 Wait for Add to Cart button (theme-safe)
  const waitForButton = () => {
    return new Promise((resolve) => {
      const interval = setInterval(() => {
        const btn =
          document.querySelector('button[name="add"]') ||
          document.querySelector(".product-form__submit") ||
          document.querySelector('button[type="submit"]');

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

    // 🔥 prevent duplicate
    if (form.querySelector(".releaseit-btn")) {
      style.remove();
      return;
    }

    const buyNowBtn =
      document.querySelector(".shopify-payment-button") ||
      document.querySelector(".shopify-payment-button__button");

    // 🔥 CREATE COD BUTTON
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
  border-radius: ${settings.borderRadius || 6}px;
  cursor: pointer;
  font-size: 15px;
  transition: all 0.2s ease;
`;

    // ✨ hover animation
    codBtn.onmouseenter = () => {
      codBtn.style.transform = "translateY(-2px)";
    };

    codBtn.onmouseleave = () => {
      codBtn.style.transform = "translateY(0)";
    };

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

    // 🔥 POSITION CONTROL
    if (settings.position === "above") {
      addBtn.parentNode.insertBefore(codBtn, addBtn);
    } else {
      addBtn.insertAdjacentElement("afterend", codBtn);
    }

    if (settings.position === "below_buy_now" && buyNowBtn) {
      buyNowBtn.insertAdjacentElement("afterend", codBtn);
    }

    // 🔥 MODE CONTROL
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

    // 🔥 show smooth
    setTimeout(() => {
      style.remove();

      codBtn.style.opacity = "1";
      codBtn.style.transform = "translateY(0)";
    }, 120);

    console.log("✅ ReleaseIt Working Perfectly");
  };

  start();
})();
