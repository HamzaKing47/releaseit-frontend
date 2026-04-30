if (window.releaseItLoaded) {
  console.log("ReleaseIt already loaded");
} else {
  window.releaseItLoaded = true;

  console.log("🔥 ReleaseIt STABLE Loaded");

  const BACKEND = "https://releaseit-backend.onrender.com";

  const waitForElement = (selector, timeout = 5000) => {
    return new Promise((resolve) => {
      const element = document.querySelector(selector);
      if (element) return resolve(element);

      const observer = new MutationObserver(() => {
        const el = document.querySelector(selector);
        if (el) {
          observer.disconnect();
          resolve(el);
        }
      });

      observer.observe(document.body, { childList: true, subtree: true });

      setTimeout(() => {
        observer.disconnect();
        resolve(null);
      }, timeout);
    });
  };

  const init = async () => {
    const shop = window.Shopify?.shop;
    if (!shop) return;

    let MODE = "both";

    try {
      const res = await fetch(`${BACKEND}/api/settings?shop=${shop}`);
      const data = await res.json();
      if (data.success) MODE = data.mode;
    } catch {}

    // 🔥 WAIT for Shopify buttons
    const addToCartBtn = await waitForElement(".product-form__submit");

    if (!addToCartBtn) {
      console.log("❌ Button not found");
      return;
    }

    const buyNowBtn = document.querySelector(".shopify-payment-button");

    // 🔥 REMOVE old COD (just in case)
    document.querySelectorAll(".releaseit-btn").forEach((el) => el.remove());

    // 🔥 CREATE COD
    const codBtn = document.createElement("button");
    codBtn.className = "releaseit-btn";
    codBtn.innerText = "Buy with Cash on Delivery";

    codBtn.style.background = "black";
    codBtn.style.color = "white";
    codBtn.style.padding = "14px";
    codBtn.style.marginTop = "10px";
    codBtn.style.width = "100%";
    codBtn.style.fontWeight = "bold";
    codBtn.style.border = "none";
    codBtn.style.borderRadius = "6px";
    codBtn.style.cursor = "pointer";

    codBtn.onclick = (e) => {
      e.preventDefault();

      const variantInput = document.querySelector('input[name="id"]');
      if (!variantInput) return;

      const variantId = variantInput.value;

      const productHandle = window.location.pathname
        .split("/products/")[1]
        ?.split("?")[0];

      window.location.href =
        `https://releaseitnow.vercel.app/?shop=${shop}` +
        `&variant=${variantId}&product=${productHandle}`;
    };

    // 🔥 INSERT AFTER ADD TO CART
    addToCartBtn.insertAdjacentElement("afterend", codBtn);

    // 🔥 MODE HANDLING
    if (MODE === "replace") {
      addToCartBtn.style.display = "none";
    }

    if (MODE === "cod_only") {
      addToCartBtn.style.display = "none";
      if (buyNowBtn) buyNowBtn.style.display = "none";
    }

    console.log("✅ COD Button injected successfully");
  };

  // 🔥 RUN AFTER LOAD
  window.addEventListener("load", () => {
    setTimeout(init, 500); // 👈 small delay (controlled, not random)
  });
}
