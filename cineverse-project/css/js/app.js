const TMDB_KEY = "764acde68ad57d8d41cb361d4fe0271b";
const TMDB_BASE = "https://api.themoviedb.org/3";
const TMDB_IMG = "https://image.tmdb.org/t/p/w300";
const TMDB_BG_IMG = "https://image.tmdb.org/t/p/original";

let masterCatalog = [];
let currentActiveMedia = { id: '', type: '' };

// Triggered automatically on page load now
async function loadTMDBContent() {
    try {
        const trendRes = await fetch(`${TMDB_BASE}/trending/all/week?api_key=${TMDB_KEY}`);
        const trendData = await trendRes.json();
        masterCatalog = trendData.results || [];

        const popRes = await fetch(`${TMDB_BASE}/movie/top_rated?api_key=${TMDB_KEY}&page=1`);
        const popData = await popRes.json();
        const top10List = popData.results ? popData.results.slice(0, 10) : [];

        renderTop10(top10List);
        buildDashboard(masterCatalog);
        renderContinueWatching(masterCatalog.slice(3, 5)); 
    } catch (err) {
        console.error("API Integration disruption context:", err);
    }
}

function buildDashboard(movies) {
    const trendGrid = document.getElementById('grid-trending');
    if (!trendGrid) return;
    trendGrid.innerHTML = "";

    movies.forEach(movie => {
        const title = movie.title || movie.name || "Untitled Production";
        const date = (movie.release_date || movie.first_air_date || "2026").substring(0,4);
        const rating = movie.vote_average ? movie.vote_average.toFixed(1) : "N/A";
        const poster = movie.poster_path ? (TMDB_IMG + movie.poster_path) : "https://images.unsplash.com/photo-1485846234645-a62644f84728?w=300&q=80";
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
}

function renderTop10(movies) {
    const top10Grid = document.getElementById('grid-top10');
    if (!top10Grid) return;
    top10Grid.innerHTML = "";

    movies.forEach((movie, index) => {
        const title = movie.title || movie.name || "Global Hit Film";
        const rating = movie.vote_average ? movie.vote_average.toFixed(1) : "9.0";
        const poster = movie.poster_path ? (TMDB_IMG + movie.poster_path) : "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=300&q=80";
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
}

function renderContinueWatching(movies) {
    const contGrid = document.getElementById('grid-continue');
    if (!contGrid) return;
    contGrid.innerHTML = "";

    const simulatedProgress = [68, 35];
    movies.forEach((movie, index) => {
        const title = movie.title || movie.name;
        const poster = movie.poster_path ? (TMDB_IMG + movie.poster_path) : "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=300&q=80";
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
}

window.showDetails = async function(id, type) {
    const drawer = document.getElementById('details-drawer');
    if(!drawer) return;

    currentActiveMedia = { id: id, type: type };
    drawer.classList.add('active');
    window.closeVideoPlayer(); 

    document.getElementById('drawer-title').innerText = "Syncing Catalog Data...";
    document.getElementById('drawer-synopsis').innerText = "Contacting database systems...";
    document.getElementById('drawer-related-grid').innerHTML = "";

    document.getElementById('server1-btn').classList.remove('active');
    document.getElementById('server2-btn').classList.remove('active');

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
        document.getElementById('drawer-synopsis').innerText = details.overview || "No data analytics profiles synchronized for this content listing item.";
        document.getElementById('drawer-banner-img').style.backgroundImage = `url('${bgPath}')`;

        const relatedGrid = document.getElementById('drawer-related-grid');
        const recommendations = related.results ? related.results.slice(0, 6) : [];

        if(recommendations.length > 0) {
            recommendations.forEach(item => {
                const rTitle = item.title || item.name || "Related Title";
                const rDate = (item.release_date || item.first_air_date || "2026").substring(0,4);
                const rRating = item.vote_average ? item.vote_average.toFixed(1) : "N/A";
                const rPoster = item.poster_path ? (TMDB_IMG + item.poster_path) : "https://images.unsplash.com/photo-1485846234645-a62644f84728?w=300&q=80";

                relatedGrid.innerHTML += `
                    <div class="movie-card" onclick="window.showDetails(${item.id}, '${type}')">
                        <div class="card-img-wrapper">
                            <img src="${rPoster}" alt="${rTitle}">
                        </div>
                        <div class="card-details">
                            <h3>${rTitle}</h3>
                            <div class="meta-line">
                                <span>${rDate}</span>
                                <span class="rating">★ ${rRating}</span>
                            </div>
                        </div>
                    </div>
                `;
            });
        } else {
            relatedGrid.innerHTML = `<p style="color: var(--text-muted); font-size: 0.85rem; padding: 1rem 0;">No matching recommendations detected.</p>`;
        }
    } catch (err) {
        console.error("Disruption loading drawer view execution arrays:", err);
    }
};

window.switchServer = function(serverId) {
    const playerZone = document.getElementById('player-zone');
    const videoIframe = document.getElementById('video-iframe');
    const bannerImg = document.getElementById('drawer-banner-img');
    const btn1 = document.getElementById('server1-btn');
    const btn2 = document.getElementById('server2-btn');

    let embedUrl = "";
    const id = currentActiveMedia.id;
    const type = currentActiveMedia.type;

    if (serverId === 1) {
        btn1.classList.add('active');
        btn2.classList.remove('active');
        embedUrl = type === 'movie' 
            ? `https://vidsrc.me/embed/movie?tmdb=${id}`
            : `https://vidsrc.me/embed/tv?tmdb=${id}&season=1&episode=1`;
    } else {
        btn1.classList.remove('active');
        btn2.classList.add('active');
        embedUrl = type === 'movie' 
            ? `https://vidsrc.cc/vidsrc/movie/${id}`
            : `https://vidsrc.cc/vidsrc/tv/${id}/1/1`;
    }

    bannerImg.classList.add('hidden');
    playerZone.classList.add('active');
    videoIframe.src = embedUrl;
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
    
    if(!query) {
        dropBox.classList.remove('active');
        return;
    }

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
                const rating = movie.vote_average ? movie.vote_average.toFixed(1) : "N/A";
                const poster = movie.poster_path ? (TMDB_IMG + movie.poster_path) : "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=100&q=80";
                
                dropBox.innerHTML += `
                    <div class="search-item" onclick="window.showDetails(${movie.id}, '${type}'); document.getElementById('search-dropdown-box').classList.remove('active');">
                        <img src="${poster}">
                        <div class="search-item-info">
                            <h4>${title}</h4>
                            <p>${type.toUpperCase()} • ★ ${rating}</p>
                        </div>
                    </div>
                `;
            });
        } else {
            dropBox.innerHTML = `<div class="search-item"><div class="search-item-info"><h4>No matches discovered</h4></div></div>`;
            dropBox.classList.add('active');
        }
    } catch (err) {
        console.error("Search index module execution error:", err);
    }
};

window.filterGenre = function(genreName, element, genreId) {
    document.querySelectorAll('.genre-tag').forEach(t => t.classList.remove('active'));
    if (element) element.classList.add('active');

    if(genreName === 'All') {
        buildDashboard(masterCatalog);
    } else if (genreId) {
        const filtered = masterCatalog.filter(m => m.genre_ids && m.genre_ids.includes(genreId));
        buildDashboard(filtered);
    }
};

document.addEventListener('click', (e) => {
    const box = document.getElementById('search-dropdown-box');
    if(box && !e.target.closest('.search-container')) {
        box.classList.remove('active');
    }
});

// Ambient Starfield Canvas Engine
const canvas = document.getElementById('bg-canvas');
const ctx = canvas.getContext('2d');
let width = canvas.width = window.innerWidth;
let height = canvas.height = window.innerHeight;

window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
});

class Particle {
    constructor() { this.reset(); }
    reset() {
        this.x = Math.random() * width; this.y = Math.random() * height;
        this.size = Math.random() * 1.5 + 0.4; this.speedY = -Math.random() * 0.3 - 0.1; 
        this.alpha = Math.random() * 0.4 + 0.1;
    }
    update() {
        this.y += this.speedY;
        if (this.y < 0) { this.reset(); this.y = height; }
    }
    draw() {
        ctx.save(); ctx.globalAlpha = this.alpha; ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2); ctx.fillStyle = '#ffffff';
        ctx.fill(); ctx.restore();
    }
}

const particles = Array.from({ length: 40 }, () => new Particle());
function animate() {
    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = 'rgba(5, 5, 8, 0.5)'; ctx.fillRect(0, 0, width, height);
    particles.forEach(p => { p.update(); p.draw(); });
    requestAnimationFrame(animate);
}
animate();

// NEW: Automate instant load sequence on structural stabilization
document.addEventListener("DOMContentLoaded", loadTMDBContent);
