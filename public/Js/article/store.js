document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("form");
    const quantite = document.getElementById("quantite");
    const prix = document.getElementById("prix");
    
  
    form.addEventListener("submit", async function (event) {
      event.preventDefault();
        if (!validateForm(quantite, prix)) {
            return;
        }
      const formData = new FormData(form);
      for (const pair of formData.entries()) {
        console.log(`${pair[0]}: ${pair[1]}`);
      }
      await fetch(`/api/articles/store`, {
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

    function validateForm(quantite, prix) {
        const value = quantite.value;
        const value1 = prix.value;
        return value === "" || Number(value) <= 0 || !Number.isInteger(Number(value)) || value1 === "" || Number(value1) <= 0 || !Number.isInteger(Number(value1));
    }
  
  });