const API_KEY = 'c030ba389534870868d461b8a5812f62';
const DB_KEY = 'STREAMPRO_LOCAL_DB';

let cur = { id: '', type: '', s: 1, e: 1, title: '', poster: '', time: '', server: 'vidking' };

// Initialize App
function initApp() {
    renderDashboard();
    fetchTrending();
}

// Save to "Local Server"
function manualSave() {
    cur.time = document.getElementById('timeInput').value;
    cur.stamp = Date.now();
    
    const hist = JSON.parse(localStorage.getItem(DB_KEY)) || {};
    hist[cur.id] = { ...cur };
    localStorage.setItem(DB_KEY, JSON.stringify(hist));

    const btn = document.getElementById('saveBtn');
    btn.innerText = "✓ SAVED";
    btn.classList.add('saved');
    setTimeout(() => {
        btn.innerText = "SAVE PROGRESS";
        btn.classList.remove('saved');
    }, 2000);
}

// Update the Video Source (The Fix)
function updateVideo() {
    const frame = document.getElementById('mainFrame');
    let url = '';
    
    if (cur.server === 'vidking') {
        url = `https://vidking.bio/embed/${cur.type}/${cur.id}${cur.type === 'tv' ? `/${cur.s}/${cur.e}` : ''}`;
    } else {
        url = `https://vidsrc.xyz/embed/${cur.type}/${cur.id}${cur.type === 'tv' ? `/${cur.s}-${cur.e}` : ''}`;
    }
    
    frame.src = url;
    document.getElementById('playerMeta').innerText = `${cur.title} ${cur.type === 'tv' ? `(S${cur.s}:E${cur.e})` : ''}`;
}

// Switch Servers if one fails
function toggleServer(name) {
    cur.server = name;
    document.querySelectorAll('.srv-btn').forEach(b => b.classList.remove('active'));
    document.getElementById('btn-' + name).classList.add('active');
    updateVideo();
}

// Other functions (fetchTrending, renderDashboard, startApp, etc.) would go here...
