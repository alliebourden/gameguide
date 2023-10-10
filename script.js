// nav bar script
const navEl = document.querySelector('.nav');
const hamburgerEl = document.querySelector('.hamburger');

hamburgerEl.addEventListener('click', () => {
    toggleMenu();
});


document.addEventListener('click', (event) => {
    if (!isInsideMenu(event.target)) {
        closeMenu();
    }
});

window.addEventListener('scroll', () => {
    closeMenu();
});

function isInsideMenu(element) {
    return navEl.contains(element) || hamburgerEl.contains(element);
}

function closeMenu() {
    if (navEl.classList.contains('nav--open')) {
        navEl.classList.remove('nav--open');
        hamburgerEl.classList.remove('hamburger--open');
    }
}

function toggleMenu() {
    navEl.classList.toggle('nav--open');
    hamburgerEl.classList.toggle('hamburger--open');
}