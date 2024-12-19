document.addEventListener("DOMContentLoaded", function () {
  const pagination = document.getElementById("pagination");
  const inputSearchClient = document.getElementById("search-client");
  let searchClientValue = "";
  let currentPage = 1;
  const limit = 3;

  searchClient(inputSearchClient);

  function loadClient(page) {
    const clientList = document.getElementById("list-client");
    fetch(`api/clients?page=${page}&limit=${limit}&search=${searchClientValue}`)
      .then((response) => response.json())
      .then((data) => {
        clientList.innerHTML = "";
        pagination.innerHTML = "";
        if (data.clients && data.clients.length > 0) {
          data.clients.forEach((client) => {
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
                            <td class="px-6 py-4">
                                ${
                                  client.users
                                    ? `<img class="w-8 h-8 rounded-full" 
                                  src="img/${client.users.image}" alt="user photo">`
                                    : ""
                                }
                              </td>
                              <td class="px-6 py-4">${
                                client.users ? client.users.nom : ""
                              }</td>
                              <td class="px-6 py-4">${
                                client.users ? client.users.prenom : ""
                              }</td>
                              <td class="px-6 py-4">${client.username}</td>
                              <td class="px-6 py-4">${client.telephone}</td>
                              <td class="px-6 py-4">
                                  <a href="clients/dette/id=${client.id}" class="text-blue-600 dark:text-blue-500 hover:underline">Detail</a>
                                  <span class="mx-2">|</span>
                                  <a href="#" class="text-red-600 dark:text-red-500 hover:underline">Supprimer</a>
                              </td>
                            `;
            clientList.appendChild(tr);
          });
          updatePagination(data.totalPages, data.currentPage);
        } else {
          clientList.innerHTML = "<tr>Aucun client trouvé.</tr>";
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
                        class="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white ${i === currentPage ? "bg-blue-700 dark:bg-blue-6]500 dark:text-white" : ""}">
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

  function searchClient(inputSearchClient) {
    inputSearchClient.addEventListener("input", function () {
      searchClientValue = inputSearchClient.value;
      loadClient(1);
    });
  }

  loadClient(currentPage);
});
