document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("form");
  const quantite = document.getElementById("quantite");
  const ArticleSelect = document.getElementById("article-select");
  const btnAddArticle = document.getElementById("add-article");
  const btnsave = document.getElementById("btn-save");
  const panierContainer = document.getElementById("panier-container");
  const panierList = document.getElementById("panier-list");
  const currentUrl = window.location.href;
  const match = currentUrl.match(/id=(\d+)/);
  const clientId = match ? match[1] : null;
  loadSelect(ArticleSelect);
  addPanier(btnAddArticle);
  getPanier();
  saveDette(btnsave);

  function validateMontantPayer(quantite) {
    const value = quantite.value;
    if (
      value === "" ||
      Number(value) <= 0 ||
      !Number.isInteger(Number(value))
    ) {
      quantite.classList.add("border-red-500");
      return false;
    } else {
      quantite.classList.remove("border-red-500");
      return true;
    }
  }

  function loadSelect(ArticleSelect) {
    fetch(`/api/articles`)
      .then((response) => response.json())
      .then((data) => {
        ArticleSelect.innerHTML = "";
        data.allArticles.forEach((article) => {
          ArticleSelect.innerHTML += `
              <option value="${article.id}">${article.libelle}</option>
              `;
        });
      });
  }

  function addPanier(btnAddArticle) {
    btnAddArticle.addEventListener("click", async function (event) {
      event.preventDefault();
      validateMontantPayer(quantite);
      if (!validateMontantPayer(quantite)) {
        return;
      }
      const formData = new FormData(form);
      for (const pair of formData.entries()) {
        console.log(`${pair[0]}: ${pair[1]}`);
      }
      await fetch(`/api/panier/store/id=${clientId}`, {
        method: "POST",
        body: formData,
      }).then(async (response) => {
        if (response.ok) {
          console.log("Formulaire soumis avec succès !");
        } else {
          console.error("Erreur lors de la soumission du formulaire.");
          const errorText = await response.text();
          console.error(errorText);
        }
      });
      getPanier();
    });
  }

  window.deleteArticle = function(id) {
    fetch(`/api/panier/delete/id=${id}`, {
      method: "DELETE",
    }).then(async (response) => {
      if (response.ok) {
        console.log("Formulaire soumis avec succès !");
      } else {
        console.error("Erreur lors de la soumission du formulaire.");
        const errorText = await response.text();
        console.error(errorText);
      }
      getPanier();
    });
  };

  function getPanier() {
    fetch(`/api/panier/id=${clientId}`)
      .then((response) => response.json())
      .then((data) => {
        if (data.panier.length > 0) {
          panierList.innerHTML = "";
          data.panier.forEach((panier) => {
            const tr = document.createElement("tr");
            tr.classList.add("hover:bg-gray-50", "dark:hover:bg-gray-600");
            tr.innerHTML = `
                                <td class="py-3 px-6 border-b border-gray-200">${panier.article.libelle}</td>
                                <td class="py-3 px-6 border-b border-gray-200">${panier.quantite}</td>
                                <td class="py-3 px-6 border-b border-gray-200">${panier.article.prix}</td>
                                <td class="py-3 px-6 border-b border-gray-200">
                                    <a href="#" onclick="deleteArticle(${panier.id});" class="text-red-600 dark:text-red-500 hover:underline">Supprimer</a>
                                </td>
                                `;
            panierList.appendChild(tr);
          });
        } else {
          panierContainer.innerHTML = "";
        }
      });
  }

  function saveDette(btnsave) {
    btnsave.addEventListener("click", async function (event) {
      event.preventDefault();
      await fetch(`/api/panier/save/id=${clientId}`, {
        method: "POST",
      }).then(async (response) => {
        if (response.ok) {
          console.log("Formulaire soumis avec succès !");
          window.location.href = `/clients/dette/id=${clientId}`;
        } else {
          console.error("Erreur lors de la soumission du formulaire.");
          const errorText = await response.text();
          console.error(errorText);
        }
      });
    });
    loadSelect(ArticleSelect);
  }

});
