// ... (Keep your Firebase config and initialization code at the top exactly the same)

// Active Verification Session Observer
onAuthStateChanged(auth, (user) => {
    if (user && user.emailVerified) {
        // Active key token verified, skip login gates instantly
        if (typeof window.enterDashboard === "function") {
            window.enterDashboard();
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

// FIX: Explicitly binding handleAuth to the global window space
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
