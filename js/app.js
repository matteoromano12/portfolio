const hamburger = document.querySelector('.isola-hamburger');
const dropdown = document.querySelector('.menu-dropdown');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('aperto');
    dropdown.classList.toggle('aperto');
});
