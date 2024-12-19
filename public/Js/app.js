document.addEventListener("DOMContentLoaded", function() {
    const main = document.getElementById('main');
    const listeClient = document.getElementById('liste-client');

    listeClient.addEventListener('click', function(event) {
        event.preventDefault();
        fetch(listeClient.getAttribute('href'))
        .then(response => {
            if (!response.ok) throw new Error('Erreur de chargement');
            return response.text();
        })
        .then(html => {
            main.innerHTML = html; // Insérer le contenu dans <main>
            history.pushState(null, '', 'http://127.0.0.1:8000/clients');
        })
        .catch(error => {
            console.error('Erreur:', error);
            main.innerHTML = '<p>Impossible de charger la page.</p>';
        });
    });

    window.onpopstate = function(event) {
        if (event.state && event.state.page) {
            loadPage(event.state.page); // Charger la page précédente depuis l'historique
        }
    };
});