if (window.releaseItLoaded) return;
window.releaseItLoaded = true;

document.addEventListener("click", function (e) {
  const btn = e.target.closest("button");

  if (!btn) return;

  const form = btn.closest("form");

  if (!form || !form.action.includes("/cart/add")) return;

  e.preventDefault();

  const variantInput = form.querySelector('input[name="id"]');

  if (!variantInput) return;

  const variantId = variantInput.value;
  const shop = window.Shopify.shop;

  const url = `https://releaseitnow.vercel.app/?shop=${shop}&variant=${variantId}`;

  window.location.href = url;
});
