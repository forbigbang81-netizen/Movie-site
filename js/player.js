``javascript
// js/player.js

document.addEventListener('DOMContentLoaded', () => {
const urlParams = new URLSearchParams(window.location.search);
const mediaId = urlParams.get('id');
const type = urlParams.get('type') || 'movie'; // 'movie' or 'series'
const episodeId = urlParams.get('episode') || 1;

// 1. Load Media Data (Mock API)
loadMediaData(mediaId, type, episodeId);

// 2. Load Comments
loadComments(mediaId);

// 3. Check Auth Status for Commenting
checkAuthStatus();

// 4. Initialize Video Player
initVideoPlayer();
});

// --- PROXY & VIDEO LOADING ---
async function loadMediaData(id, type, episode) {
// MOCK API DATA - In production, fetch from your backend
const mockData = {
movie: {
title: "Inception",
year: 2010,
rating: "PG-13",
duration: "2h 28m",
description: "A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.",
videoSrc: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4", // Sample video
subtitles: "/subtitles/inception.vtt"
},
series: {
title: "Stranger Things",
year: 2016,
rating: "TV-14",
duration: "45m per episode",
description: "When a young boy disappears, his mother, a police chief and his friends must confront terrifying supernatural forces in order to get him back.",
episodes: [
{ id: 1, title: "Chapter One: The Vanishing of Will Byers", src: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4" },
{ id: 2, title: "Chapter Two: The Weirdo on Maple Street", src: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4" },
{ id: 3, title: "Chapter Three: Holly, Jolly", src: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4" }
]
}
};

const data = type === 'movie' ? mockData.movie : mockData.series;

// Update DOM
document.getElementById('media-title').textContent = data.title;
document.querySelector('.year').textContent = data.year;
document.querySelector('.rating').textContent = data.rating;
document.querySelector('.duration').textContent = data.duration;
document.getElementById('media-description').textContent = data.description;

// Load Video Source via Proxy
const video = document.getElementById('main-video');
let videoSrc = data.videoSrc;

if (type === 'series') {
const currentEpisode = data.episodes.find(ep => ep.id == episode) || data.episodes[0];
videoSrc = currentEpisode.src;
renderEpisodeList(data.episodes, episode);
}

// PROXY INTEGRATION: Use a CORS proxy if direct access fails
// Example Proxy: https://cors-anywhere.herokuapp.com/ (Requires activation)
const proxyUrl = 'https://cors-proxy.example.com/'; // Replace with actual proxy
const finalSrc = proxyUrl + encodeURIComponent(videoSrc);

video.src = videoSrc; // Direct source (for demo) - Use finalSrc in production
video.load();
}

// --- EPISODE LIST RENDERING ---
function renderEpisodeList(episodes, activeId) {
const listContainer = document.querySelector('.episode-list');
listContainer.innerHTML = episodes.map(ep =>
<li class="${ep.id == activeId ? 'active' : ''}"
onclick="changeEpisode(${ep.id})">
<span>Episode ${ep.id}: ${ep.title}</span>
<i class="fas fa-play"></i>
</li>
`).join('');
}

function changeEpisode(episodeId) {
const url = new URL(window.location);
url.searchParams.set('episode', episodeId);
window.location.href = url.toString();
}

// --- VIDEO PLAYER CONTROLS ---
function initVideoPlayer() {
const video = document.getElementById('main-video');
const overlay = document.querySelector('.video-overlay');
const playBtnOverlay = document.querySelector('.play-btn-overlay');

// Play/Pause on overlay click
if (playBtnOverlay) {
playBtnOverlay.addEventListener('click', () => {
if (video.paused) {
video.play();
playBtnOverlay.style.opacity = '0';
} else {
video.pause();
playBtnOverlay.style.opacity = '1';
}
});
}

// Keyboard Shortcuts
document.addEventListener('keydown', (e) => {
if (e.target.tagName === 'TEXTAREA') return; // Ignore if typing comment

switch(e.key) {
case ' ':
case 'k':
e.preventDefault();
video.paused ? video.play() : video.pause();
break;
case 'f':
toggleFullscreen();
break;
case 'ArrowRight':
video.currentTime += 10;
break;
case 'ArrowLeft':
video.currentTime -= 10;
break;
}
});
}

function toggleFullscreen() {
const container = document.querySelector('.video-wrapper');
if (!document.fullscreenElement) {
container.requestFullscreen().catch(err => console.log(err));
} else {
document.exitFullscreen();
}
}

// --- COMMENTS SYSTEM ---
function checkAuthStatus() {
// Check if user is logged in (mock check using localStorage)
const user = JSON.parse(localStorage.getItem('jiroviral_user'));
const formContainer = document.getElementById('comment-form-container');
const loginPrompt = document.getElementById('login-prompt');

if (user) {
formContainer.style.display = 'block';
loginPrompt.style.display = 'none';
} else {
formContainer.style.display = 'none';
loginPrompt.style.display = 'block';
}
}

function loadComments(mediaId) {
// Mock Comments Data
const comments = [
{ id: 1, author: "MovieFan99", text: "Amazing cinematography! The proxy streaming works perfectly