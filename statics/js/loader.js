function loadComponent(url, elementId) {
    fetch(url)
        .then(response => response.text())
        .then(html => {
            document.getElementById(elementId).innerHTML = html;
        })
        .catch(error => {
            console.error('Error loading component:', error);
        });
}

// Load the navbar component into the element with id "navbar"
window.onload = function() {
    loadComponent('/components/navbar.html', 'navbar');
}