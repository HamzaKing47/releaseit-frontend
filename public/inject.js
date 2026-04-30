if (window.releaseItLoaded) {
  console.log("ReleaseIt already loaded");
} else {
  window.releaseItLoaded = true;

  console.log("🔥 ReleaseIt UNIVERSAL Loaded");

  const BACKEND = "https://releaseit-backend.onrender.com";

  const initReleaseIt = async () => {
    const shop = window.Shopify?.shop;
    if (!shop) return;

    let MODE = "both";

    try {
      const res = await fetch(`${BACKEND}/api/settings?shop=${shop}`);
      const data = await res.json();
      if (data.success) MODE = data.mode;
    } catch (err) {}

    // 🔥 UNIVERSAL BUTTON DETECTION (key fix)
    const buttons = Array.from(document.querySelectorAll("button"));

    const addToCartBtn = buttons.find((btn) => {
      const text = btn.innerText.toLowerCase();

      return (
        text.includes("add to cart") ||
        text.includes("add to bag") ||
        text.includes("add to basket")
      );
    });

    if (!addToCartBtn) {
      console.log("❌ Add to cart button not found yet...");
      return;
    }

    // 🔥 prevent duplicate
    if (document.querySelector(".releaseit-btn")) return;

    console.log("✅ Button found, injecting COD");

    const form = addToCartBtn.closest("form") || addToCartBtn.parentNode;

    const buyNowBtn =
      document.querySelector(".shopify-payment-button") ||
      document.querySelector('[data-shopify="payment-button"]');

    // 🔥 CREATE COD BUTTON
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

      const variantInput =
        document.querySelector('input[name="id"]') ||
        document.querySelector('[name="id"]');

      if (!variantInput) return;

      const variantId = variantInput.value;

      const productHandle = window.location.pathname
        .split("/products/")[1]
        ?.split("?")[0];

      const url = `https://releaseitnow.vercel.app/?shop=${shop}&variant=${variantId}&product=${productHandle}`;

      window.location.href = url;
    };

    // 🔥 inject AFTER add to cart
    addToCartBtn.parentNode.appendChild(codBtn);

    // 🔥 RESET
    addToCartBtn.style.display = "";
    if (buyNowBtn) buyNowBtn.style.display = "";

    // 🔥 MODE HANDLING
    if (MODE === "replace") {
      addToCartBtn.style.setProperty("display", "none", "important");
    }

    if (MODE === "cod_only") {
      addToCartBtn.style.setProperty("display", "none", "important");
      if (buyNowBtn)
        buyNowBtn.style.setProperty("display", "none", "important");
    }
  };

  // 🔥 run on load
  document.addEventListener("DOMContentLoaded", initReleaseIt);

  // 🔥 observe changes (ALL THEMES SUPPORT)
  const observer = new MutationObserver(() => {
    initReleaseIt();
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });
}
