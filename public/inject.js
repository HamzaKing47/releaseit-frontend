if (window.releaseItLoaded) return;
window.releaseItLoaded = true;

document.addEventListener("DOMContentLoaded", async () => {
  const shop = window.Shopify.shop;

  // 🔥 FETCH MODE FROM BACKEND
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
    console.log("Mode fetch failed, using default");
  }

  const forms = document.querySelectorAll('form[action*="/cart/add"]');

  forms.forEach((form) => {
    const btn = form.querySelector('button[type="submit"]');
    if (!btn) return;

    const codBtn = document.createElement("button");
    codBtn.innerText = "Buy with Cash on Delivery";
    codBtn.style.background = "black";
    codBtn.style.color = "white";
    codBtn.style.padding = "12px";
    codBtn.style.marginTop = "10px";
    codBtn.style.width = "100%";

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

    if (MODE === "replace") {
      btn.style.display = "none";
      form.appendChild(codBtn);
    }

    if (MODE === "both") {
      form.appendChild(codBtn);
    }
  });
});
