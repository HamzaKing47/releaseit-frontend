if (window.releaseItLoaded) {
  console.log("ReleaseIt already loaded");
} else {
  window.releaseItLoaded = true;

  console.log("🔥 ReleaseIt FINAL Loaded");

  const BACKEND = "https://releaseit-backend.onrender.com";

  const injectButton = async () => {
    const shop = window.Shopify?.shop;
    if (!shop) return;

    let MODE = "both";

    try {
      const res = await fetch(`${BACKEND}/api/settings?shop=${shop}`);
      const data = await res.json();
      if (data.success) MODE = data.mode;
    } catch {}

    const addToCartBtn = document.querySelector(".product-form__submit");

    if (!addToCartBtn) return;

    // ❌ already exists → skip
    if (document.querySelector(".releaseit-btn")) return;

    console.log("✅ Injecting COD button");

    const buyNowBtn = document.querySelector(".shopify-payment-button");

    const codBtn = document.createElement("button");
    codBtn.className = "releaseit-btn";
    codBtn.innerText = "Buy with Cash on Delivery";

    codBtn.style.background = "black";
    codBtn.style.color = "white";
    codBtn.style.padding = "14px";
    codBtn.style.marginTop = "10px";
    codBtn.style.width = "100%";
    codBtn.style.cursor = "pointer";
    codBtn.style.fontWeight = "bold";
    codBtn.style.border = "none";
    codBtn.style.borderRadius = "6px";

    codBtn.onclick = (e) => {
      e.preventDefault();

      const variantInput = document.querySelector('input[name="id"]');
      if (!variantInput) return;

      const variantId = variantInput.value;

      const productHandle = window.location.pathname
        .split("/products/")[1]
        ?.split("?")[0];

      const url = `https://releaseitnow.vercel.app/?shop=${shop}&variant=${variantId}&product=${productHandle}`;

      window.location.href = url;
    };

    // 🔥 inject EXACT position
    addToCartBtn.insertAdjacentElement("afterend", codBtn);

    // 🔥 MODE
    if (MODE === "replace") {
      addToCartBtn.style.setProperty("display", "none", "important");
    }

    if (MODE === "cod_only") {
      addToCartBtn.style.setProperty("display", "none", "important");
      if (buyNowBtn)
        buyNowBtn.style.setProperty("display", "none", "important");
    }
  };

  // 🔥 retry loop (important)
  const retryInject = () => {
    let attempts = 0;

    const interval = setInterval(() => {
      injectButton();
      attempts++;

      if (attempts > 10) clearInterval(interval);
    }, 500);
  };

  // 🔥 run on load
  document.addEventListener("DOMContentLoaded", retryInject);

  // 🔥 Shopify dynamic support
  const observer = new MutationObserver(() => {
    retryInject();
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });
}
