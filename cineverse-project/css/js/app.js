const TMDB_KEY = "764acde68ad57d8d41cb361d4fe0271b";
const TMDB_BASE = "https://api.themoviedb.org/3";
const TMDB_IMG = "https://image.tmdb.org/t/p/w300";
const TMDB_BG_IMG = "https://image.tmdb.org/t/p/original";

let masterCatalog = [];
let currentActiveMedia = { id: '', type: '' };

// Main renderer functions explicitly attached to window to prevent global drops
window.buildDashboard = function(movies) {
    const trendGrid = document.getElementById('grid-trending');
    if (!trendGrid) return;
    trendGrid.innerHTML = "";

    movies.forEach(movie => {
        const title = movie.title || movie.name || "Untitled Production";
        const date = (movie.release_date || movie.first_air_date || "2026").substring(0,4);
        const rating = movie.vote_average ? movie.vote_average.toFixed(1) : "N/A";
        const poster = movie.poster_path.startsWith('http') ? movie.poster_path : (TMDB_IMG + movie.poster_path);
        const mediaType = movie.media_type || (movie.first_air_date ? 'tv' : 'movie');

        trendGrid.innerHTML += `
            <div class="movie-card" onclick="window.showDetails(${movie.id}, '${mediaType}')">
                <div class="card-img-wrapper">
                    <img src="${poster}" alt="${title}">
                </div>
                <div class="card-details">
                    <h3>${title}</h3>
                    <div class="meta-line">
                        <span>${date}</span>
                        <span class="rating">★ ${rating}</span>
                    </div>
                </div>
            </div>
        `;
    });
};

window.renderTop10 = function(movies) {
    const top10Grid = document.getElementById('grid-top10');
    if (!top10Grid) return;
    top10Grid.innerHTML = "";

    movies.forEach((movie, index) => {
        const title = movie.title || movie.name || "Global Hit Film";
        const rating = movie.vote_average ? movie.vote_average.toFixed(1) : "9.0";
        const poster = movie.poster_path.startsWith('http') ? movie.poster_path : (TMDB_IMG + movie.poster_path);
        const mediaType = movie.media_type || (movie.first_air_date ? 'tv' : 'movie');

        top10Grid.innerHTML += `
            <div class="movie-card" onclick="window.showDetails(${movie.id}, '${mediaType}')">
                <div class="card-img-wrapper">
                    <div class="rank-badge">#${index + 1}</div>
                    <img src="${poster}" alt="${title}">
                </div>
                <div class="card-details">
                    <h3>${title}</h3>
                    <div class="meta-line">
                        <span>Trending Now</span>
                        <span class="rating">★ ${rating}</span>
                    </div>
                </div>
            </div>
        `;
    });
};

window.renderContinueWatching = function(movies) {
    const contGrid = document.getElementById('grid-continue');
    if (!contGrid) return;
    contGrid.innerHTML = "";

    const simulatedProgress = [68, 35];
    movies.forEach((movie, index) => {
        const title = movie.title || movie.name;
        const poster = movie.poster_path.startsWith('http') ? movie.poster_path : (TMDB_IMG + movie.poster_path);
        const progress = simulatedProgress[index] || 50;
        const mediaType = movie.media_type || (movie.first_air_date ? 'tv' : 'movie');

        contGrid.innerHTML += `
            <div class="movie-card" onclick="window.showDetails(${movie.id}, '${mediaType}')">
                <div class="card-img-wrapper">
                    <img src="${poster}" alt="${title}">
                    <div class="progress-container"><div class="progress-bar" style="width: ${progress}%"></div></div>
                </div>
                <div class="card-details">
                    <h3>${title}</h3>
                    <div class="meta-line">
                        <span>Resume Playing</span>
                        <span style="color:var(--accent-secondary); font-weight:600;">${progress}%</span>
                    </div>
                </div>
            </div>
        `;
    });
};

