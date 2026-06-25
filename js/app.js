document.addEventListener('DOMContentLoaded', () => {
    const hamburger = document.querySelector('.isola-hamburger');
    const isola = document.querySelector('.isola');
    const top = document.querySelector('.isola-top');
    const menu = document.querySelector('.isola-menu');

    let isOpen = false;

    hamburger.addEventListener('click', () => {
        isOpen = !isOpen;

        hamburger.classList.toggle('aperto', isOpen);

        const targetHeight = isOpen
            ? top.scrollHeight + menu.scrollHeight
            : top.scrollHeight;

        isola.style.maxHeight = targetHeight + 'px';
    });
});
