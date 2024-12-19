    document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("form");
    const montantPayer = document.getElementById("montantPayer");
    const currentUrl = window.location.href;
    const match = currentUrl.match(/clientid=(\d+)/);
    const clientId = match ? match[1] : null;
    const match1 = currentUrl.match(/detteid=(\d+)/);
    const detteId = match1 ? match1[1] : null;
  
    form.addEventListener("submit", async function (event) {
      event.preventDefault();
        validateMontantPayer(montantPayer);
        if (!validateMontantPayer(montantPayer)) {
            return;
        }
      const formData = new FormData(form);
      for (const pair of formData.entries()) {
        console.log(`${pair[0]}: ${pair[1]}`);
      }
      await fetch(`/api/payements/store/detteid=${detteId}&clientid=${clientId}`, {
        method: "POST",
        body: formData,
      }).then(async (response) => {
        if (response.ok) {
          console.log("Formulaire soumis avec succès !");
          window.location.href = `/dettes/detail/detteid=${detteId}&clientid=${clientId}`;
        } else {
          console.error("Erreur lors de la soumission du formulaire.");
          const errorText = await response.text();
          console.error(errorText);
        }
      });
    });

    function validateMontantPayer(montantPayer) {
        const value = montantPayer.value;
        if (value === "" || Number(value) <= 0 || !Number.isInteger(Number(value))) {
          montantPayer.classList.add("border-red-500");
          return false;
        } else {
          montantPayer.classList.remove("border-red-500");
          return true;
        }
    }
  
  });