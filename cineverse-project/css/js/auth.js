import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, sendEmailVerification, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-auth.js";

const firebaseConfig = {
    apiKey: "AIzaSyCDaf8skPHPqxvXUsDecwpP8cUMbAo2aZI",
    authDomain: "movie-site-1db2e.firebaseapp.com",
    projectId: "movie-site-1db2e",
    storageBucket: "movie-site-1db2e.firebasestorage.app",
    messagingSenderId: "741820670818",
    appId: "1:741820670818:web:bf89e29e0146c9484b023b"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Make auth globally accessible so app.js can use it
window.firebaseAuthInstance = auth;
window.firebaseSignOut = signOut;
window.firebaseCreateUser = createUserWithEmailAndPassword;
window.firebaseSignIn = signInWithEmailAndPassword;
window.firebaseSendVerification = sendEmailVerification;

// Active Verification Session Observer
onAuthStateChanged(auth, (user) => {
    if (user) {
        if (user.emailVerified) {
            if (typeof window.enterDashboard === "function") {
                window.enterDashboard();
            }
        } else {
            if (typeof window.switchPane === "function") window.switchPane('landing');
        }
    } else {
        const dash = document.getElementById('view-app-dashboard');
        const land = document.getElementById('view-app-landing');
        if (dash) dash.classList.remove('active');
        if (land) land.classList.add('active');
        document.body.classList.add('lock-scroll');
    }
});
