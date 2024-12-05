const CLIENT_ID = '984004975629-rh051nbv4hauq0qk347n3ikbk303sg6o.apps.googleusercontent.com'; 
const REDIRECT_URI = window.location.origin + '/chatbot.html';

const baseUrl = window.location.origin;

document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById("login-form");
    if (!loginForm) return;

    loginForm.addEventListener("submit", function (e) {
        e.preventDefault();
        const email = document.getElementById("login-email").value.trim();
        const password = document.getElementById("login-password").value;
        const errorMessage = document.getElementById("login-error-message");
        
        if (!email || !password) {
            errorMessage.style.color = "red";
            errorMessage.textContent = "Please fill out all fields!";
            return;
        }
        
        const users = JSON.parse(localStorage.getItem("users")) || [];
        const user = users.find((u) => u.email === email && u.password === password);
        
        if (!user) {
            errorMessage.style.color = "red";
            errorMessage.textContent = "Invalid email or password. Try again!";
            return;
        }
        
        const authToken = generateAuthToken();
        const userSession = {
            email: user.email,
            name: user.name,
            authToken: authToken,
            loginTime: new Date().toISOString()
        };
        
        localStorage.setItem("currentUser", JSON.stringify(userSession));
        
        errorMessage.style.color = "red";
        errorMessage.textContent = "Login successful! Redirecting...";
        setTimeout(() => {
            window.location.href = "chatbot.html";
        }, 1000);
    });
});

function generateAuthToken() {
    return 'auth_' + Math.random().toString(36).substr(2) + Date.now().toString(36);
}

function checkAuth() {
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    if (!currentUser || !currentUser.authToken) {
        window.location.href = "login.html";
        return false;
    }
    return true;
}

function handleGoogleSignIn(response) {
    if (!response || !response.credential) {
        console.error("Invalid Google sign-in response");
        showError("Google sign-in failed. Please try again.");
        return;
    }

    try {
        const credential = response.credential;
        const decodedToken = JSON.parse(atob(credential.split('.')[1]));
        
        const googleUser = {
            email: decodedToken.email,
            name: decodedToken.name,
            picture: decodedToken.picture,
            authToken: generateAuthToken(),
            loginTime: new Date().toISOString(),
            isGoogleUser: true
        };
        
        localStorage.setItem("currentUser", JSON.stringify(googleUser));
        
        showSuccess("Login successful! Redirecting...");
        setTimeout(() => {
            window.location.href = "chatbot.html";
        }, 1000);
    } catch (error) {
        console.error("Error processing Google sign-in:", error);
        showError("Error processing Google sign-in. Please try again.");
    }
}

window.onload = function() {
    google.accounts.id.initialize({
        client_id: CLIENT_ID,
        callback: handleGoogleSignIn,
        auto_select: false,
        cancel_on_tap_outside: true
    });
    
    google.accounts.id.renderButton(
        document.querySelector(".g_id_signin"),
        { 
            theme: "outline", 
            size: "large",
            width: 250,
            text: "continue_with"
        }
    );
}

function showError(message) {
    const errorElement = document.getElementById("login-error-message");
    errorElement.style.color = "red";
    errorElement.textContent = message;
}

function showSuccess(message) {
    const errorElement = document.getElementById("login-error-message");
    errorElement.style.color = "green";
    errorElement.textContent = message;
}

function logout() {
    localStorage.removeItem("currentUser");
    window.location.href = "login.html";
}

if (window.location.pathname.includes('chatbot.html')) {
    if (!checkAuth()) {
        window.location.href = "login.html";
    }
}
