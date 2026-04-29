// 🔥 RE-RUN EVERY 2s (Shopify dynamic DOM handle karega)
setInterval(async () => {
  const shop = window.Shopify?.shop;
  if (!shop) return;

  let MODE = "both";

  try {
    const res = await fetch(
      `https://releaseit-backend.onrender.com/api/settings?shop=${shop}`,
    );
    const data = await res.json();

    if (data.success) {
      MODE = data.mode;
    }
  } catch (err) {
    console.log("Mode fetch failed");
  }

  const forms = document.querySelectorAll('form[action*="/cart/add"]');

  forms.forEach((form) => {
    // ✅ prevent duplicate
    if (form.querySelector(".releaseit-btn")) return;

    const addToCartBtn = form.querySelector('button[type="submit"]');
    const buyNowBtn = document.querySelector(".shopify-payment-button");

    const codBtn = document.createElement("button");
    codBtn.className = "releaseit-btn";
    codBtn.innerText = "Buy with Cash on Delivery";

    codBtn.style.background = "black";
    codBtn.style.color = "white";
    codBtn.style.padding = "12px";
    codBtn.style.marginTop = "10px";
    codBtn.style.width = "100%";
    codBtn.style.cursor = "pointer";
    codBtn.style.fontWeight = "bold";

    codBtn.onclick = (e) => {
      e.preventDefault();

      const variantInput = form.querySelector('input[name="id"]');
      if (!variantInput) return;

      const variantId = variantInput.value;
      const productHandle = window.location.pathname
        .split("/products/")[1]
        ?.split("?")[0];

      const url = `https://releaseitnow.vercel.app/?shop=${shop}&variant=${variantId}&product=${productHandle}`;

      window.location.href = url;
    };

    // 🔥 reset buttons first
    if (addToCartBtn) addToCartBtn.style.display = "";
    if (buyNowBtn) buyNowBtn.style.display = "";

    // 🔥 MODE
    if (MODE === "both") {
      form.appendChild(codBtn);
    }

    if (MODE === "replace") {
      if (addToCartBtn) addToCartBtn.style.display = "none";
      form.appendChild(codBtn);
    }

    if (MODE === "cod_only") {
      if (addToCartBtn) addToCartBtn.style.display = "none";
      if (buyNowBtn) buyNowBtn.style.display = "none";
      form.appendChild(codBtn);
    }
  });
}, 2000);
