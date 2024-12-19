document.addEventListener("DOMContentLoaded", function () {
  const pagination = document.getElementById("pagination");
  const clientInfo = document.getElementById("dette-info");
  const addPayement = document.getElementById("add-payement");

  let currentPage = 1;
  const limit = 2;
  const currentUrl = window.location.href;
  const match = currentUrl.match(/detteid=(\d+)/);
  const match1 = currentUrl.match(/clientid=(\d+)/);
  const clientId = match1 ? match1[1] : null;
  const detteId = match ? match[1] : null;

  function loadPayementDette(page) {
    const detteClientList = document.getElementById("list-payement");
    fetch(
      `/api/dettes/detail/detteid=${detteId}&clientid=${clientId}?page=${page}&limit=${limit}`
    )
      .then((response) => response.json())
      .then((data) => {
        console.log(data.dette.etat);
        addPayement.classList.toggle('hidden', data.dette.etat !== "Valider");
        addPayement.classList.
        addPayement.setAttribute(
          "href",
          `/payements/form/detteid=${detteId}&clientid=${clientId}`
        );
        detteClientList.innerHTML = "";
        pagination.innerHTML = "";
        clientInfo.innerHTML = `
                            <div>
                                <p class="text-sm font-medium text-gray-500 dark:text-gray-400">Date :</p>
                                <p class="text-base text-gray-800 dark:text-gray-200">${
                                  data.dette.createAt
                                }</p>
                            </div>
                            <div>
                                <p class="text-sm font-medium text-gray-500 dark:text-gray-400">Montant :</p>
                                <p class="text-base text-gray-800 dark:text-gray-200">${
                                  data.dette.montant
                                } FCFA</p>
                            </div>
                            <div>
                                <p class="text-sm font-medium text-gray-500 dark:text-gray-400">Montant versé :</p>
                                <p class="text-base text-gray-800 dark:text-green-500">${
                                  data.dette.montantVerser
                                } FCFA</p>
                            </div>
                            <div>
                                <p class="text-sm font-medium text-gray-500 dark:text-gray-400">Montant restant :</p>
                                <p class="text-base text-gray-800 dark:text-red-500">${
                                  data.dette.montant - data.dette.montantVerser
                                } FCFA</p>
                            </div>
                            <div>
                                <p class="text-sm font-medium text-gray-500 dark:text-gray-400">État :</p>
                                <p class="text-base text-gray-800 dark:text-gray-200">${
                                  data.dette.etat
                                }</p>
                            </div>
                            <div>
                                <p class="text-sm font-medium text-gray-500 dark:text-gray-400">Surname client :</p>
                                <p class="text-base text-gray-800 dark:text-gray-200">${
                                  data.dette.client.username
                                }</p>
                            </div>`;
        if (data.payements && data.payements.length > 0) {
          data.payements.forEach((payement) => {
            const tr = document.createElement("tr");
            tr.classList.add(
              "odd:bg-gray-50",
              "even:bg-white",
              "dark:odd:bg-gray-800",
              "dark:even:bg-gray-900",
              "hover:bg-gray-100",
              "dark:hover:bg-gray-700"
            );
            tr.innerHTML = `
                            <td class="px-6 py-4">${payement.createAt}</td>
                            <td class="px-6 py-4">${payement.montantPayer}</td>
                             `;
            detteClientList.appendChild(tr);
          });
          updatePagination(data.totalPages, data.currentPage);
        } else {
          detteClientList.innerHTML = "<tr>Aucun client trouvé.</tr>";
        }
      })
      .catch((error) => console.error("Erreur :", error));
  }

  function updatePagination(totalpages, currentPage) {
    const previous = document.createElement("li");
    previous.innerHTML = `
                              <a href="#"
                                  class="flex items-center justify-center px-3 h-8 ms-0 leading-tight text-gray-500 bg-white border border-e-0 border-gray-300 rounded-s-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">
                                  Previous
                              </a>`;
    previous.addEventListener("click", function () {
      if (currentPage > 1) {
        loadPayementDette(currentPage - 1);
      }
    });
    pagination.appendChild(previous);

    for (let i = 1; i <= totalpages; i++) {
      const page = document.createElement("li");
      page.innerHTML = `
                            <a href="#"
                            class="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white ${
                              i === currentPage
                                ? "bg-blue-700 dark:bg-blue-6]500 dark:text-white"
                                : ""
                            }">
                            ${i}</a>`;
      page.addEventListener("click", () => loadPayementDette(i));
      pagination.appendChild(page);
    }

    const next = document.createElement("li");
    next.innerHTML = `
                          <a href="#"
                            class="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 rounded-e-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">
                            Next
                          </a>`;
    next.addEventListener("click", function () {
      if (currentPage < totalpages) {
        loadPayementDette(currentPage + 1);
      }
    });
    pagination.appendChild(next);
  }

  loadPayementDette(currentPage);
});
