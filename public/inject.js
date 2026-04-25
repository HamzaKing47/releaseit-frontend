document.addEventListener("DOMContentLoaded", () => {
  console.log("🔥 ReleaseIt Inject Loaded");

  const buttons = document.querySelectorAll(
    'form[action*="/cart/add"] button[type="submit"]',
  );

  buttons.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();

      const form = btn.closest("form");
      const variantId = form.querySelector('input[name="id"]').value;

      const shop = window.Shopify.shop;

      const url = `https://releaseitnow.vercel.app/?shop=${shop}&variant=${variantId}`;

      window.location.href = url;
    });
  });
});
