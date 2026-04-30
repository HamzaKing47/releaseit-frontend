if (window.releaseItLoaded) {
  console.log("ReleaseIt already loaded");
} else {
  window.releaseItLoaded = true;

  console.log("🔥 ReleaseIt REAL FINAL Loaded");

  const BACKEND = "https://releaseit-backend.onrender.com";

  let MODE = "both";

  const fetchMode = async (shop) => {
    try {
      const res = await fetch(`${BACKEND}/api/settings?shop=${shop}`);
      const data = await res.json();
      if (data.success) MODE = data.mode;
    } catch {}
  };

  // 🔥 WAIT UNTIL BUTTON EXISTS
  const waitForButton = () => {
    return new Promise((resolve) => {
      const interval = setInterval(() => {
        const btn = document.querySelector(".product-form__submit");

        if (btn) {
          clearInterval(interval);
          resolve(btn);
        }
      }, 300);
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
    if (form.querySelector(".releaseit-btn")) return;

    // 🔥 CREATE COD
    const codBtn = document.createElement("button");
    codBtn.className = "releaseit-btn";
    codBtn.innerText = "Buy with Cash on Delivery";

    codBtn.style.cssText = `
      background:black;
      color:white;
      padding:14px;
      margin-top:10px;
      width:100%;
      font-weight:bold;
      border:none;
      border-radius:6px;
      cursor:pointer;
    `;

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

    // 🔥 INSERT
    addBtn.insertAdjacentElement("afterend", codBtn);

    // 🔥 MODES
    if (MODE === "replace") {
      addBtn.style.display = "none";
    }

    if (MODE === "cod_only") {
      addBtn.style.display = "none";
      if (buyNowBtn) buyNowBtn.style.display = "none";
    }

    console.log("✅ COD BUTTON SUCCESSFULLY ADDED");
  };

  start();
}
