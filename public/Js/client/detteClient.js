document.addEventListener("DOMContentLoaded", function () {
  const pagination = document.getElementById("pagination");
  const clientInfo = document.getElementById("client-info");
  const addDette = document.getElementById("add-dette");

  let currentPage = 1;
  const limit = 2;
  const currentUrl = window.location.href;
  const match = currentUrl.match(/id=(\d+)/);
  const id = match ? match[1] : null;

  function loadClient(page) {
    const detteClientList = document.getElementById("list-dette");
    fetch(`/api/clients/dette/id=${id}?page=${page}&limit=${limit}`)
      .then((response) => response.json())
      .then((data) => {
        addDette.setAttribute("href", `/dettes/form/id=${id}`);
        detteClientList.innerHTML = "";
        pagination.innerHTML = "";
          clientInfo.innerHTML = `
                        ${
                          data.client.users
                            ? `
                            <div class="flex items-center justify-center">
                            <img src="/img/${data.client.users.image}" alt="Photo du client" class="w-32 h-32 rounded-full shadow-md object-cover">
                        </div>
                        `
                            : `<div class="flex items-center justify-center">
                            <img src="https://c7.alamy.com/compfr/2c5xkn9/vecteur-d-icone-d-image-profil-isole-sur-fond-blanc-2c5xkn9.jpg" alt="" class="w-32 h-32 rounded-full shadow-md object-cover">
                        </div>`
                        }
                        <div class="col-span-2 grid grid-cols-2 gap-4">
                            <div>
                                <p class="text-sm font-medium text-gray-500 dark:text-gray-400">Nom :</p>
                                <p class="text-base text-gray-800 dark:text-gray-200">${data.client.users ? data.client.users.nom : "Pas de compte"}</p>
                            </div>
                            <div>
                                <p class="text-sm font-medium text-gray-500 dark:text-gray-400">Prénom :</p>
                                <p class="text-base text-gray-800 dark:text-gray-200">${data.client.users ? data.client.users.prenom : "Pas de compte"}</p>
                            </div>
                            <div>
                                <p class="text-sm font-medium text-gray-500 dark:text-gray-400">Surname :</p>
                                <p class="text-base text-gray-800 dark:text-gray-200">${data.client.username}</p>
                            </div>
                            <div>
                                <p class="text-sm font-medium text-gray-500 dark:text-gray-400">Téléphone :</p>
                                <p class="text-base text-gray-800 dark:text-gray-200">${data.client.telephone}</p>
                            </div>
                            <div>
                                <p class="text-sm font-medium text-gray-500 dark:text-gray-400">Login :</p>
                                <p class="text-base text-gray-800 dark:text-gray-200">${data.client.users ? data.client.users.login : "Pas de compte"}</p>
                            </div>
                            <div>
                                <p class="text-sm font-medium text-gray-500 dark:text-gray-400">Montant total a payer :</p>
                                <p class="text-base text-gray-800 dark:text-red-500">${data.montantTotal} FCFA</p>
                            </div>
                        </div>
            `;
        if (data.detteClient && data.detteClient.length > 0) {
          data.detteClient.forEach((dette) => {
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
                              <td class="px-6 py-4">${dette.createAt}</td>
                                <td class="px-6 py-4">${dette.montant}</td>
                                <td class="px-6 py-4">${
                                  dette.montantVerser
                                }</td>
                                <td class="px-6 py-4">${
                                  dette.montant - dette.montantVerser
                                }</td>
                                <td class="px-6 py-4">
                                    <a href="/dettes/detail/detteid=${dette.id}&clientid=${data.client.id}" class="text-blue-600 dark:text-blue-500 hover:underline">Detail</a>
                                    <span class="mx-2">|</span>
                                    <a href="#" class="text-red-600 dark:text-red-500 hover:underline">Supprimer</a>
                                </td>
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
        loadClient(currentPage - 1);
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
      page.addEventListener("click", () => loadClient(i));
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
        loadClient(currentPage + 1);
      }
    });
    pagination.appendChild(next);
  }

  loadClient(currentPage);
});
