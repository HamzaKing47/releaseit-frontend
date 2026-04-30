if (window.releaseItLoaded) {
  console.log("ReleaseIt already loaded");
} else {
  window.releaseItLoaded = true;

  console.log("🔥 ReleaseIt PRO Loaded");

  const BACKEND = "https://releaseit-backend.onrender.com";

  let MODE = "both";

  // 🔥 Hide buttons instantly (no flicker)
  const style = document.createElement("style");
  style.innerHTML = `
    .product-form__submit,
    .shopify-payment-button {
      opacity: 0 !important;
    }
  `;
  document.head.appendChild(style);

  const fetchMode = async (shop) => {
    try {
      const res = await fetch(`${BACKEND}/api/settings?shop=${shop}`);
      const data = await res.json();
      if (data.success) MODE = data.mode;
    } catch {}
  };

  // 🔥 Wait until button exists (Shopify fix)
  const waitForButton = () => {
    return new Promise((resolve) => {
      const interval = setInterval(() => {
        const btn = document.querySelector(".product-form__submit");

        if (btn) {
          clearInterval(interval);
          resolve(btn);
        }
      }, 200);
    });
  };

  const start = async () => {
    const shop = window.Shopify?.shop;
    if (!shop) return;

    await fetchMode(shop);

    const addBtn = await waitForButton();
    const form = addBtn.closest("form");

    const buyNowBtn = document.querySelector(".shopify-payment-button__button");

    // ❌ prevent duplicate
    if (form.querySelector(".releaseit-btn")) {
      style.remove();
      return;
    }

    // 🔥 CREATE COD BUTTON
    const codBtn = document.createElement("button");
    codBtn.className = "releaseit-btn";
    codBtn.innerHTML = "💰 Buy with Cash on Delivery";

    codBtn.style.cssText = `
      background: linear-gradient(135deg, #000000, #1a1a1a);
      color: #fff;
      padding: 14px;
      margin-top: 12px;
      width: 100%;
      font-weight: 600;
      border: none;
      border-radius: 10px;
      cursor: pointer;
      font-size: 16px;
      letter-spacing: 0.3px;
      transition: all 0.3s ease;
      box-shadow: 0 4px 12px rgba(0,0,0,0.2);
      opacity: 0;
      transform: translateY(10px);
    `;

    // ✨ hover animation
    codBtn.onmouseenter = () => {
      codBtn.style.transform = "translateY(-2px)";
      codBtn.style.boxShadow = "0 6px 18px rgba(0,0,0,0.3)";
    };

    codBtn.onmouseleave = () => {
      codBtn.style.transform = "translateY(0)";
      codBtn.style.boxShadow = "0 4px 12px rgba(0,0,0,0.2)";
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

    // 🔥 insert button
    addBtn.insertAdjacentElement("afterend", codBtn);

    // 🔥 mode handling
    if (MODE === "replace") {
      addBtn.style.display = "none";
    }

    if (MODE === "cod_only") {
      addBtn.style.display = "none";
      if (buyNowBtn) buyNowBtn.style.display = "none";
    }

    // 🔥 show buttons after ready (no flicker)
    setTimeout(() => {
      style.remove();

      // smooth appear
      codBtn.style.transition = "all 0.4s ease";
      codBtn.style.opacity = "1";
      codBtn.style.transform = "translateY(0)";
    }, 100);

    console.log("✅ COD Button Perfectly Loaded");
  };

  start();
}