async function loadTMDBContent() {
    try {
        const trendRes = await fetch(`${TMDB_BASE}/trending/all/week?api_key=${TMDB_KEY}`);
        if (!trendRes.ok) throw new Error("API Limit");
        
        const trendData = await trendRes.json();
        masterCatalog = trendData.results || [];

        const popRes = await fetch(`${TMDB_BASE}/movie/top_rated?api_key=${TMDB_KEY}&page=1`);
        const popData = await popRes.json();
        const top10List = popData.results ? popData.results.slice(0, 10) : [];

        window.renderTop10(top10List);
        window.buildDashboard(masterCatalog);
        window.renderContinueWatching(masterCatalog.slice(3, 5)); 
    } catch (err) {
        console.warn("API Restriction hit. Launching absolute fail-safe fallback arrays.");
        
        // FOOLPROOF ABSOLUTE IMAGE URLS
        masterCatalog = [
            { id: 27205, title: "Inception", release_date: "2010-07-16", vote_average: 8.4, poster_path: "https://image.tmdb.org/t/p/w300/o0gii8vAn9m9Yg36ccpSTgZ4v2b.jpg", backdrop_path: "https://image.tmdb.org/t/p/original/8ZTVqvKDhz9vly4vRK3g04gY2gL.jpg", overview: "A thief who steals corporate secrets through dream-sharing technology." },
            { id: 157336, title: "Interstellar", release_date: "2014-11-05", vote_average: 8.4, poster_path: "https://image.tmdb.org/t/p/w300/gEU2vYmkafg5m3FYv6vVhyjClv2.jpg", backdrop_path: "https://image.tmdb.org/t/p/original/xJHokn8gto6mZ8PycmdvU6VmN8K.jpg", overview: "Explorers travel through a wormhole in space in an attempt to ensure humanity's survival." },
            { id: 155, title: "The Dark Knight", release_date: "2008-07-16", vote_average: 8.5, poster_path: "https://image.tmdb.org/t/p/w300/qJ2tWw7B6g27vC3HG6gGvCUwUAs.jpg", backdrop_path: "https://image.tmdb.org/t/p/original/nMK966lh9wXgjo993vunw37g9j6.jpg", overview: "Batman raises the stakes in his war on crime with the help of Lt. Jim Gordon and District Attorney Harvey Dent." },
            { id: 603, title: "The Matrix", release_date: "1999-03-30", vote_average: 8.2, poster_path: "https://image.tmdb.org/t/p/w300/f89U3w9zEQwJh2YgZpZ97Bh2XgX.jpg", backdrop_path: "https://image.tmdb.org/t/p/original/7u36496gYvXmGZ3w3vVhyjClv2.jpg", overview: "A computer hacker learns from mysterious rebels about the true nature of his reality." }
        ];

        window.renderTop10(masterCatalog);
        window.buildDashboard(masterCatalog);
        window.renderContinueWatching(masterCatalog.slice(0, 2));
    }
}

window.showDetails = async function(id, type) {
    const drawer = document.getElementById('details-drawer');
    if(!drawer) return;

    currentActiveMedia = { id: id, type: type };
    drawer.classList.add('active');
    window.closeVideoPlayer(); 

    try {
        const detailFetch = fetch(`${TMDB_BASE}/${type}/${id}?api_key=${TMDB_KEY}`);
        const relatedFetch = fetch(`${TMDB_BASE}/${type}/${id}/recommendations?api_key=${TMDB_KEY}`);
        
        const [detailRes, relatedRes] = await Promise.all([detailFetch, relatedFetch]);
        const details = await detailRes.json();
        const related = await relatedRes.json();

        const title = details.title || details.name || "Unknown Production";
        const date = (details.release_date || details.first_air_date || "2026").substring(0,4);
        const rating = details.vote_average ? details.vote_average.toFixed(1) : "N/A";
        const bgPath = details.backdrop_path ? (TMDB_BG_IMG + details.backdrop_path) : "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=1200&q=80";

        document.getElementById('drawer-title').innerText = title;
        document.getElementById('drawer-year').innerText = date;
        document.getElementById('drawer-rating').innerText = `★ ${rating}`;
        document.getElementById('drawer-type').innerText = type;
        document.getElementById('drawer-synopsis').innerText = details.overview || "No data analytics profiles synchronized.";
        document.getElementById('drawer-banner-img').style.backgroundImage = `url('${bgPath}')`;
    } catch (err) {
        // Fallback for details view window data
        const localData = masterCatalog.find(m => m.id === id);
        if(localData) {
            document.getElementById('drawer-title').innerText = localData.title;
            document.getElementById('drawer-year').innerText = localData.release_date.substring(0,4);
            document.getElementById('drawer-rating').innerText = `★ ${localData.vote_average}`;
            document.getElementById('drawer-synopsis').innerText = localData.overview;
            document.getElementById('drawer-banner-img').style.backgroundImage = `url('${localData.backdrop_path}')`;
        }
    }
};

