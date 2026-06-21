document.addEventListener("DOMContentLoaded", () => {

    if (localStorage.getItem("darkMode") === "true") {
        document.body.classList.add("dark-mode");
    }

    const contactBtn = document.getElementById("contact-btn");
    const settingsBtn = document.getElementById("settings-btn");
    const loginForm = document.getElementById("login-form");

    if (contactBtn) {
        contactBtn.addEventListener("click", () => {
            window.location.href = "Contact.html";
        });
    }

    if (settingsBtn) {
        settingsBtn.addEventListener("click", () => {
            window.location.href = "Settings.html";
        });
    }

    if (!loginForm) return;

    loginForm.addEventListener("submit", (event) => {
        event.preventDefault();

        const errorBox = document.getElementById("error-message");
        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value.trim();

        errorBox.classList.add("hidden");

        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

        if (email === "" || password === "") {
            errorBox.innerHTML = "Please fill all fields";
            errorBox.classList.remove("hidden");
            return;
        }

        if (!emailPattern.test(email)) {
            errorBox.innerHTML = "Please enter a valid email address";
            errorBox.classList.remove("hidden");
            return;
        }

        if (!passwordPattern.test(password)) {
            errorBox.innerHTML =
                "<strong>Invalid Password:</strong><br>" +
                "Must contain at least 8 characters, one uppercase letter, one lowercase letter and one number.";
            errorBox.classList.remove("hidden");
            return;
        }

        // 🔥 שליחת נתוני התחברות לשרת ובדיקה מול ה-Database
        fetch('http://localhost:5000/api/users/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        })
        .then(response => response.json())
        .then(data => {
    if (data.message === 'Login successful! 👋') {
        // 🔥 שומרים את השם המלא שהגיע מהשרת בתוך ה-localStorage
        localStorage.setItem("userFullName", data.user.full_name);
        
        // מעבר לעמוד הראשי
        window.location.href = "MainMenu.html";
    } else {
        errorBox.innerHTML = data.message || "Login failed";
        errorBox.classList.remove("hidden");
    }
})
        .catch(err => {
            console.error('Error during login fetch:', err);
            errorBox.innerHTML = "Server error, please try again.";
            errorBox.classList.remove("hidden");
        });
    });

    const signupBtn = document.getElementById("signup-btn");
    if (signupBtn) {
        signupBtn.addEventListener("click", () => {
            window.location.href = "Register.html";
        });
    }
});