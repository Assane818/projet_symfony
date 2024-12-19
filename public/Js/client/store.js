document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("form");
  const formClient = document.getElementById("form-client");
  const formUser = document.getElementById("form-user");
  const surname = document.getElementById("surname");
  const phone = document.getElementById("phone");
  const address = document.getElementById("address");
  const password = document.getElementById("password");
  const nom = document.getElementById("nom");
  const prenom = document.getElementById("prenom");
  const login = document.getElementById("login");
  const image = document.getElementById("image");
  const btnSave = document.getElementById("btn-save");
  const toogleSwitch = document.getElementById("toogle-switch");
  toogleSwitch.addEventListener("change", function () {
    createUser(toogleSwitch);
  });

  form.addEventListener("submit", async function (event) {
    event.preventDefault();
    const formData = new FormData(form);
    createUser(toogleSwitch, formData);
    for (const pair of formData.entries()) {
      console.log(`${pair[0]}: ${pair[1]}`);
    }
    await fetch("../api/clients/store", {
      method: "POST",
      body: formData,
    }).then(async (response) => {
      if (response.ok) {
        console.log("Formulaire soumis avec succès !");
        window.location.href = "/clients";
      } else {
        console.error("Erreur lors de la soumission du formulaire.");
        const errorText = await response.text();
        console.error(errorText);
      }
    });
  });

  function createUser(data, form = null) {
    if (data.checked) {
      formUser.classList.remove("hidden");
    } else {
      formUser.classList.add("hidden");
      form.delete("nom");
      form.delete("prenom");
      form.delete("login");
      form.delete("image");
      form.delete("password");
    }
  }
});
