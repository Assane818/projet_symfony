document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("form");
    const quantite = document.getElementById("quantite");
    const currentUrl = window.location.href;
    const match = currentUrl.match(/id=(\d+)/);
    const id = match ? match[1] : null;
  
    form.addEventListener("submit", async function (event) {
      event.preventDefault();
        validateQuantite(quantite);
        if (!validateQuantite(quantite)) {
            return;
        }
      const formData = new FormData(form);
      for (const pair of formData.entries()) {
        console.log(`${pair[0]}: ${pair[1]}`);
      }
      await fetch(`/api/articles/update/id=${id}`, {
        method: "POST",
        body: formData,
      }).then(async (response) => {
        if (response.ok) {
          console.log("Formulaire soumis avec succès !");
          window.location.href = `/articles`;
        } else {
          console.error("Erreur lors de la soumission du formulaire.");
          const errorText = await response.text();
          console.error(errorText);
        }
      });
    });

    function validateQuantite(quantite) {
        const value = quantite.value;
        if (value === "" || Number(value) <= 0 || !Number.isInteger(Number(value))) {
         quantite.classList.add("border-red-500");
          return false;
        } else {
          quantite.classList.remove("border-red-500");
          return true;
        }
    }
  
  });