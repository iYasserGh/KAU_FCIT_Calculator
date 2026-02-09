function loadComponent(url, elementId) {
    fetch(url)
        .then(response => response.text())
        .then(html => {
            const tempDoc = document.createElement('html');
            tempDoc.innerHTML = html;
            console.log(tempDoc);
            const content = tempDoc.querySelector('#content').innerHTML;
            document.getElementById(elementId).innerHTML = content;
            
            tempDoc.querySelectorAll('script').forEach(link => {
                console.log(link);
                if (link.src && !document.querySelector(`script[src="${link.src}"]`)) {
                    const newScript = document.createElement('script');
                    newScript.src = link.src;
                    document.body.appendChild(newScript);
                }
            });
            tempDoc.remove();
        })
        .catch(error => {
            console.error('Error loading component:', error);
        });
}

// Load the navbar component into the element with id "navbar"
window.onload = function() {
    loadComponent('/components/navbar.html', 'navbar');
}