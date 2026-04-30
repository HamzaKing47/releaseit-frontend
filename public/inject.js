if (window.releaseItLoaded) {
  console.log("ReleaseIt already loaded");
} else {
  window.releaseItLoaded = true;

  console.log("🔥 ReleaseIt FINAL FIX Loaded");

  const BACKEND = "https://releaseit-backend.onrender.com";

  let MODE = "both";

  const fetchMode = async (shop) => {
    try {
      const res = await fetch(`${BACKEND}/api/settings?shop=${shop}`);
      const data = await res.json();
      if (data.success) MODE = data.mode;
    } catch {}
  };

  const injectButton = () => {
    const shop = window.Shopify?.shop;
    if (!shop) return;

    const form = document.querySelector('form[action*="/cart/add"]');
    if (!form) return;

    const addBtn =
      form.querySelector(".product-form__submit") ||
      form.querySelector('button[name="add"]');

    if (!addBtn) return;

    const buyNowBtn = document.querySelector(".shopify-payment-button");

    // ❌ already injected? skip
    if (form.querySelector(".releaseit-btn")) return;

    // 🔥 create COD
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

    // 🔥 insert
    addBtn.insertAdjacentElement("afterend", codBtn);

    // 🔥 modes
    if (MODE === "replace") {
      addBtn.style.display = "none";
    }

    if (MODE === "cod_only") {
      addBtn.style.display = "none";
      if (buyNowBtn) buyNowBtn.style.display = "none";
    }

    console.log("✅ COD Injected");
  };

  const start = async () => {
    const shop = window.Shopify?.shop;
    if (!shop) return;

    await fetchMode(shop);

    // 🔥 run first time
    setTimeout(injectButton, 800);

    // 🔥 watch DOM changes (Shopify re-render fix)
    const observer = new MutationObserver(() => {
      injectButton();
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });
  };

  window.addEventListener("load", start);
}
