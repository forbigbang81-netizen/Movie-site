const API_KEY = 'c030ba389534870868d461b8a5812f62';
const DB_KEY = 'STREAMPRO_ELITE_DATA';

// Global state tracking
let cur = { id: '', type: '', s: 1, e: 1, title: '', poster: '', time: '', server: 'vidking' };

window.onload = () => {
    fetchTrending();
    renderDashboard();
};

/**
 * PAGE NAVIGATION
 */
function showPage(id) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.getElementById(id).classList.add('active');
    if(id === 'dashboard') renderDashboard();
    window.scrollTo(0,0);
}

/**
 * CORE PLAYER LOGIC
 */
async function startApp(id, type, title, poster) {
    showPage('playerPage');
    cur = { id, type, title, poster, s: 1, e: 1, time: '', server: 'vidking' };
    
    // Check local storage for existing progress
    const hist = JSON.parse(localStorage.getItem(DB_KEY)) || {};
    if(hist[id]) {
        cur.s = hist[id].s || 1;
        cur.e = hist[id].e || 1;
        cur.server = hist[id].server || 'vidking';
        document.getElementById('timeInput').value = hist[id].time || '';
    } else {
        document.getElementById('timeInput').value = '';
    }

    updateVideo();
    
    if(type === 'tv') {
        loadTVMeta();
    } else {
        document.getElementById('tvControls').style.display = 'none';
    }
    
    fetchSimilar(id, type);
}

function updateVideo() {
    const frame = document.getElementById('mainFrame');
    // Multi-server support to prevent "won't load" errors
    const baseUrl = cur.server === 'vidking' ? 'https://vidking.bio/embed/' : 'https://vidsrc.xyz/embed/';
    const path = cur.type === 'tv' 
        ? `${cur.id}/${cur.s}${cur.server === 'vidking' ? '/' : '-'}${cur.e}` 
        : cur.id;
    
    frame.src = `${baseUrl}${cur.type}/${path}`;
    document.getElementById('playerMeta').innerText = cur.title + (cur.type === 'tv' ? ` - S${cur.s}:E${cur.e}` : '');
    
    // Update active server button UI
    document.querySelectorAll('.srv-btn').forEach(b => b.classList.remove('active'));
    document.getElementById(`btn-${cur.server}`).classList.add('active');
}

function toggleServer(srv) {
    cur.server = srv;
    updateVideo();
}

/**
 * STORAGE & HISTORY
 */
function manualSave() {
    cur.time = document.getElementById('timeInput').value;
    cur.stamp = Date.now();
    
    const hist = JSON.parse(localStorage.getItem(DB_KEY)) || {};
    hist[cur.id] = { ...cur };
    localStorage.setItem(DB_KEY, JSON.stringify(hist));

    const btn = document.getElementById('saveBtn');
    btn.innerText = "✓ SAVED TO STORAGE";
    btn.style.background = "#2ecc71";
    
    setTimeout(() => {
        btn.innerText = "SAVE PROGRESS";
        btn.style.background = "";
    }, 2000);
}

function renderDashboard() {
    const grid = document.getElementById('continueGrid');
    const data = JSON.parse(localStorage.getItem(DB_KEY)) || {};
    const items = Object.values(data).sort((a,b) => b.stamp - a.stamp);
    
    grid.innerHTML = items.length ? '' : '<p style="color:#666; padding: 20px;">No watch history found.</p>';
    
    items.forEach(m => {
        const card = createCard(m);
        // Add progress labels for the professional look
        const tag = document.createElement('div');
        tag.className = 'progress-tag';
        tag.style.cssText = "position:absolute; bottom:0; width:100%; background:rgba(229,9,20,0.9); font-size:10px; padding:5px 0; text-align:center; font-weight:800;";
        tag.innerHTML = `${m.type==='tv' ? `S${m.s}:E${m.e}` : 'RESUME'}<br><span style="font-size:8px; opacity:0.8;">${m.time || ''}</span>`;
        card.appendChild(tag);
        grid.appendChild(card);
    });
}

/**
 * DATA FETCHING (The "Missing Cards" Fix)
 */
function fetchTrending() {
    fetch(`https://api.themoviedb.org/3/trending/all/day?api_key=${API_KEY}`)
        .then(res => res.json())
        .then(data => renderGrid(data.results, 'trendingGrid'))
        .catch(err => console.error("Trending fetch failed", err));
}

async function handleSearch(q) {
    if(q.length < 2) return;
    const res = await fetch(`https://api.themoviedb.org/3/search/multi?api_key=${API_KEY}&query=${q}`).then(r => r.json());
    renderGrid(res.results.filter(i => i.media_type !== 'person' && i.poster_path), 'trendingGrid');
    document.getElementById('heroTitle').innerText = `Results for: ${q}`;
}

async function fetchSimilar(id, type) {
    const res = await fetch(`https://api.themoviedb.org/3/${type}/${id}/similar?api_key=${API_KEY}`).then(r => r.json());
    renderGrid(res.results.slice(0, 10), 'similarGrid');
}

/**
 * UI HELPERS
 */
function renderGrid(data, gridId) {
    const grid = document.getElementById(gridId);
    if(!grid) return;
    grid.innerHTML = '';
    data.forEach(item => {
        grid.appendChild(createCard(item));
    });
}

function createCard(m) {
    const card = document.createElement('div');
    card.className = 'movie-card';
    const title = m.title || m.name || cur.title;
    const poster = m.poster_path || m.poster;
    const type = m.media_type || m.type || (m.title ? 'movie' : 'tv');

    card.innerHTML = `<img src="https://image.tmdb.org/t/p/w342${poster}" alt="${title}" loading="lazy">`;
    card.onclick = () => startApp(m.id, type, title, poster);
    return card;
}

async function loadTVMeta() {
    const controls = document.getElementById('tvControls');
    controls.style.display = 'block';
    
    const res = await fetch(`https://api.themoviedb.org/3/tv/${cur.id}?api_key=${API_KEY}`).then(r => r.json());
    const select = document.getElementById('seasonSelect');
    
    select.innerHTML = res.seasons
        .filter(s => s.season_number > 0)
        .map(s => `<option value="${s.season_number}" ${s.season_number == cur.s ? 'selected' : ''}>Season ${s.season_number}</option>`)
        .join('');
        
    loadSeason(true);
}

async function loadSeason(init = false) {
    cur.s = document.getElementById('seasonSelect').value;
    const r = await fetch(`https://api.themoviedb.org/3/tv/${cur.id}/season/${cur.s}?api_key=${API_KEY}`).then(res => res.json());
    const grid = document.getElementById('epGrid');
    grid.innerHTML = '';
    
    r.episodes.forEach(ep => {
        const div = document.createElement('div');
        div.className = `ep-node ${ep.episode_number == cur.e ? 'active' : ''}`;
        div.innerText = ep.episode_number;
        div.onclick = () => { 
            cur.e = ep.episode_number; 
            updateVideo(); 
            document.querySelectorAll('.ep-node').forEach(n => n.classList.remove('active'));
            div.classList.add('active');
        };
        grid.appendChild(div);
    });
    
    if(!init) {
        cur.e = 1;
        updateVideo();
    }
}