window.switchServer = function(serverId) {
    const playerZone = document.getElementById('player-zone');
    const videoIframe = document.getElementById('video-iframe');
    const bannerImg = document.getElementById('drawer-banner-img');

    let embedUrl = "";
    const id = currentActiveMedia.id;
    const type = currentActiveMedia.type;

    if (serverId === 1) {
        embedUrl = type === 'movie' ? `https://vidsrc.me/embed/movie?tmdb=${id}` : `https://vidsrc.me/embed/tv?tmdb=${id}&season=1&episode=1`;
    } else {
        embedUrl = type === 'movie' ? `https://vidsrc.cc/vidsrc/movie/${id}` : `https://vidsrc.cc/vidsrc/tv/${id}/1/1`;
    }

    if(bannerImg) bannerImg.classList.add('hidden');
    if(playerZone) playerZone.classList.add('active');
    if(videoIframe) videoIframe.src = embedUrl;
};

window.closeVideoPlayer = function() {
    const playerZone = document.getElementById('player-zone');
    const videoIframe = document.getElementById('video-iframe');
    const bannerImg = document.getElementById('drawer-banner-img');

    if(playerZone) playerZone.classList.remove('active');
    if(videoIframe) videoIframe.src = ""; 
    if(bannerImg) bannerImg.classList.remove('hidden');
};

window.closeDetails = function() {
    window.closeVideoPlayer();
    document.getElementById('details-drawer').classList.remove('active');
};

window.executeSearch = async function() {
    const query = document.getElementById('search-input').value.trim().toLowerCase();
    const dropBox = document.getElementById('search-dropdown-box');
    if(!query) { dropBox.classList.remove('active'); return; }

    try {
        const searchRes = await fetch(`${TMDB_BASE}/search/multi?api_key=${TMDB_KEY}&query=${encodeURIComponent(query)}`);
        const searchData = await searchRes.json();
        const matches = searchData.results ? searchData.results.slice(0, 6) : [];
        dropBox.innerHTML = "";

        if(matches.length > 0) {
            dropBox.classList.add('active');
            matches.forEach(movie => {
                const title = movie.title || movie.name || "Media Title";
                const type = movie.media_type || (movie.first_air_date ? 'tv' : 'movie');
                const poster = movie.poster_path ? (TMDB_IMG + movie.poster_path) : "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=100&q=80";
                dropBox.innerHTML += `
                    <div class="search-item" onclick="window.showDetails(${movie.id}, '${type}'); document.getElementById('search-dropdown-box').classList.remove('active');">
                        <img src="${poster}">
                        <div class="search-item-info"><h4>${title}</h4></div>
                    </div>`;
            });
        }
    } catch (e) {}
};

window.filterGenre = function(genreName, element, genreId) {
    document.querySelectorAll('.genre-tag').forEach(t => t.classList.remove('active'));
    if (element) element.classList.add('active');
    if(genreName === 'All') { window.buildDashboard(masterCatalog); } 
    else if (genreId) { window.buildDashboard(masterCatalog.filter(m => m.genre_ids && m.genre_ids.includes(genreId))); }
};

// Canvas Engine Initialization
const canvas = document.getElementById('bg-canvas');
if(canvas) {
    const ctx = canvas.getContext('2d');
    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;
    class Particle {
        constructor() { this.reset(); }
        reset() { this.x = Math.random() * width; this.y = Math.random() * height; this.size = Math.random() * 1.5 + 0.4; this.speedY = -Math.random() * 0.3 - 0.1; this.alpha = Math.random() * 0.4 + 0.1; }
        update() { this.y += this.speedY; if (this.y < 0) { this.reset(); this.y = height; } }
        draw() { ctx.save(); ctx.globalAlpha = this.alpha; ctx.beginPath(); ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2); ctx.fillStyle = '#ffffff'; ctx.fill(); ctx.restore(); }
    }
    const particles = Array.from({ length: 30 }, () => new Particle());
    function animate() { ctx.clearRect(0, 0, width, height); particles.forEach(p => { p.update(); p.draw(); }); requestAnimationFrame(animate); }
    animate();
}

// Auto fire setup sequence seamlessly
if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", loadTMDBContent);
} else {
    loadTMDBContent();
}
