(function () {
  if (window.releaseItLoaded) return;
  window.releaseItLoaded = true;

  function initReleaseIt() {
    const shop = window.Shopify?.shop;
    if (!shop) return;

    fetch(`https://releaseit-backend.onrender.com/api/settings?shop=${shop}`)
      .then((res) => res.json())
      .then((data) => {
        const MODE = data.mode || "both";

        const forms = document.querySelectorAll('form[action*="/cart/add"]');

        forms.forEach((form) => {
          if (form.dataset.releaseit) return;
          form.dataset.releaseit = "true";

          const btn = form.querySelector('button[type="submit"]');
          if (!btn) return;

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

            const url = `https://releaseitnow.vercel.app/?shop=${shop}&variant=${variantId}`;
            window.location.href = url;
          };

          // 🔥 MODE CONTROL
          if (MODE === "replace") {
            btn.style.display = "none";
            form.appendChild(codBtn);
          }

          if (MODE === "both") {
            form.appendChild(codBtn);
          }
        });
      });
  }

  setInterval(initReleaseIt, 1500);
})();
