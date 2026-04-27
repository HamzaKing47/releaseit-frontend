if (window.releaseItLoaded) return;
window.releaseItLoaded = true;

document.addEventListener("DOMContentLoaded", () => {
  const forms = document.querySelectorAll('form[action*="/cart/add"]');

  forms.forEach((form) => {
    const btn = form.querySelector('button[type="submit"]');

    if (!btn) return;

    // 👉 NEW BUTTON
    const codBtn = document.createElement("button");
    codBtn.innerText = "Buy with Cash on Delivery";
    codBtn.style.background = "black";
    codBtn.style.color = "white";
    codBtn.style.padding = "12px";
    codBtn.style.marginTop = "10px";
    codBtn.style.width = "100%";
    codBtn.style.cursor = "pointer";

    codBtn.onclick = (e) => {
      e.preventDefault();

      const variantInput = form.querySelector('input[name="id"]');
      if (!variantInput) return;

      const variantId = variantInput.value;
      const shop = window.Shopify.shop;

      const url = `https://releaseitnow.vercel.app/?shop=${shop}&variant=${variantId}`;

      window.location.href = url;
    };

    form.appendChild(codBtn);
  });
});
