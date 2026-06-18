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

        // Login successful
        window.location.href = "MainMenu.html";
    });

});