// js/main.js

document.addEventListener('DOMContentLoaded', () => {
    // Initialize all components
    initNavigation();
    loadGenres();
    initSearch();
    initScrollAnimations();
    initVideoPlayerProxy();
});

// 1. Navigation & Dropdown Logic
function initNavigation() {
    const dropdowns = document.querySelectorAll('.dropdown');
    dropdowns.forEach(dropdown => {
        dropdown.addEventListener('mouseenter', () => {
            const content = dropdown.querySelector('.dropdown-content');
            if (content) content.style.display = 'block';
        });
        dropdown.addEventListener('mouseleave', () => {
            const content = dropdown.querySelector('.dropdown-content');
            if (content) content.style.display = 'none';
        });
    });

    // Mobile menu toggle (if needed)
    const menuToggle = document.querySelector('.menu-toggle');
    if (menuToggle) {
        menuToggle.addEventListener('click', () => {
            document.querySelector('.nav-links').classList.toggle('active');
        });
    }
}