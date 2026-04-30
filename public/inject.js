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

  // 🔥 REMOVE OLD BUTTONS (ONLY ONCE)
  document.querySelectorAll(".releaseit-btn").forEach((el) => el.remove());

  const forms = document.querySelectorAll('form[action*="/cart/add"]');

  // 🔥 get visible form only
  const visibleForm = Array.from(forms).find(
    (form) => form.offsetParent !== null,
  );

  if (!visibleForm) return;

  const form = visibleForm; // ✅ FIX HERE

  const addToCartBtn =
    form.querySelector('button[type="submit"]') ||
    form.querySelector('button[name="add"]') ||
    form.querySelector(".product-form__submit");
  const buyNowBtn = form.querySelector(".shopify-payment-button");

  // 🔥 CREATE BUTTON
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

  // 🔥 RESET
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
}, 2000);
