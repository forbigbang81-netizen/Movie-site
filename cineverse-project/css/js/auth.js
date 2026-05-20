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

// Active Verification Session Observer
onAuthStateChanged(auth, (user) => {
    if (user) {
        if (user.emailVerified) {
            if (typeof window.enterDashboard === "function") {
                window.enterDashboard();
            }
        } else {
            // Logged in but not verified
            const land = document.getElementById('view-app-landing');
            if (land) window.switchPane('landing');
        }
    } else {
        // Clear workspace states and redirect to safe login lanes
        const dash = document.getElementById('view-app-dashboard');
        const land = document.getElementById('view-app-landing');
        if (dash) dash.classList.remove('active');
        if (land) land.classList.add('active');
        document.body.classList.add('lock-scroll');
    }
});

// Use robust Event Listeners instead of HTML attributes
document.addEventListener("DOMContentLoaded", () => {
    const regForm = document.getElementById("register-form");
    const loginForm = document.getElementById("login-form");

    if (regForm) {
        regForm.addEventListener("submit", async (event) => {
            event.preventDefault();
            const email = document.getElementById('reg-email').value;
            const password = document.getElementById('reg-pass').value;
            try {
                const userCredential = await createUserWithEmailAndPassword(auth, email, password);
                await sendEmailVerification(userCredential.user);
                alert("Verification link sent! Check your Gmail inbox.");
                if (typeof window.switchPane === "function") window.switchPane('landing');
            } catch (error) { 
                alert("Registration Error: " + error.message); 
            }
        });
    }

    if (loginForm) {
        loginForm.addEventListener("submit", async (event) => {
            event.preventDefault();
            const email = document.getElementById('login-email').value;
            const password = document.getElementById('login-pass').value;
            try {
                const userCredential = await signInWithEmailAndPassword(auth, email, password);
                if (!userCredential.user.emailVerified) {
                    alert("Please complete verification via the email sent to your inbox first.");
                    await signOut(auth);
                } else {
                    const popup = document.getElementById('verification-popup');
                    if (popup) popup.classList.add('active');
                }
            } catch (error) { 
                alert("Login Error: " + error.message); 
            }
        });
    }
});

// Keep logout globally accessible for the dashboard button
window.handleLogout = async function() {
    try {
        await signOut(auth);
        if (typeof window.closeDetails === "function") {
            window.closeDetails();
        }
    } catch (error) { 
        alert(error.message); 
    }
};
