const API_KEY = 'c030ba389534870868d461b8a5812f62';
const DB_KEY = 'STREAMPRO_ELITE_DATA';

let cur = { id: '', type: '', s: 1, e: 1, title: '', poster: '', time: '', server: 'vidking' };

window.onload = () => {
    fetchTrending();
    renderDashboard();
};

function showPage(id) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.getElementById(id).classList.add('active');
    if(id === 'dashboard') renderDashboard();
}

// Global Save Logic
function manualSave() {
    cur.time = document.getElementById('timeInput').value;
    cur.stamp = Date.now();
    const hist = JSON.parse(localStorage.getItem(DB_KEY)) || {};
    hist[cur.id] = { ...cur };
    localStorage.setItem(DB_KEY, JSON.stringify(hist));

    const btn = document.getElementById('saveBtn');
    btn.innerText = "✓ SAVED TO SERVER";
    setTimeout(() => btn.innerText = "SAVE PROGRESS", 2000);
}

// Server Switch Logic
function toggleServer(srv) {
    cur.server = srv;
    document.querySelectorAll('.srv-btn').forEach(b => b.classList.remove('active'));
    document.getElementById('btn-' + srv).classList.add('active');
    updateVideo();
}

function updateVideo() {
    const frame = document.getElementById('mainFrame');
    const baseUrl = cur.server === 'vidking' ? 'https://vidking.bio/embed/' : 'https://vidsrc.xyz/embed/';
    const path = cur.type === 'tv' 
        ? `${cur.id}/${cur.s}${cur.server === 'vidking' ? '/' : '-'}${cur.e}` 
        : cur.id;
    
    frame.src = `${baseUrl}${cur.type}/${path}`;
    document.getElementById('playerMeta').innerText = cur.title + (cur.type === 'tv' ? ` - Season ${cur.s} Episode ${cur.e}` : '');
}

async function startApp(id, type, title, poster) {
    showPage('playerPage');
    window.scrollTo(0,0);
    cur = { id, type, title, poster, s: 1, e: 1, time: '', server: 'vidking' };
    
    const hist = JSON.parse(localStorage.getItem(DB_KEY)) || {};
    if(hist[id]) {
        cur.s = hist[id].s || 1;
        cur.e = hist[id].e || 1;
        document.getElementById('timeInput').value = hist[id].time || '';
    }

    updateVideo();
    if(type === 'tv') loadTVMeta();
    else document.getElementById('tvControls').style.display = 'none';
    fetchSimilar(id, type);
}

// ... Additional TMDB Fetching Logic (Trending, Search, Similar) ...
// (These remain consistent with previous versions but optimized for the new UI)
