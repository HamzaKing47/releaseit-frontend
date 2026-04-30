// 🔥 prevent multiple load
if (window.releaseItLoaded) {
  console.log("ReleaseIt already loaded");
} else {
  window.releaseItLoaded = true;

  console.log("🔥 ReleaseIt PRO Loaded");

  const BACKEND = "https://releaseit-backend.onrender.com";

  // 🔥 MAIN FUNCTION
  const initReleaseIt = async () => {
    const shop = window.Shopify?.shop;
    if (!shop) return;

    let MODE = "both";

    try {
      const res = await fetch(`${BACKEND}/api/settings?shop=${shop}`);
      const data = await res.json();
      if (data.success) MODE = data.mode;
    } catch (err) {}

    // 🔥 BETTER FORM SELECTOR (important)
    const form =
      document.querySelector('form[action*="/cart/add"]') ||
      document.querySelector("product-form form") ||
      document.querySelector(".product-form");

    if (!form) {
      console.log("❌ Form not found yet...");
      return;
    }

    // 🔥 prevent duplicate
    if (document.querySelector(".releaseit-btn")) return;

    console.log("✅ Form found, injecting button");

    const addToCartBtn =
      form.querySelector('button[type="submit"]') ||
      form.querySelector('button[name="add"]') ||
      document.querySelector(".product-form__submit");

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

    // 🔥 reset
    if (addToCartBtn) addToCartBtn.style.display = "";
    if (buyNowBtn) buyNowBtn.style.display = "";

    form.appendChild(codBtn);

    if (MODE === "replace") {
      if (addToCartBtn)
        addToCartBtn.style.setProperty("display", "none", "important");
    }

    if (MODE === "cod_only") {
      if (addToCartBtn)
        addToCartBtn.style.setProperty("display", "none", "important");

      if (buyNowBtn)
        buyNowBtn.style.setProperty("display", "none", "important");
    }
  };

  // 🔥 run on page load
  document.addEventListener("DOMContentLoaded", initReleaseIt);

  // 🔥 Shopify dynamic page support (IMPORTANT)
  const observer = new MutationObserver(() => {
    initReleaseIt();
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });
}
