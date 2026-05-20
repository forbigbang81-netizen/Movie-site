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

// 2. Dynamic Genre Loading
async function loadGenres() {
    const genreContainer = document.getElementById('genreDropdown');
    if (!genreContainer) return;

    // Mock API Endpoint - Replace with real API call
    const genres = [
        "Action", "Adventure", "Animation", "Comedy", "Crime", 
        "Documentary", "Drama", "Family", "Fantasy", "Horror", 
        "Mystery", "Romance", "Sci-Fi", "Thriller", "Western"
    ];

    genreContainer.innerHTML = genres.map(genre => 
        <a href="movies.html?genre=${encodeURIComponent(genre)}">${genre}</a>
    ).join('');
}

// 3. Search Functionality
function initSearch() {
    const searchInput = document.getElementById('searchInput');
    const searchButton = document.getElementById('searchButton');

    const performSearch = () => {
        const query = searchInput.value.trim();
        if (query) {
            window.location.href = search.html?q=${encodeURIComponent(query)};
        }
    };

    if (searchButton) searchButton.addEventListener('click', performSearch);
    if (searchInput) searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') performSearch();
    });
}

// 4. Scroll Animations (Intersection Observer)
function initScrollAnimations() {
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Stop observing once visible
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Elements to animate
    const animatedElements = document.querySelectorAll('.movie-card, .series-card, .section-padding');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });

    // Add CSS class for visibility
    const style = document.createElement('style');
    style.textContent = 
        .visible {
            opacity: 1 !important;
            transform: translateY(0) !important;
        }
    ;
    document.head.appendChild(style);
}

// 5. Video Player Proxy Handler
// This handles fetching video streams through a proxy to avoid CORS issues
function initVideoPlayerProxy() {
    console.log("Video Player Proxy Initialized");
    // Logic will be integrated into the specific player page
}

// 6. Utility: Format Duration
function formatDuration(seconds) {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return h > 0 ? ${h}h ${m}m : ${m}m ${s}s;
}