function toggleNavList(button) {
    button.classList.toggle('rotate-180');
    const menu = document.getElementById('navList');
    menu.classList.toggle('hidden');
}

function toggleSubMenu(button) {
    button.querySelector('svg').classList.toggle('rotate-180');
    const menu = button.nextElementSibling;
    menu.classList.toggle('hidden');
}