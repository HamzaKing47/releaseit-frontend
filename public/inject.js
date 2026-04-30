setInterval(async () => {
  const shop = window.Shopify?.shop;
  if (!shop) return;

  let MODE = "both";

  try {
    const res = await fetch(
      `https://releaseit-backend.onrender.com/api/settings?shop=${shop}`,
    );
    const data = await res.json();
    if (data.success) MODE = data.mode;
  } catch (err) {}

  // 🔥 remove old COD buttons only
  document.querySelectorAll(".releaseit-btn").forEach((el) => el.remove());

  // 🔥 get main product form
  const form = document.querySelector('form[action*="/cart/add"]');
  if (!form) return;

  // 🔥 buttons
  const addToCartBtn =
    form.querySelector('button[type="submit"]') ||
    form.querySelector('button[name="add"]') ||
    document.querySelector(".product-form__submit");

  const buyNowBtn = document.querySelector(".shopify-payment-button");

  // 🔥 CREATE COD BUTTON
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

  // 🔥 RESET first
  if (addToCartBtn) addToCartBtn.style.display = "";
  if (buyNowBtn) buyNowBtn.style.display = "";

  // 🔥 ALWAYS add COD button
  form.appendChild(codBtn);

  // 🔥 MODE LOGIC
  if (MODE === "replace") {
    if (addToCartBtn)
      addToCartBtn.style.setProperty("display", "none", "important");
  }

  if (MODE === "cod_only") {
    if (addToCartBtn)
      addToCartBtn.style.setProperty("display", "none", "important");

    if (buyNowBtn) buyNowBtn.style.setProperty("display", "none", "important");
  }
}, 2000);
