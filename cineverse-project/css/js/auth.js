import { initializeApp } from "https://www.gstatic.com/firebasejs/12.13.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, sendEmailVerification, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/12.13.0/firebase-auth.js";

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

// Active Verification Session Observer
onAuthStateChanged(auth, (user) => {
    if (user && user.emailVerified) {
        // Active key token verified, skip login gates instantly
        window.enterDashboard();
    } else {
        // Clear workspace states and redirect to safe login lanes
        document.getElementById('view-app-dashboard').classList.remove('active');
        document.getElementById('view-app-landing').classList.add('active');
        document.body.classList.add('lock-scroll');
    }
});

window.handleAuth = async function(event, type) {
    event.preventDefault();
    if (type === 'register') {
        const email = document.getElementById('reg-email').value;
        const password = document.getElementById('reg-pass').value;
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            await sendEmailVerification(userCredential.user);
            alert("Verification link sent! Check your Gmail inbox.");
            window.switchPane('landing');
        } catch (error) { alert(error.message); }
    } else if (type === 'login') {
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-pass').value;
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            if (!userCredential.user.emailVerified) {
                alert("Please complete verification via the email sent to your inbox first.");
            } else {
                document.getElementById('verification-popup').classList.add('active');
            }
        } catch (error) { alert(error.message); }
    }
};

window.handleLogout = async function() {
    try {
        await signOut(auth);
        if (typeof window.closeDetails === "function") {
            window.closeDetails();
        }
    } catch (error) { alert(error.message); }
};
